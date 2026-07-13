import { Smartphone, Store, ScanFace } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Step = { title: string; text: string; hint?: string };

function StepList({ steps, hint }: { steps: Step[]; hint: string }) {
  return (
    <ol className="mt-6 space-y-5">
      {steps.map((s, i) => (
        <li key={s.title} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[color:var(--color-brand-orange)]">
            {i + 1}
          </span>
          <div>
            <p className="font-semibold text-foreground">{s.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{s.text}</p>
            {s.hint ? (
              <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-brand-orange)]">
          {t.how.badge}
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t.how.title}
        </h2>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* eSIM */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Smartphone className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">{t.how.esimTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.how.esimSub}</p>
            </div>
          </div>
          <StepList steps={t.how.esimSteps} hint={t.how.verifyHint} />
        </div>

        {/* SIM física */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Store className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">{t.how.simTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.how.simSub}</p>
            </div>
          </div>
          <StepList steps={t.how.simSteps} hint={t.how.verifyHint} />
        </div>
      </div>

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm font-medium text-foreground/80">
        <ScanFace className="h-5 w-5 text-[color:var(--color-brand-orange)]" />
        {t.how.footnote}
      </p>
    </section>
  );
}
