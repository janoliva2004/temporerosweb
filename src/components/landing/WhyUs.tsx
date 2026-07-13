import { Signal, MonitorSmartphone, Layers, Smartphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const icons = [Signal, MonitorSmartphone, Layers, Smartphone];

export function WhyUs() {
  const { t } = useI18n();
  return (
    <section id="por-que" className="bg-orange-50/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t.why.title}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.points.map((p, i) => {
            const Icon = icons[i];
            return (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
