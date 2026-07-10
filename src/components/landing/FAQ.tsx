import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "¿Qué documento necesito?", a: "Pasaporte, NIE o DNI. Solo tienes que escanearlo con la cámara del móvil." },
  { q: "¿Tengo que ir a una tienda?", a: "No. Todo se hace online: eliges, pagas, verificas tu identidad y activas. Desde casa." },
  { q: "¿Qué es la verificación con la cámara?", a: "Es la forma legal y segura de confirmar que la SIM es tuya, sin papeleo. Escaneas tu documento y haces un selfie. Tarda segundos." },
  { q: "¿Qué diferencia hay entre eSIM y SIM física?", a: "La eSIM se activa al instante con un QR, sin tarjeta. La SIM física la recoges en un partner de Connectivity." },
  { q: "¿Cómo consigo una SIM física?", a: "Si necesitas una SIM física, acude a un partner de Connectivity. Si quieres que te indiquemos uno cercano, contáctanos y te ayudamos." },
  { q: "¿Los gigas que no use se pierden?", a: "No. Se acumulan para el mes siguiente." },
  { q: "¿Tengo permanencia?", a: "No. Pagas mes a mes y cancelas cuando quieras." },
  { q: "¿Puedo mantener mi número?", a: "Sí. Pide la portabilidad al contratar y hacemos el cambio por ti." },
  { q: "¿Cómo recargo?", a: "Online desde tu móvil, en segundos." },
  { q: "¿Qué pasa si me quedo sin gigas?", a: "Puedes añadir gigas extra o esperar a tu próxima renovación." },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-brand-orange)]">
          Preguntas frecuentes
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Todo lo que necesitas saber.
        </h2>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-border">
            <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}