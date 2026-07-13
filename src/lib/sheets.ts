/**
 * Cliente del webhook de Google Sheets (Apps Script).
 *
 * Si `SHEETS_WEBHOOK_URL` está definido, las server functions escriben en el
 * Google Sheet a través de este webhook (visible en vivo, y válido en Vercel).
 * Si no lo está, se usa el Excel local (ver xlsx.ts) como alternativa.
 *
 * Variables de entorno:
 *   SHEETS_WEBHOOK_URL     -> URL "/exec" de la implementación de Apps Script
 *   SHEETS_WEBHOOK_SECRET  -> el mismo SECRET_TOKEN de google-apps-script.gs
 */

export function usingSheets(): boolean {
  return !!process.env.SHEETS_WEBHOOK_URL;
}

type WebhookResponse = { ok?: boolean; row?: number; error?: string };

async function postToSheets(payload: Record<string, unknown>): Promise<WebhookResponse> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) throw new Error("SHEETS_WEBHOOK_URL no está configurado.");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET ?? "", ...payload }),
  });
  if (!res.ok) {
    throw new Error(`El webhook de Google Sheets respondió ${res.status}.`);
  }
  const json = (await res.json().catch(() => null)) as WebhookResponse | null;
  if (!json || json.ok !== true) {
    throw new Error(json?.error || "El webhook de Google Sheets rechazó la petición.");
  }
  return json;
}

/** Añade una fila a "Input Form Web" (dedupe por Order ID → reintentos no duplican). */
export async function appendOrderToSheets(
  orderId: string,
  values: (string | number)[],
): Promise<number> {
  const { row } = await postToSheets({ action: "order", orderId, values });
  return row ?? 0;
}

/** Escribe Fecha Pago (Input Form Web) + ID Stripe (Validacion Didit). */
export async function writePagoToSheets(
  formRow: number,
  stripeId: string,
  fechaPago: string,
): Promise<number> {
  const { row } = await postToSheets({ action: "pago", formRow, stripeId, fechaPago });
  return row ?? 0;
}

/** Añade una fila a "Incidencias" (soporte). Dedupe por Incidencia ID. */
export async function appendIncidenciaToSheets(
  incidenciaId: string,
  values: (string | number)[],
): Promise<number> {
  const { row } = await postToSheets({ action: "incidencia", incidenciaId, values });
  return row ?? 0;
}

/** Escribe/actualiza la fila de "Validacion Didit" (dedupe por fila de formulario). */
export async function writeValidacionToSheets(
  formRow: number,
  values: (string | number)[],
): Promise<number> {
  const { row } = await postToSheets({ action: "validacion", formRow, values });
  return row ?? 0;
}

/** Envía el mensaje del formulario de contacto (por email vía Apps Script). */
export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await postToSheets({ action: "contacto", ...input });
}
