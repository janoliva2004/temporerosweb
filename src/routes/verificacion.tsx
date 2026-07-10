import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { checkVerification, startVerification } from "@/lib/didit";
import { Loader2, CheckCircle2, RotateCcw, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/verificacion")({
  component: Verificacion,
});

type UiState = "loading" | "approved" | "rejected" | "error";

function Verificacion() {
  const [state, setState] = useState<UiState>("loading");
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [formRow, setFormRow] = useState<number>(0);
  const [retrying, setRetrying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Preferimos los parámetros de la URL (sobreviven al retorno de Didit en móvil)
    // y usamos localStorage como respaldo.
    const params = new URLSearchParams(window.location.search);
    const sessionId =
      params.get("session_id") ||
      params.get("sessionId") ||
      localStorage.getItem("didit_session_id");
    const row = Number(
      params.get("form_row") || localStorage.getItem("didit_form_row") || "0",
    );
    setFormRow(row);

    if (!sessionId || !row) {
      setState("error");
      setMessage("No hay ninguna verificación en curso.");
      return;
    }

    let cancelled = false;
    let tries = 0;

    const tick = async () => {
      if (cancelled) return;
      tries++;
      try {
        const r = await checkVerification({ data: { sessionId, formRow: row } });
        if (cancelled) return;
        setStatus(r.status);
        if (r.done) {
          // La sesión ya se consumió; limpiamos el id (dejamos formRow para reintentar).
          localStorage.removeItem("didit_session_id");
          setState(r.status === "Approved" ? "approved" : "rejected");
          return;
        }
      } catch (e) {
        if (cancelled) return;
        setState("error");
        setMessage(e instanceof Error ? e.message : "Error consultando la verificación.");
        return;
      }
      if (tries < 60) setTimeout(tick, 3000);
      else {
        setState("error");
        setMessage("La verificación está tardando demasiado. Recarga la página para reintentar.");
      }
    };

    void tick();
    return () => {
      cancelled = true;
    };
  }, []);

  // Inicia una nueva verificación para el mismo pedido y redirige a Didit.
  async function handleRetry() {
    const row = formRow || Number(localStorage.getItem("didit_form_row") || "0");
    if (!row) return;
    setRetrying(true);
    try {
      const { url, sessionId } = await startVerification({ data: { formRow: row } });
      localStorage.setItem("didit_session_id", sessionId);
      localStorage.setItem("didit_form_row", String(row));
      window.location.href = url;
    } catch (e) {
      setRetrying(false);
      setMessage(e instanceof Error ? e.message : "No se pudo reiniciar la verificación.");
    }
  }

  const canRetry = formRow > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[color:var(--color-brand-orange)]" />
            <h1 className="mt-5 font-display text-2xl font-bold">Verificando tu identidad…</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Estamos comprobando tu documento con Didit. No cierres esta página.
            </p>
            {status ? <p className="mt-3 text-xs text-muted-foreground">Estado: {status}</p> : null}
          </>
        )}

        {state === "approved" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-5 font-display text-2xl font-bold">VERIFICACIÓN APROBADA</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Revisa tu correo para ver los detalles del pedido.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95"
              >
                Continuar
              </Link>
            </div>
          </>
        )}

        {(state === "rejected" || state === "error") && (
          <>
            <ShieldAlert className="mx-auto h-12 w-12 text-[color:var(--color-brand-orange)]" />
            <h1 className="mt-5 font-display text-2xl font-bold">
              No pudimos verificar tu identidad
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {state === "rejected"
                ? "La verificación no se completó. Asegúrate de que tu documento esté en vigor y de que la foto sea nítida, y vuelve a intentarlo."
                : message}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {canRetry && (
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95 disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4" />
                  {retrying ? "Abriendo verificación…" : "Reintentar verificación"}
                </button>
              )}
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Volver al inicio
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              ¿Sigues con problemas? Contáctanos por{" "}
              <a
                href="https://wa.me/34633391047"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                WhatsApp (633 39 10 47)
              </a>{" "}
              o en{" "}
              <a href="mailto:jan@connectivityglobal.com" className="underline hover:text-foreground">
                jan@connectivityglobal.com
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
