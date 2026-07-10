import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-background to-background pt-16 pb-24 sm:pt-24 sm:pb-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Tu SIM/eSIM 5G española
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            activada online en 3 minutos.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Sin ir a la tienda. Sin contratos. Gigas que se acumulan y llamadas
          ilimitadas en España.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-[image:var(--gradient-brand)] px-8 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.02] hover:opacity-95"
          >
            <a href="#planes">Elegir mi plan</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-foreground/20 px-8 text-base font-semibold"
          >
            <a href="#como-funciona">¿Cómo funciona?</a>
          </Button>
        </div>
      </div>
    </section>
  );
}