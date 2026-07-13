import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PLAN_FAMILIES, type Plan, type PlanFamily } from "./plans";
import { COUNTRIES } from "./countries-data";
import { Check, Globe2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function PlansSection({ onBuy }: { onBuy: (plan: Plan) => void }) {
  const { t } = useI18n();
  return (
    <section id="planes" className="bg-[color:var(--color-brand-orange)]/[0.05] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-brand-orange)]/30 bg-white px-4 py-1.5 text-sm font-semibold text-[color:var(--color-brand-orange)] shadow-sm">
            {t.plans.badge}
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t.plans.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.plans.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
          {PLAN_FAMILIES.map((family) => (
            <PlanCard key={family.id} family={family} onBuy={onBuy} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  family,
  onBuy,
}: {
  family: PlanFamily;
  onBuy: (plan: Plan) => void;
}) {
  const { t } = useI18n();
  const fam = t.plans.families[family.id];
  const [idx, setIdx] = useState(0);
  const variant = family.variants[idx];
  const highlight = family.id === "intl";

  return (
    <div
      className={`relative flex flex-col rounded-3xl border-2 bg-card p-7 shadow-sm transition-all hover:shadow-[var(--shadow-brand)] sm:p-8 ${
        highlight
          ? "border-[color:var(--color-brand-orange)]"
          : "border-border hover:border-[color:var(--color-brand-orange)]/40"
      }`}
    >
      <span
        className={`absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-bold shadow-sm sm:left-8 ${
          highlight
            ? "bg-[image:var(--gradient-brand)] text-white"
            : "bg-foreground/85 text-white"
        }`}
      >
        {fam.badge}
      </span>

      <div>
        <h3 className="font-display text-2xl font-bold text-foreground">{fam.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{fam.tagline}</p>
      </div>

      {/* Selector de GB */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.plans.choose}
        </p>
        <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
          {family.variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setIdx(i)}
              aria-pressed={i === idx}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                i === idx
                  ? "bg-[image:var(--gradient-brand)] text-white shadow-sm"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {v.gb} GB
            </button>
          ))}
        </div>
      </div>

      {/* Precio (se adapta a la opción de GB elegida) */}
      <div className="mt-6 flex items-baseline gap-1">
        <span
          className="font-display text-5xl font-extrabold bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          {variant.priceLabel.replace(" €", "")}
        </span>
        <span className="text-lg font-semibold text-foreground/70">{t.plans.perMonth}</span>
      </div>

      {/* Características */}
      <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
        <li className="flex items-start gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-orange)]" />
          <span className="font-bold text-foreground">
            {variant.gb} {t.plans.gbSuffix}
          </span>
        </li>
        {fam.features.map((f) => (
          <li key={f.text} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-brand-orange)]" />
            {f.kind === "countries" ? (
              <CountriesFeature />
            ) : (
              <span className={f.kind === "bold" ? "font-bold text-foreground" : ""}>
                {f.text}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button
          onClick={() => onBuy(variant)}
          size="lg"
          className="h-14 w-full rounded-full bg-[image:var(--gradient-brand)] text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.02] hover:opacity-95"
        >
          {t.plans.buy}
        </Button>
      </div>
    </div>
  );
}

function CountriesFeature() {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex w-full cursor-pointer items-center gap-2 text-left font-medium text-foreground underline decoration-[color:var(--color-brand-orange)]/50 underline-offset-4 transition-colors hover:text-[color:var(--color-brand-orange)] hover:decoration-[color:var(--color-brand-orange)] sm:w-auto"
          aria-label={t.plans.intlAria}
        >
          <Globe2 className="h-4 w-4 text-[color:var(--color-brand-orange)]" aria-hidden />
          {t.plans.intl}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[calc(100vw-24px)] max-w-5xl overflow-hidden rounded-2xl border-border p-0 sm:rounded-3xl">
        <DialogHeader className="border-b border-border bg-[color:var(--color-brand-orange)]/[0.06] px-6 py-5 text-left sm:px-8">
          <DialogTitle className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t.plans.dialog.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-base leading-relaxed text-foreground/70">
            {t.plans.dialog.desc}&nbsp;
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-5 pt-4 sm:px-8 sm:pb-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_92px_92px] items-center gap-2 border-b border-border bg-muted/50 px-4 py-4 text-sm font-extrabold uppercase text-foreground/75 sm:grid-cols-[minmax(220px,1fr)_130px_130px] sm:px-6 sm:text-base">
              <span>{t.plans.dialog.country}</span>
              <span className="text-center">{t.plans.dialog.fijo}</span>
              <span className="text-center">{t.plans.dialog.movil}</span>
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
