import { Smartphone, Store, ScanFace } from "lucide-react";

const VERIFY_HINT =
  "La verificación se hace 100% online con tu cámara, sin necesidad de desplazarte a ninguna tienda.";

const esimSteps = [
  {
    title: "Elige tu plan",
    text: "80 GB o 150 GB. Sin permanencia y mismo precio para SIM y eSIM.",
  },
  {
    title: "Rellena tus datos y verifica tu identidad",
    text: "Escanea tu documento y haz un selfie.",
    hint: VERIFY_HINT,
  },
  {
    title: "Empieza a navegar",
    text: "Recibes tu eSIM al instante: escaneas el QR y ya estás conectado en 5G.",
  },
];

const simSteps = [
  {
    title: "Encuentra un partner y elige tu plan",
    text: "Acude a un partner de Connectivity y elige 80 GB o 150 GB.",
  },
  {
    title: "Rellena tus datos y verifica tu identidad",
    text: "Escanea tu documento y haz un selfie.",
    hint: VERIFY_HINT,
  },
  {
    title: "Activa tu SIM con el ICC y empieza a navegar",
    text: "Introduce el número de ICC de tu SIM física y quedará lista para usar.",
  },
];

function StepList({ steps }: { steps: typeof esimSteps }) {
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
              <p className="mt-1 text-xs text-muted-foreground/80">{s.hint}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-brand-orange)]">
          Cómo funciona
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Actívate en 3 pasos
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
              <h3 className="font-display text-xl font-bold">eSIM</h3>
              <p className="text-sm text-muted-foreground">Compra y activa desde la web, al instante.</p>
            </div>
          </div>
          <StepList steps={esimSteps} />
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
              <h3 className="font-display text-xl font-bold">SIM física</h3>
              <p className="text-sm text-muted-foreground">Recógela en tu partner de confianza.</p>
            </div>
          </div>
          <StepList steps={simSteps} />
        </div>
      </div>

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm font-medium text-foreground/80">
        <ScanFace className="h-5 w-5 text-[color:var(--color-brand-orange)]" />
        Verificación de identidad 100% online, sin desplazarte a ninguna tienda.
      </p>
    </section>
  );
}
