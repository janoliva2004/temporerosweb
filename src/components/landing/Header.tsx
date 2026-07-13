import { Button } from "@/components/ui/button";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/20 p-0.5">
      {LANGS.map((l: Lang) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase transition-colors ${
            lang === l ? "bg-white text-foreground" : "text-white/70 hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-foreground/90 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center">
          <img src="/logo-connectivity.png" alt="Connectivity" className="h-9 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-white">{t.header.nav.como}</a>
          <a href="#planes" className="transition-colors hover:text-white">{t.header.nav.planes}</a>
          <a href="#paises" className="transition-colors hover:text-white">{t.header.nav.paises}</a>
          <a href="#faq" className="transition-colors hover:text-white">{t.header.nav.faq}</a>
          <a href="#contacto" className="transition-colors hover:text-white">{t.header.nav.contacto}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            asChild
            className="hidden rounded-full bg-[image:var(--gradient-brand)] font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-[1.02] hover:opacity-95 sm:inline-flex"
          >
            <a href="#planes">{t.header.cta}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
