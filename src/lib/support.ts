import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { appendIncidenciaToSheets } from "./sheets";

/**
 * Formulario de soporte → fila en la hoja "Incidencias" del Google Sheet.
 *
 * No usa email (evita el permiso MailApp): cada envío escribe una fila con
 * fecha, nº de incidencia, datos del cliente, categoría, mensaje y estado.
 */

// Códigos de categoría que envía el formulario (estables entre idiomas).
export const INCIDENCIA_CATEGORIES = [
  "activacion",
  "pagos",
  "cobertura",
  "sim",
  "portabilidad",
  "otro",
] as const;

// Etiqueta en español que se guarda en la hoja (consistente, no depende del idioma de la web).
const CATEGORY_LABEL_ES: Record<(typeof INCIDENCIA_CATEGORIES)[number], string> = {
  activacion: "Activación",
  pagos: "Cobros y pagos",
  cobertura: "Cobertura / red",
  sim: "SIM / eSIM",
  portabilidad: "Portabilidad",
  otro: "Otro",
};

function madridTs(d: Date): string {
  const fmt = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(d)) p[part.type] = part.value;
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
}

export const submitIncidencia = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1, "Nombre requerido").max(120),
        email: z.string().trim().email("Email no válido").max(160),
        phone: z.string().trim().max(40).optional().default(""),
        category: z.enum(INCIDENCIA_CATEGORIES).default("otro"),
        message: z.string().trim().min(1, "Describe tu incidencia").max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const now = new Date();
    // Nº de incidencia determinista y corto; sirve de referencia al cliente.
    const id = `INC-${now.getTime().toString(36).toUpperCase()}`;

    // Fila A..H de "Incidencias".
    const row: (string | number)[] = [
      madridTs(now), // A  Time Stamp
      id, // B  Incidencia ID
      data.name, // C  Nombre
      data.email, // D  Email
      data.phone, // E  Teléfono
      CATEGORY_LABEL_ES[data.category], // F  Categoría
      data.message, // G  Mensaje
      "Abierta", // H  Estado
    ];

    await appendIncidenciaToSheets(id, row);
    return { ok: true as const, id };
  });
