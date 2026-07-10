import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PLANS, type Plan } from "./plans";
import { COUNTRIES } from "./countries-data";
import { Check, Globe2, X } from "lucide-react";

export function PlansSection({ onBuy }: { onBuy: (plan: Plan) => void }) {
  return (
    <section id="planes" className="bg-[color:var(--color-brand-orange)]/[0.05] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-brand-orange)]/30 bg-white px-4 py-1.5 text-sm font-semibold text-[color:var(--color-brand-orange)] shadow-sm">
            Elige y activa hoy
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            2 súper planes con llamadas a tu país y gigas acumulables!
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecciona tu plan. La compra y la activación online empiezan aquí.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-6">
          {PLANS.map((plan) => (
            <PlanRow key={plan.id} plan={plan} onBuy={() => onBuy(plan)} />
          ))}
        </div>

      </div>
    </section>
  );
}

function PlanRow({ plan, onBuy }: { plan: Plan; onBuy: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onBuy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onBuy();
        }
      }}
      className="group grid cursor-pointer grid-cols-1 items-center gap-6 rounded-3xl border-2 border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[color:var(--color-brand-orange)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-orange)] md:grid-cols-[auto_auto_1fr_auto] md:gap-10 md:p-10"
    >
      <div className="flex items-baseline gap-1 md:min-w-[150px]">
        <span
          className="font-display text-6xl font-extrabold bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          {plan.priceLabel.replace(" €", "")}
        </span>
        <span className="text-lg font-semibold text-foreground/70">€/mes</span>
      </div>

      <div className="md:min-w-[170px] md:border-l md:border-border md:pl-10">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Móvil</p>
        <p className="font-display text-3xl font-bold text-foreground">
          {plan.gb} <span className="text-xl font-semibold text-foreground/70">GB</span>
        </p>
      </div>

      <ul className="space-y-2 text-sm text-foreground/80 md:pl-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-orange)]" />
            {f.toLowerCase().includes("países") ? (
              <CountriesFeature />
            ) : (
              <span className={f.toLowerCase().includes("acumulables") ? "font-bold text-foreground" : ""}>
                {f}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="md:min-w-[200px]">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onBuy();
          }}
          size="lg"
          className="h-14 w-full rounded-full bg-[image:var(--gradient-brand)] text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform group-hover:scale-[1.02] hover:opacity-95"
        >
          Comprar y activar
        </Button>
      </div>
    </div>
  );
}

function CountriesFeature() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex w-full cursor-pointer items-center gap-2 text-left font-medium text-foreground underline decoration-[color:var(--color-brand-orange)]/50 underline-offset-4 transition-colors hover:text-[color:var(--color-brand-orange)] hover:decoration-[color:var(--color-brand-orange)] sm:w-auto"
          aria-label="Ver países disponibles para llamadas internacionales"
        >
          <Globe2 className="h-4 w-4 text-[color:var(--color-brand-orange)]" aria-hidden />
          1.000 min a países (fijo y móvil)
        </button>
      </DialogTrigger>


      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-[calc(100vw-24px)] max-w-5xl overflow-hidden rounded-2xl border-border p-0 sm:rounded-3xl"
      >
        <DialogHeader className="border-b border-border bg-[color:var(--color-brand-orange)]/[0.06] px-6 py-5 text-left sm:px-8">
          <DialogTitle className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Países incluidos en el bono internacional
          </DialogTitle>
          <DialogDescription className="mt-2 text-base leading-relaxed text-foreground/70">
            1.000 minutos a destinos internacionales.&nbsp;
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-5 pt-4 sm:px-8 sm:pb-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_92px_92px] items-center gap-2 border-b border-border bg-muted/50 px-4 py-4 text-sm font-extrabold uppercase text-foreground/75 sm:grid-cols-[minmax(220px,1fr)_130px_130px] sm:px-6 sm:text-base">
              <span>País</span>
              <span className="text-center">Fijo</span>
              <span className="text-center">Móvil</span>
            </div>

            <ul className="max-h-[58vh] divide-y divide-border/60 overflow-y-auto">
              {COUNTRIES.map((c) => (
                <li
                  key={c.name}
                  className="grid grid-cols-[minmax(0,1fr)_92px_92px] items-center gap-2 px-4 py-4 text-lg text-foreground sm:grid-cols-[minmax(220px,1fr)_130px_130px] sm:px-6 sm:text-xl"
                >
                  <span className="min-w-0 font-semibold leading-snug">{c.name}</span>
                  <Availability available={c.fijo} />
                  <Availability available={c.movil} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Availability({ available }: { available: boolean }) {
  return (
    <span className="flex justify-center">
      {available ? (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-brand-orange)]/[0.12] text-[color:var(--color-brand-orange)] sm:h-12 sm:w-12">
          <Check className="h-6 w-6 sm:h-7 sm:w-7" aria-label="Sí" />
        </span>
      ) : (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground/35 sm:h-12 sm:w-12">
          <X className="h-6 w-6 sm:h-7 sm:w-7" aria-label="No" />
        </span>
      )}
    </span>
  );
}
