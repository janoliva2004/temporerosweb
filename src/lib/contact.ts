import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendContactMessage } from "./sheets";

/**
 * Formulario de contacto → email a jan@connectivityglobal.com (vía Apps Script
 * MailApp, sin necesidad de dominio ni servicio de email externo).
 */
export const submitContact = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1, "Nombre requerido").max(120),
        email: z.string().trim().email("Email no válido").max(160),
        message: z.string().trim().min(1, "Escribe un mensaje").max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await sendContactMessage(data);
    return { ok: true as const };
  });
