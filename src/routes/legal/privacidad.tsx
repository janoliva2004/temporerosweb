import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/legal/privacidad")({
  component: Privacidad,
});

function Privacidad() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver al inicio
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">Política de privacidad</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última actualización: 10 de julio de 2026.</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-bold">1. Responsable del tratamiento</h2>
            <ul className="list-disc pl-5">
              <li><strong>Responsable:</strong> Connectivity World Global, S.L.U.</li>
              <li><strong>CIF:</strong> B66347634</li>
              <li><strong>Domicilio:</strong> Calle del Císter, 45, 08022 Barcelona, España</li>
              <li>
                <strong>Contacto:</strong>{" "}
                <a href="mailto:info@connectivityglobal.com" className="underline">info@connectivityglobal.com</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">2. Datos que recogemos</h2>
            <p>Al contratar una línea a través de esta web tratamos los siguientes datos:</p>
            <ul className="list-disc pl-5">
              <li><strong>Datos de contacto:</strong> nombre, email y teléfono facilitados en el formulario de compra o contacto.</li>
              <li><strong>Datos de la línea:</strong> formato elegido (SIM/eSIM), número de ICC, si solicitas portabilidad, plan y meses contratados.</li>
              <li><strong>Datos de pago:</strong> procesados directamente por Stripe; no almacenamos los datos de tu tarjeta en nuestros servidores.</li>
              <li><strong>Datos de identidad (KYC):</strong> nombre, apellidos, número de documento, fecha de caducidad y país de emisión, extraídos de tu documento oficial durante la verificación con Didit, exigida por la normativa de telecomunicaciones para la activación de líneas de prepago.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">3. Finalidad del tratamiento</h2>
            <ul className="list-disc pl-5">
              <li>Gestionar la contratación, el pago y la activación de tu línea Connectivity.</li>
              <li>Cumplir con la obligación legal de identificación del titular de líneas de prepago.</li>
              <li>Atender consultas realizadas a través del formulario de contacto.</li>
              <li>Enviarte comunicaciones relacionadas con tu pedido (confirmación de pago, estado de verificación, activación).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">4. Base legal</h2>
            <p>
              El tratamiento se basa en la ejecución del contrato de prestación de servicios de
              telecomunicaciones que solicitas, en el cumplimiento de obligaciones legales (identificación
              de titulares de líneas prepago) y, en su caso, en tu consentimiento (por ejemplo, para
              comunicaciones comerciales o cookies no esenciales).
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">5. Encargados y terceros</h2>
            <p>Para prestar el servicio compartimos datos estrictamente necesarios con:</p>
            <ul className="list-disc pl-5">
              <li><strong>Stripe</strong> — procesamiento del pago.</li>
              <li><strong>Didit</strong> — verificación de identidad (KYC).</li>
              <li><strong>Google (Google Sheets / Apps Script)</strong> — registro interno de pedidos.</li>
              <li><strong>MÁS Orange / partners de activación</strong> — activación técnica de la línea.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">6. Conservación</h2>
            <p>
              Conservamos tus datos durante el tiempo necesario para la prestación del servicio y,
              posteriormente, durante los plazos exigidos por la normativa fiscal, de telecomunicaciones y
              de prevención del fraude.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">7. Tus derechos</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
              portabilidad escribiendo a{" "}
              <a href="mailto:info@connectivityglobal.com" className="underline">info@connectivityglobal.com</a>.
              También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es) si
              consideras que no hemos tratado tus datos correctamente.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
