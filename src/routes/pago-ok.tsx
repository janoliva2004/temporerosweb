import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { verifyCheckout } from "@/lib/stripe";
import { startVerification } from "@/lib/didit";
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/pago-ok")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  component: PagoOk,
});

type UiState = "checking" | "paid" | "unpaid" | "error";

function PagoOk() {
  const { session_id } = Route.useSearch();
  const [state, setState] = useState<UiState>("checking");
  const [message, setMessage] = useState("");
  const [formRow, setFormRow] = useState(0);
  const [starting, setStarting] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!session_id) {
      setState("error");
      setMessage("No se encontró la sesión de pago.");
      return;
    }

    verifyCheckout({ data: { sessionId: session_id } })
      .then((r) => {
        setFormRow(r.formRow);
        if (r.paid) setState("paid");
        else {
          setState("unpaid");
          setMessage("El pago no se completó. Puedes intentarlo de nuevo.");
        }
      })
      .catch((e) => {
        setState("error");
        setMessage(e instanceof Error ? e.message : "Error verificando el pago.");
      });
  }, [session_id]);

  async function handleVerify() {
    if (!formRow) return;
    setStarting(true);
    try {
      const { url, sessionId } = await startVerification({ data: { formRow } });
      sessionStorage.setItem("didit_session_id", sessionId);
      sessionStorage.setItem("didit_form_row", String(formRow));
      window.location.href = url;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "No se pudo iniciar la verificación.");
      setStarting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        {state === "checking" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[color:var(--color-brand-orange)]" />
            <h1 className="mt-5 font-display text-2xl font-bold">Confirmando tu pago…</h1>
            <p className="mt-2 text-sm text-muted-foreground">Un momento, por favor.</p>
          </>
        )}

        {state === "paid" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-5 font-display text-2xl font-bold">¡Pago confirmado!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu suscripción está activa. Último paso: verifica tu identidad.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border p-4 text-left">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-brand-orange)]" />
              <p className="text-sm text-muted-foreground">
                Escanea tu documento y haz un selfie. Al terminar volverás aquí automáticamente.
              </p>
            </div>
            <button
              onClick={handleVerify}
              disabled={starting}
              className="mt-6 w-full rounded-full bg-[image:var(--gradient-brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95 disabled:opacity-60"
            >
              {starting ? "Abriendo verificación…" : "Verificar identidad"}
            </button>
          </>
        )}

        {(state === "unpaid" || state === "error") && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h1 className="mt-5 font-display text-2xl font-bold">No pudimos confirmar el pago</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-5 py-2 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95"
              >
                Volver al inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
