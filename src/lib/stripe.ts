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
  planId: z.enum(["intl80", "intl150", "nac60", "nac150"]),
  planCode: z.string().trim().min(1).max(40),
  planGb: z.number().int().positive(),
  planName: z.string().trim().min(1).max(80),
  price: z.number().positive(),
  // IDs de producto de Stripe por modo (test / live). El servidor elige según
  // la clave. Enlazar el producto real hace que los cupones limitados a ese
  // producto se apliquen en el checkout.
  stripeProduct: z
    .object({
      test: z.string().trim().max(60).optional(),
      live: z.string().trim().max(60).optional(),
    })
    .optional(),
});

/** 1) Crea la sesión de Checkout (pago único = precio × meses). */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((input: unknown) => OrderSchema.parse(input))
  .handler(async ({ data }) => {
    const amount = Math.round(data.price * 100); // céntimos, por mes

    // Enlazamos el pedido al producto real de Stripe del modo actual (test o
    // live). Así el checkout muestra el nombre real del producto y los cupones
    // limitados a ese producto se aplican. Si no hay ID para este modo, usamos
    // un nombre al vuelo para no romper (funciona, pero sin restricción de
    // cupón por producto).
    const isLiveKey = requireStripeKey().startsWith("sk_live_");
    const productId = isLiveKey
      ? data.stripeProduct?.live
      : data.stripeProduct?.test;
    const productParam: Record<string, string> = productId
      ? { "line_items[0][price_data][product]": productId }
      : { "line_items[0][price_data][product_data][name]": `${data.planName} — prepago` };

    const session = await stripe("/checkout/sessions", "POST", {
      mode: "payment",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(amount),
      ...productParam,
      "line_items[0][quantity]": String(data.months),
      allow_promotion_codes: "true",
      customer_email: data.email,
      // Recibo por email al cliente (en modo live). Refuerza el ajuste del panel.
      "payment_intent_data[receipt_email]": data.email,
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

// Descompone una fecha en la zona horaria de Madrid (ajusta verano/invierno solo).
function madridParts(d: Date): Record<string, string> {
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
  const out: Record<string, string> = {};
  for (const part of fmt.formatToParts(d)) out[part.type] = part.value;
  return out;
}

function ts(d: Date): string {
  const p = madridParts(d);
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
}
function ymd(d: Date): string {
  const p = madridParts(d);
  return `${p.year}-${p.month}-${p.day}`;
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
    // Order ID = ID de Stripe del pago (payment_intent, ej. "pi_…"). Así la col B
    // de "Input Form Web" coincide con el ID de Stripe. Es estable por pago, así
    // que los reintentos de /pago-ok no duplican fila. Fallback determinista por
    // si Stripe no devolviera el ID, para no dejar la celda vacía.
    const orderId = stripeId || `ORD-${data.sessionId.slice(-14).toUpperCase()}`;

    // Fila A..T de "Input Form Web".
    const row: (string | number)[] = [
      ts(now),                                             // A  Time Stamp
      "ES",                                                // B  Country
      m.name || "",                                        // C  Nombre Cliente
      m.email || "",                                        // D  email Cliente
      "",                                                  // E  Activation date
      m.simType === "sim" ? "SIM" : "eSIM",                // F  SIM/eSIM
      orderId,                                             // G  Order ID
      m.simType === "sim" ? m.icc || "" : "",              // H  ICC (SIM física)
      "Activation",                                        // I  ProductAction
      Number(m.planGb || "0"),                             // J  Plan Type (GBs)
      months * 30,                                         // K  Plan duration (días)
      "",                                                  // L  Fecha Pago (lo escribe el action "pago")
      Math.round(price * months * 100) / 100,              // M  Importe pagado (Con IVA)
      "",                                                  // N  Partner ID
      m.phone || "",                                       // O  Phone
      m.planCode || "",                                    // P  Plan Code
      m.portability === "yes" ? m.portaNumero || "" : "",  // Q  Numero portabilidad
      m.portability === "yes" ? m.portaOperador || "" : "",// R  Operador
      "",                                                  // S  Referral
      m.phone || "",                                       // T  Numero cliente
    ];

    const formRow = await appendOrderToSheets(orderId, row);
    // ID Stripe -> Validacion Didit (col A) enlazado a la fila del formulario.
    await writePagoToSheets(formRow, stripeId, ymd(now));

    return { paid: true as const, formRow };
  });
