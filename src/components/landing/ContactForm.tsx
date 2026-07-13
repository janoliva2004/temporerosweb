import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitContact } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";
import { Mail, MessageCircle } from "lucide-react";

export function ContactForm() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    try {
      await submitContact({
        data: {
          name: String(fd.get("name") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          message: String(fd.get("message") ?? "").trim(),
        },
      });
      form.reset();
      toast.success(t.contact.successTitle, {
        description: t.contact.successDesc,
      });
    } catch (err) {
      toast.error(t.contact.errTitle, {
        description: err instanceof Error ? err.message : t.contact.errDesc,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contacto" className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--color-brand-orange)]">
            {t.contact.badge}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.contact.title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="c-name">{t.contact.name}</Label>
              <Input id="c-name" name="name" required placeholder={t.contact.namePh} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-email">{t.contact.email}</Label>
              <Input id="c-email" name="email" type="email" required placeholder={t.contact.emailPh} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-message">{t.contact.message}</Label>
            <textarea
              id="c-message"
              name="message"
              required
              rows={4}
              placeholder={t.contact.messagePh}
              className="w-full rounded-md border border-input bg-background p-3 text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[image:var(--gradient-brand)] font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95"
          >
            {loading ? t.contact.sending : t.contact.send}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a
            href="https://wa.me/34633391047"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4 text-[color:var(--color-brand-orange)]" />
            WhatsApp 633 39 10 47
          </a>
          <a
            href="mailto:jan@connectivityglobal.com"
            className="inline-flex items-center gap-2 hover:text-foreground"
          >
            <Mail className="h-4 w-4 text-[color:var(--color-brand-orange)]" />
            jan@connectivityglobal.com
          </a>
        </div>
      </div>
    </section>
  );
}
