import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { appendOrderToSheets, writePagoToSheets } from "./sheets";

/**
 * Stripe — PAGO ÚNICO (prepago de N meses). Modo test en localhost.
 *
 * Flujo nuevo: formulario → Stripe Checkout (pago único = precio × meses) →
 * /pago-ok → SOLO entonces se crea la fila en el Sheet (Input Form Web) con
 * Fecha Pago + Importe + ID Stripe → verificación Didit.
 *
 * (No se escribe NADA en el Sheet hasta que el pago está confirmado.)
 *
 * Variables de entorno:
 *   STRIPE_SECRET_KEY  -> sk_test_... (o sk_live_... en producción)
 *   APP_BASE_URL       -> opcional (por defecto http://localhost:8080)
 */

const STRIPE_API = "https://api.stripe.com/v1";

function appBase(): string {
  return process.env.APP_BASE_URL || "http://localhost:8080";
}

function requireStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe no está configurado (falta STRIPE_SECRET_KEY en .env).");
  return key;
}

async function stripe(
  path: string,
  method: "GET" | "POST",
  params?: Record<string, string>,
): Promise<Record<string, unknown>> {
  const key = requireStripeKey();
  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  let url = `${STRIPE_API}${path}`;
  if (params) {
    const body = new URLSearchParams(params).toString();
    if (method === "GET") url += `?${body}`;
    else init.body = body;
  }
  const res = await fetch(url, init);
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = json.error as { message?: string } | undefined;
    throw new Error(`Stripe ${res.status}: ${err?.message || "error"}`);
  }
  return json;
}

// Datos del pedido que viajan a Stripe (metadata) y se escriben tras el pago.
const OrderSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(3).max(40),
  simType: z.enum(["sim", "esim"]),
  icc: z.string().trim().max(40).optional().default(""),
  portability: z.enum(["no", "yes"]).default("no"),
  portaNumero: z.string().trim().max(40).optional().default(""),
  portaOperador: z.string().trim().max(60).optional().default(""),
  months: z.number().int().min(1).max(12),
  planId: z.enum(["p80", "p150"]),
  planCode: z.string().trim().min(1).max(40),
  planGb: z.number().int().positive(),
  planName: z.string().trim().min(1).max(80),
  price: z.number().positive(),
});

/** 1) Crea la sesión de Checkout (pago único = precio × meses). */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((input: unknown) => OrderSchema.parse(input))
  .handler(async ({ data }) => {
    const amount = Math.round(data.price * 100); // céntimos, por mes
    const session = await stripe("/checkout/sessions", "POST", {
      mode: "payment",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(amount),
      "line_items[0][price_data][product_data][name]": `${data.planName} — prepago`,
      "line_items[0][quantity]": String(data.months),
      allow_promotion_codes: "true",
      customer_email: data.email,
      success_url: `${appBase()}/pago-ok?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBase()}/?pago=cancelado`,
      // Todos los datos del pedido viajan en metadata; se escriben tras el pago.
      "metadata[name]": data.name,
      "metadata[email]": data.email,
      "metadata[phone]": data.phone,
      "metadata[simType]": data.simType,
      "metadata[icc]": data.icc,
      "metadata[portability]": data.portability,
      "metadata[portaNumero]": data.portaNumero,
      "metadata[portaOperador]": data.portaOperador,
      "metadata[months]": String(data.months),
      "metadata[planCode]": data.planCode,
      "metadata[planGb]": String(data.planGb),
      "metadata[price]": String(data.price),
    });

    const url = session.url as string | undefined;
    if (!url) throw new Error("Stripe no devolvió la URL de pago.");
    return { url };
  });

type SessionMeta = {
  name?: string;
  email?: string;
  phone?: string;
  simType?: string;
  icc?: string;
  portability?: string;
  portaNumero?: string;
  portaOperador?: string;
  months?: string;
  planCode?: string;
  planGb?: string;
  price?: string;
};

function ts(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ` +
    `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
  );
}
function ymd(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 2) Verifica el pago y, SOLO si está pagado, crea la fila en el Sheet. */
export const verifyCheckout = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ sessionId: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const session = await stripe(`/checkout/sessions/${data.sessionId}`, "GET");

    const paid = session.payment_status === "paid" || session.status === "complete";
    // En modo "payment" sin customer_creation, session.customer suele ser null;
    // usamos payment_intent (siempre presente si el pago se completó) como ID Stripe.
    const stripeId =
      (session.payment_intent as string | null) ?? (session.id as string | null) ?? "";
    const m = (session.metadata as SessionMeta | null) ?? {};

    if (!paid) return { paid: false as const, formRow: 0 };

    const months = Number(m.months || "1");
    const price = Number(m.price || "0");
    const now = new Date();
    // Order ID determinista a partir de la sesión → reintentos no duplican fila.
    const orderId = `ORD-${data.sessionId.slice(-14).toUpperCase()}`;

    // Fila A..N de "Input Form Web".
    const row: (string | number)[] = [
      ts(now),                                  // A  Time Stamp
      orderId,                                  // B  Order ID
      "ES",                                     // C  Country
      "Activation",                             // D  ProductAction
      Number(m.planGb || "0"),                  // E  Plan Type (GBs)
      "",                                       // F  Activation date
      ymd(now),                                 // G  Fecha Pago
      Math.round(price * months * 100) / 100,   // H  Importe pagado (Con IVA)
      "",                                       // I  Partner ID
      m.name || "",                             // J  Nombre Cliente
      m.email || "",                            // K  email Cliente
      m.simType === "sim" ? m.icc || "" : "",   // L  ICC (SIM física)
      m.phone || "",                            // M  Phone
      m.planCode || "",                         // N  Plan Code
      m.portability === "yes" ? m.portaNumero || "" : "",   // O  ICC PORTA (número actual)
      m.portability === "yes" ? m.portaOperador || "" : "", // P  OPERADOR (operador actual)
    ];

    const formRow = await appendOrderToSheets(orderId, row);
    // ID Stripe -> Validacion Didit (col A) enlazado a la fila del formulario.
    await writePagoToSheets(formRow, stripeId, ymd(now));

    return { paid: true as const, formRow };
  });
