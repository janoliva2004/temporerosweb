import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhyUs } from "@/components/landing/WhyUs";
import { PlansSection } from "@/components/landing/PlansSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Countries } from "@/components/landing/Countries";
import { FAQ } from "@/components/landing/FAQ";
import { ContactForm } from "@/components/landing/ContactForm";
import { Footer } from "@/components/landing/Footer";
import { PurchaseDialog } from "@/components/landing/PurchaseDialog";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import type { Plan } from "@/components/landing/plans";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [selected, setSelected] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);

  function handleBuy(plan: Plan) {
    setSelected(plan);
    setOpen(true);
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      <main>
        <Hero />
        <PlansSection onBuy={handleBuy} />
        <HowItWorks />
        <WhyUs />
        <FAQ />
        <Countries />
        <ContactForm />
      </main>
      <Footer />
      <PurchaseDialog plan={selected} open={open} onOpenChange={setOpen} />
      <WhatsAppButton />
      <Toaster position="top-center" richColors />
    </div>
  );
}
