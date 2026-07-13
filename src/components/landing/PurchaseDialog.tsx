import { useEffect, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { Plan } from "./plans";
import { createCheckoutSession } from "@/lib/stripe";
import { useI18n } from "@/lib/i18n";
import { CreditCard, Smartphone, Check, Info, ShieldCheck } from "lucide-react";

type SimType = "sim" | "esim";

function eur(n: number): string {
  return n.toFixed(2).replace(".", ",") + " €";
}

export function PurchaseDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { t } = useI18n();
  const tp = t.purchase;
  const [loading, setLoading] = useState(false);
  const [simType, setSimType] = useState<SimType>("sim");
  const [months, setMonths] = useState(1);
  const [portability, setPortability] = useState<"no" | "yes">("no");
  const [tyc, setTyc] = useState(false);

  useEffect(() => {
    if (!open) {
      setSimType("sim");
      setMonths(1);
      setPortability("no");
      setTyc(false);
      setLoading(false);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!plan) return;

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const email2 = String(fd.get("email2") ?? "").trim();

    if (email !== email2) {
      toast.error(tp.emailsMismatchTitle, { description: tp.emailsMismatchDesc });
      return;
    }
    if (!tyc) {
      toast.error(tp.tycError);
      return;
    }

    // Datos de portabilidad (solo si el cliente quiere conservar su número).
    const portaNumero =
      portability === "yes" ? String(fd.get("portaNumero") ?? "").trim() : "";
    const portaOperador =
      portability === "yes" ? String(fd.get("portaOperador") ?? "").trim() : "";
    if (portability === "yes" && (!portaNumero || !portaOperador)) {
      toast.error(tp.portaMissingTitle, { description: tp.portaMissingDesc });
      return;
    }

    setLoading(true);
    try {
      const { url } = await createCheckoutSession({
        data: {
          name: String(fd.get("name") ?? "").trim(),
          email,
          phone: String(fd.get("phone") ?? "").trim(),
          simType,
          icc: simType === "sim" ? String(fd.get("icc") ?? "").trim() : "",
          portability,
          portaNumero,
          portaOperador,
          months,
          planId: plan.id,
          planCode: plan.code,
          planGb: plan.gb,
          planName: plan.name,
          price: plan.price,
          stripeProduct: plan.stripeProduct ?? "",
        },
      });
      window.location.href = url; // a Stripe Checkout
    } catch (err) {
      toast.error(tp.startErrTitle, {
        description: err instanceof Error ? err.message : tp.startErrDesc,
      });
      setLoading(false);
    }
  }

  const total = plan ? plan.price * months : 0;
  const monthWord = (n: number) => (n === 1 ? tp.monthOne : tp.monthMany);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{tp.titlePrefix}{plan?.name}</DialogTitle>
          <DialogDescription>
            {plan?.gb} GB · {plan?.priceLabel}{tp.perMonth}{tp.descSuffix}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">{tp.formatLabel}</p>
            <div className="grid grid-cols-2 gap-3">
              <SimOption
                icon={<CreditCard className="h-5 w-5" />}
                label={tp.simLabel}
                hint={tp.simHint}
                selected={simType === "sim"}
                onClick={() => setSimType("sim")}
              />
              <SimOption
                icon={<Smartphone className="h-5 w-5" />}
                label={tp.esimLabel}
                hint={tp.esimHint}
                selected={simType === "esim"}
                onClick={() => setSimType("esim")}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">{tp.name}</Label>
            <Input id="name" name="name" required placeholder="Ana Pérez" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{tp.email}</Label>
            <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email2">{tp.email2}</Label>
            <Input id="email2" name="email2" type="email" required placeholder={tp.email2Ph} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">{tp.phone}</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="600 123 456" />
          </div>

          {simType === "sim" ? (
            <div className="grid gap-2">
              <Label htmlFor="icc" className="flex items-center gap-1.5">
                {tp.icc}
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label={tp.icc} className="text-muted-foreground">
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[240px]">
                      {tp.iccTooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="icc"
                name="icc"
                required
                placeholder={tp.iccPh}
                inputMode="numeric"
                pattern="8934[0-9]{9}"
                maxLength={13}
                title={tp.iccHint}
              />
              <p className="text-xs text-muted-foreground">{tp.iccHint}</p>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-brand-orange)]" />
              {tp.esimNote}
            </div>
          )}

          {/* Portabilidad */}
          <div className="grid gap-2">
            <Label>{tp.portaQ}</Label>
            <RadioGroup
              value={portability}
              onValueChange={(v) => setPortability(v as "no" | "yes")}
              className="gap-2"
            >
              <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                <RadioGroupItem value="no" id="port-no" className="mt-0.5" />
                <span>{tp.portaNoPre}<strong>{tp.portaNoStrong}</strong>{tp.portaNoPost}</span>
              </label>
              <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                <RadioGroupItem value="yes" id="port-yes" className="mt-0.5" />
                <span>{tp.portaYesPre}<strong>{tp.portaYesStrong}</strong>{tp.portaYesPost}</span>
              </label>
            </RadioGroup>

            {portability === "yes" && (
              <div className="mt-1 grid gap-3 rounded-xl border border-[color:var(--color-brand-orange)]/30 bg-[color:var(--color-brand-orange)]/5 p-3">
                <div className="grid gap-2">
                  <Label htmlFor="portaNumero">{tp.portaNumero}</Label>
                  <Input
                    id="portaNumero"
                    name="portaNumero"
                    type="tel"
                    inputMode="numeric"
                    placeholder="600 123 456"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="portaOperador">{tp.portaOperador}</Label>
                  <Input
                    id="portaOperador"
                    name="portaOperador"
                    placeholder={tp.portaOperadorPh}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Meses de prepago */}
          <div className="grid gap-2">
            <Label htmlFor="months">{tp.monthsLabel}</Label>
            <select
              id="months"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {monthWord(n)}
                </option>
              ))}
            </select>
          </div>

          {/* Términos */}
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={tyc} onCheckedChange={(c) => setTyc(c === true)} className="mt-0.5" />
            <span className="text-muted-foreground">
              {tp.tycPre}
              <a href="/legal/aviso-legal" target="_blank" className="underline hover:text-foreground">
                {tp.tycLink}
              </a>
              {tp.tycPost}
            </span>
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[image:var(--gradient-brand)] font-semibold text-white shadow-[var(--shadow-brand)] hover:opacity-95"
          >
            {loading
              ? tp.opening
              : `${tp.payPrefix}${eur(total)} (${months} ${monthWord(months)})`}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            {tp.payNote}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SimOption({
  icon,
  label,
  hint,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
        selected
          ? "border-[color:var(--color-brand-orange)] bg-[color:var(--color-brand-orange)]/5 shadow-sm"
          : "border-border hover:border-foreground/30"
      }`}
    >
      {selected ? (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-brand-orange)] text-white">
          <Check className="h-3 w-3" />
        </span>
      ) : null}
      <span className="text-[color:var(--color-brand-orange)]">{icon}</span>
      <span className="font-semibold">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}
