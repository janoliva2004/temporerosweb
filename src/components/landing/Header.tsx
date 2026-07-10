import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-foreground/90 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center">
          <img src="/logo-connectivity.png" alt="Connectivity" className="h-9 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-white">Cómo funciona</a>
          <a href="#planes" className="transition-colors hover:text-white">Planes</a>
          <a href="#paises" className="transition-colors hover:text-white">Países</a>
          <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          <a href="#contacto" className="transition-colors hover:text-white">Contacto</a>
        </nav>
        <Button
          asChild
          className="rounded-full bg-[image:var(--gradient-brand)] font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.02] hover:opacity-95"
        >
          <a href="#planes">Ver planes</a>
        </Button>
      </div>
    </header>
  );
}