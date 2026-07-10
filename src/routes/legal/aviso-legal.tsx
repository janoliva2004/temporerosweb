import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/legal/aviso-legal")({
  component: AvisoLegal,
});

function AvisoLegal() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Volver al inicio
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">Aviso legal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última actualización: 10 de julio de 2026.</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-display text-lg font-bold">1. Datos identificativos</h2>
            <p>
              En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de
              11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico
              (LSSI-CE), se informa a los usuarios de que el titular de este sitio web es:
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Titular:</strong> Connectivity World Global, S.L.U.</li>
              <li><strong>CIF:</strong> B66347634</li>
              <li><strong>Domicilio:</strong> Calle del Císter, 45, 08022 Barcelona, España</li>
              <li>
                <strong>Correo electrónico:</strong>{" "}
                <a href="mailto:info@connectivityglobal.com" className="underline">info@connectivityglobal.com</a>
              </li>
              <li><strong>Teléfono / WhatsApp:</strong> +34 633 39 10 47</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">2. Objeto</h2>
            <p>
              Connectivity es un distribuidor autorizado de tarjetas SIM y eSIM de prepago sobre la red
              MÁS Orange, que permite a los usuarios contratar líneas móviles de prepago (con o sin
              portabilidad) a través de este sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">3. Condiciones de uso</h2>
            <p>
              El acceso y/o uso de este sitio web atribuye la condición de usuario, que acepta, desde
              dicho acceso y/o uso, las condiciones generales de uso aquí reflejadas. El usuario se
              compromete a hacer un uso adecuado de los contenidos y servicios que Connectivity ofrece a
              través de su sitio web y a no emplearlos para incurrir en actividades ilícitas o contrarias
              a la buena fe y al ordenamiento legal.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">4. Contratación y verificación de identidad</h2>
            <p>
              La normativa de telecomunicaciones española exige la verificación de la identidad del
              titular de toda línea de prepago. Por ello, tras el pago, el usuario deberá completar un
              proceso de verificación de identidad (KYC) mediante documento oficial y captura biométrica,
              gestionado a través de nuestro proveedor Didit. Sin esta verificación la línea no podrá
              activarse.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">5. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño y código fuente)
              son titularidad de Connectivity o de terceros que han autorizado su uso, y están protegidos
              por la normativa de propiedad intelectual e industrial.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold">6. Legislación aplicable</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para cualquier controversia
              derivada del uso de este sitio web, las partes se someterán a los juzgados y tribunales del
              domicilio del usuario, cuando este actúe como consumidor.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
