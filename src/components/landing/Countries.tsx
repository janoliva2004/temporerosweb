import { useMemo, useState } from "react";
import { Check, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "./countries-data";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


export function Countries() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const nq = normalize(q.trim());
    const list = nq
      ? COUNTRIES.filter((c) => normalize(c.name).includes(nq))
      : COUNTRIES;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [q]);

  const totalFijo = COUNTRIES.filter((c) => c.fijo).length;
  const totalMovil = COUNTRIES.filter((c) => c.movil).length;

  return (
    <section id="paises" className="border-t border-border/60 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Destinos internacionales
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Descubre a qué países puedes llamar
          </h2>
          <p className="mt-4 text-base text-foreground/70">
            Bono de voz internacional de <strong>1.000 minutos</strong> a los siguientes destinos.
            Consulta si el país que buscas está incluido para llamadas a fijo, móvil o ambos.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background p-5 text-center shadow-sm">
            <div className="font-display text-3xl font-bold text-foreground">{COUNTRIES.length}</div>
            <div className="mt-1 text-sm text-foreground/60">Destinos disponibles</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background p-5 text-center shadow-sm">
            <div className="font-display text-3xl font-bold text-foreground">{totalFijo}</div>
            <div className="mt-1 text-sm text-foreground/60">Con llamadas a fijo</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background p-5 text-center shadow-sm">
            <div className="font-display text-3xl font-bold text-foreground">{totalMovil}</div>
            <div className="mt-1 text-sm text-foreground/60">Con llamadas a móvil</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border/60 bg-background shadow-sm">
          <div className="border-b border-border/60 p-4 sm:p-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar país…"
                className="h-11 rounded-full border-border/60 pl-10 text-sm"
                aria-label="Buscar país"
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50 sm:px-6">
            <span>País</span>
            <span className="w-16 text-center sm:w-24">Fijo</span>
            <span className="w-16 text-center sm:w-24">Móvil</span>
          </div>

          <ul className="max-h-[520px] divide-y divide-border/60 overflow-y-auto">
            {filtered.map((c) => (
              <li
                key={c.name}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 text-sm text-foreground sm:px-6"
              >
                <span className="font-medium">{c.name}</span>
                <span className="flex w-16 justify-center sm:w-24">
                  {c.fijo ? (
                    <Check className="h-5 w-5 text-primary" aria-label="Incluido" />
                  ) : (
                    <X className="h-5 w-5 text-foreground/30" aria-label="No incluido" />
                  )}
                </span>
                <span className="flex w-16 justify-center sm:w-24">
                  {c.movil ? (
                    <Check className="h-5 w-5 text-primary" aria-label="Incluido" />
                  ) : (
                    <X className="h-5 w-5 text-foreground/30" aria-label="No incluido" />
                  )}
                </span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-foreground/60">
                No encontramos ese país en los destinos incluidos.
              </li>
            )}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/50">
          Superado el bono de voz internacional, el precio de la llamada y el establecimiento serán
          el estándar de cada destino.
        </p>
      </div>
    </section>
  );
}