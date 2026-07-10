import { Signal, MonitorSmartphone, Layers, Smartphone } from "lucide-react";

const points = [
  {
    icon: Signal,
    title: "Red MÁS Orange 5G",
    text: "Una de las mejores redes de España, a precios muy competitivos.",
  },
  {
    icon: MonitorSmartphone,
    title: "Activación 100% online",
    text: "Fácil y rápido, sin ir a ninguna tienda ni hacer cola.",
  },
  {
    icon: Layers,
    title: "Gigas acumulables",
    text: "Lo que no uses este mes, lo tienes el mes siguiente.",
  },
  {
    icon: Smartphone,
    title: "Escoge tu formato",
    text: "SIM física o eSIM, tú decides. Mismo precio para las dos.",
  },
];

export function WhyUs() {
  return (
    <section id="por-que" className="bg-orange-50/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Por qué Connectivity
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}