import { useEffect, useState } from "react";

const STORAGE_KEY = "connectivity_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function choose(value: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/80">
          Usamos cookies propias necesarias para el funcionamiento de la web (pago y verificación de
          identidad) y, con tu consentimiento, cookies opcionales para mejorar tu experiencia. Consulta
          nuestra{" "}
          <a href="/legal/cookies" className="underline hover:text-foreground">
            política de cookies
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose("rejected")}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Rechazar
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-full bg-[image:var(--gradient-brand)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
