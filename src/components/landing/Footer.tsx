import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-foreground text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <img src="/logo-connectivity.png" alt="Connectivity" className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            {t.footer.tagline}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-display font-bold">{t.footer.plans}</p>
          <ul className="mt-3 space-y-2 text-white/70">
            <li><a href="#planes" className="hover:text-white">Connectivity 80</a></li>
            <li><a href="#planes" className="hover:text-white">Connectivity 150</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-display font-bold">{t.footer.company}</p>
          <ul className="mt-3 space-y-2 text-white/70">
            <li><a href="#como-funciona" className="hover:text-white">{t.footer.como}</a></li>
            <li><a href="#faq" className="hover:text-white">{t.footer.faq}</a></li>
            <li><a href="/legal/aviso-legal" className="hover:text-white">{t.footer.aviso}</a></li>
            <li><a href="/legal/privacidad" className="hover:text-white">{t.footer.privacidad}</a></li>
            <li><a href="/legal/cookies" className="hover:text-white">{t.footer.cookies}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Connectivity. {t.footer.rights}
      </div>
    </footer>
  );
}
