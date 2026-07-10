import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/legal/cookies")({
  component: Cookies,
});

function Cookies() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver al inicio
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">Política de cookies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última actualización: 10 de julio de 2026.</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-bold">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos que se almacenan en tu navegador cuando visitas un sitio
              web. Se utilizan para recordar tus preferencias, mejorar tu experiencia y, en su caso,
              medir el uso del sitio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">2. Cookies que utilizamos</h2>
            <ul className="list-disc pl-5">
              <li>
                <strong>Cookies técnicas / esenciales:</strong> necesarias para el funcionamiento del
                sitio (por ejemplo, mantener tu sesión de compra activa mientras completas el pago y la
                verificación de identidad). No requieren consentimiento.
              </li>
              <li>
                <strong>Cookies de terceros (pago y verificación):</strong> Stripe y Didit pueden
                establecer sus propias cookies técnicas al procesar el pago y la verificación de
                identidad en sus páginas.
              </li>
              <li>
                <strong>Cookies analíticas (opcionales):</strong> si en el futuro se activan, se usarán
                únicamente con tu consentimiento previo, para entender cómo se usa la web y mejorarla.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">3. Gestión de tu consentimiento</h2>
            <p>
              Al entrar en la web puedes aceptar o rechazar las cookies no esenciales desde el banner de
              cookies. Puedes cambiar tu decisión en cualquier momento borrando las cookies almacenadas
              por tu navegador desde su configuración.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">4. Más información</h2>
            <p>
              Para cualquier duda sobre esta política, escríbenos a{" "}
              <a href="mailto:jan@connectivityglobal.com" className="underline">jan@connectivityglobal.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
