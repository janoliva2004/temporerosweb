import { Smartphone, ScanFace, Wifi } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Elige tu plan",
    text: "eSIM (al instante) o SIM física (te llega a casa gratis). Tú decides.",
  },
  {
    icon: ScanFace,
    title: "Verifica tu identidad con la cámara",
    text: "Escanea tu documento (pasaporte, NIE o DNI) y haz un selfie. Nuestro sistema lo comprueba en segundos. Es seguro y legal.",
  },
  {
    icon: Wifi,
    title: "Empieza a navegar",
    text: "Con la eSIM recibes un código QR y activas al momento. La SIM física llega ya lista para usar.",
  },
];

export function ActivationSteps() {
  return (
    <section id="activacion" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Ten tu línea en 3 pasos, sin ir a ninguna tienda
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-3xl border border-border bg-card p-8 shadow-sm"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              <s.icon className="h-8 w-8" />
            </div>
            <span className="absolute right-6 top-6 font-display text-5xl font-extrabold text-orange-100">
              {i + 1}
            </span>
            <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-lg font-medium text-foreground/80">
        Todo desde tu móvil. Sin colas, sin papeles, sin esperas.
      </p>
    </section>
  );
}