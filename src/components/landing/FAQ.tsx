import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export function FAQ() {
  const { t } = useI18n();
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-brand-orange)]">
          {t.faq.badge}
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t.faq.title}
        </h2>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {t.faq.items.map((f) => (
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