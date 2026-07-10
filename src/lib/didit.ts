import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  mutateWorkbook,
  firstFreeRow,
  writeRowValues,
  friendlyExcelError,
} from "./xlsx";
import { usingSheets, writeValidacionToSheets } from "./sheets";

/**
 * Integración con Didit (verificación de identidad / KYC).
 *
 * Flujo (localhost, sin dominio → usamos POLLING en vez de webhook):
 *   1. startVerification: crea una sesión en Didit y devuelve la `url` a la que
 *      redirigir al cliente y el `sessionId`.
 *   2. El cliente escanea su documento + selfie en la página de Didit.
 *   3. Al volver a /verificacion, checkVerification consulta el resultado. Cuando
 *      es terminal (Approved/Declined/…), escribe la fila en "Validacion Didit".
 *
 * Variables de entorno (ver .env.example):
 *   DIDIT_API_KEY          -> API key secreta (cabecera x-api-key)
 *   DIDIT_KYC_WORKFLOW_ID  -> id del workflow de verificación (KYC) en Didit
 *                             (alternativa: DIDIT_WORKFLOW_ID)
 *   DIDIT_BASE_URL         -> opcional (por defecto https://verification.didit.me)
 *   APP_BASE_URL           -> opcional (por defecto http://localhost:8080)
 */

const VALIDACION_SHEET = "Validacion Didit";
const TERMINAL_STATUSES = ["Approved", "Declined", "In Review", "Abandoned"];

function diditBase(): string {
  return process.env.DIDIT_BASE_URL || "https://verification.didit.me";
}

function appBase(): string {
  return process.env.APP_BASE_URL || "http://localhost:8080";
}

function requireDiditConfig(): { apiKey: string; workflowId: string } {
  const apiKey = process.env.DIDIT_API_KEY;
  // Workflow de KYC. Acepta DIDIT_KYC_WORKFLOW_ID (nombre en Vercel) y, como
  // alternativa, el nombre genérico DIDIT_WORKFLOW_ID.
  const workflowId =
    process.env.DIDIT_KYC_WORKFLOW_ID || process.env.DIDIT_WORKFLOW_ID;
  if (!apiKey || !workflowId) {
    throw new Error(
      "Didit no está configurado (faltan DIDIT_API_KEY / DIDIT_KYC_WORKFLOW_ID en .env).",
    );
  }
  return { apiKey, workflowId };
}

/** 1) Crea la sesión de verificación y devuelve la URL a la que redirigir. */
export const startVerification = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ formRow: z.number().int().positive() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { apiKey, workflowId } = requireDiditConfig();

    const res = await fetch(`${diditBase()}/v2/session/`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow_id: workflowId,
        vendor_data: String(data.formRow), // referencia a la fila del formulario
        // Llevamos form_row en la URL de retorno: así, aunque el móvil pierda el
        // almacenamiento del navegador al volver de Didit, seguimos sabiendo la fila.
        callback: `${appBase()}/verificacion?form_row=${data.formRow}`,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Didit no pudo crear la sesión (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = (await res.json()) as { session_id?: string; url?: string };
    if (!json.session_id || !json.url) {
      throw new Error("Respuesta inesperada de Didit al crear la sesión.");
    }
    return { sessionId: json.session_id, url: json.url };
  });

type IdVerification = {
  first_name?: string;
  last_name?: string;
  document_number?: string;
  expiration_date?: string;
  date_of_expiry?: string;
  issuing_state?: string;
  issuing_country?: string;
};

type DecisionResponse = {
  status?: string;
  decision?: { status?: string; id_verifications?: IdVerification[] };
  id_verifications?: IdVerification[];
};

/** 2) Consulta el resultado (polling). Si es terminal, escribe en la hoja. */
export const checkVerification = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({ sessionId: z.string().min(1), formRow: z.number().int().positive() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { apiKey } = requireDiditConfig();

    const res = await fetch(`${diditBase()}/v3/session/${data.sessionId}/decision/`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Didit no devolvió el resultado (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = (await res.json()) as DecisionResponse;
    const status = json.status ?? json.decision?.status ?? "Unknown";
    const done = TERMINAL_STATUSES.includes(status);

    // Datos extraídos del documento (primer id_verification disponible).
    const idv =
      json.decision?.id_verifications?.[0] ?? json.id_verifications?.[0] ?? {};
    const extracted = {
      firstName: idv.first_name ?? "",
      lastName: idv.last_name ?? "",
      documentNumber: idv.document_number ?? "",
      expiration: idv.expiration_date ?? idv.date_of_expiry ?? "",
      country: idv.issuing_state ?? idv.issuing_country ?? "ES",
    };

    if (done) {
      // Columnas A..J de "Validacion Didit".
      const values: (string | number)[] = [
        "",                          // A  ID Stripe (pendiente de conectar Stripe)
        status,                      // B  Accion validar (resultado Didit)
        extracted.firstName,         // C  Nombre
        extracted.lastName,          // D  Apellido
        extracted.documentNumber,    // E  DNI
        extracted.expiration,        // F  Fecha de caducidad DNI
        extracted.country,           // G  Country
        "",                          // H  (vacía)
        "",                          // I  (vacía)
        data.formRow,                // J  Fila formulario
      ];

      // Destino: Google Sheets (si está configurado) o Excel local (alternativa).
      if (usingSheets()) {
        await writeValidacionToSheets(data.formRow, values);
      } else {
        try {
          await mutateWorkbook((wb) => {
            const ws = wb.getWorksheet(VALIDACION_SHEET);
            if (!ws) throw new Error(`No existe la hoja "${VALIDACION_SHEET}"`);

            // Dedupe: si ya hay fila para esta "Fila formulario" (col J), la actualiza.
            let target = 0;
            for (let r = 2; r <= ws.rowCount; r++) {
              if (String(ws.getRow(r).getCell(10).value ?? "") === String(data.formRow)) {
                target = r;
                break;
              }
            }
            if (!target) target = firstFreeRow(ws, 2); // col B como clave

            writeRowValues(ws, target, values);
          });
        } catch (err) {
          throw new Error(friendlyExcelError(err));
        }
      }
    }

    return { status, done, ...extracted };
  });
