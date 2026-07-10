import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Activación de SIM vía API de Orange  →  hoja "Activaciones API".
 *
 * ESTADO: ESQUELETO / PENDIENTE. La llamada real a Orange NO está implementada
 * porque depende de la documentación del contrato de Orange (endpoints, auth,
 * formato). Cuando llegue la doc + credenciales, se rellena `callOrangeActivate`.
 *
 * Disparador acordado: se llama SOLO tras pago confirmado + Didit "Approved".
 * (Se enganchará en checkVerification de src/lib/didit.ts cuando esté lista.)
 *
 * Variables de entorno (a definir cuando tengamos la doc de Orange):
 *   ORANGE_API_BASE   -> URL base de la API
 *   ORANGE_API_KEY    -> credencial (o el par usuario/clave / OAuth que corresponda)
 *
 * Mapeo previsto a "Activaciones API" (A..V). Fuente de cada dato:
 *   A Country            <- pedido (ES)
 *   B ICC                <- RESPUESTA Orange
 *   C Numero             <- RESPUESTA Orange
 *   D Producto           <- pedido (plan / Plan Code)
 *   E SIM-ESIM           <- pedido (simType)
 *   F Fecha              <- fecha de activación (hoy / respuesta Orange)
 *   G Fecha caducidad    <- RESPUESTA Orange
 *   H Numero meses       <- pedido / suscripción
 *   I Estado             <- RESPUESTA Orange
 *   J Accion             <- "Activation"
 *   K Cliente            <- pedido (nombre)
 *   L Email              <- pedido (email)
 *   M ID Stripe          <- Stripe (customer id)
 *   N Fecha pago         <- Stripe
 *   O Importe pago       <- Stripe / plan
 *   P Importe sin IVA    <- calculado (Importe / 1.21)
 *   Q Partner ID         <- pedido
 *   R Referal            <- pedido (si hay)
 *   S Proveedor          <- "Orange"
 *   T Ticket             <- (interno)
 *   U Mail aviso         <- (interno)
 *   V Activation/Extension <- "Activation"
 */

function orangeConfig(): { base: string; apiKey: string } {
  const base = process.env.ORANGE_API_BASE;
  const apiKey = process.env.ORANGE_API_KEY;
  if (!base || !apiKey) {
    throw new Error(
      "La API de Orange aún no está configurada (faltan ORANGE_API_BASE / ORANGE_API_KEY).",
    );
  }
  return { base, apiKey };
}

type ActivationResult = {
  icc: string;
  numero: string;
  fechaCaducidad: string;
  estado: string;
};

/**
 * TODO(Orange): implementar la llamada real cuando tengamos la documentación.
 * Debe activar la línea y devolver ICC, número, caducidad y estado.
 */
async function callOrangeActivate(_input: {
  simType: "sim" | "esim";
  planCode: string;
  icc?: string;
}): Promise<ActivationResult> {
  orangeConfig(); // valida credenciales
  throw new Error("Activación Orange pendiente de implementar (falta doc de la API).");
}

/**
 * Punto de entrada de la activación. Hoy solo valida y lanza el TODO; cuando la
 * API esté implementada, además escribirá la fila en "Activaciones API" (acción
 * "activacion" del webhook de Apps Script, aún por añadir).
 */
export const activateLine = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        formRow: z.number().int().positive(),
        simType: z.enum(["sim", "esim"]),
        planCode: z.string().min(1),
        icc: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const result = await callOrangeActivate({
      simType: data.simType,
      planCode: data.planCode,
      icc: data.icc,
    });
    // TODO: escribir result + datos del pedido/pago en la hoja "Activaciones API".
    return { ok: true as const, ...result };
  });
