export type PlanId = "intl80" | "intl150" | "nac60" | "nac150";
export type FamilyId = "intl" | "nac";

/**
 * IDs de producto de Stripe por modo. Los productos de test y de live son
 * distintos en Stripe, así que guardamos ambos y el servidor elige según la
 * clave (sk_test_ / sk_live_). Si el checkout se enlaza al producto real, el
 * nombre correcto se muestra en Stripe y los cupones limitados a ese producto
 * sí se aplican.
 */
export type StripeProductIds = { test?: string; live?: string };

export type Plan = {
  id: PlanId;
  /** Familia a la que pertenece la variante (Internacional / Nacional). */
  familyId: FamilyId;
  /** Código del plan que se escribe en la columna "Plan Code" del Excel/Sheet. */
  code: string;
  name: string;
  gb: number;
  price: number;
  priceLabel: string;
  /** Minutos internacionales incluidos (0 en los planes nacionales). */
  intlMin: number;
  /** Si incluye el bono de llamadas internacionales. */
  international: boolean;
  stripeProduct?: StripeProductIds;
};

/**
 * Cada plan es en realidad una "familia" con dos opciones de GB. La variante
 * concreta (con su precio, código y GB) es lo que viaja al checkout y a la hoja.
 */
export const PLANS: Plan[] = [
  {
    id: "intl80",
    familyId: "intl",
    code: "FLEXI80",
    name: "FLEXISIM 80GB",
    stripeProduct: { test: "prod_UsPrOGHUVpjf2l", live: "prod_UqbYtVGLaRAEo8" },
    gb: 80,
    price: 11.95,
    priceLabel: "11,95 €",
    intlMin: 1000,
    international: true,
  },
  {
    id: "intl150",
    familyId: "intl",
    code: "FLEXI150",
    name: "FLEXISIM 150GB",
    stripeProduct: { test: "prod_UsPr20LmGTAIL2", live: "prod_UqtOZTtoJIf9s7" },
    gb: 150,
    price: 14.95,
    priceLabel: "14,95 €",
    intlMin: 1000,
    international: true,
  },
  {
    id: "nac60",
    familyId: "nac",
    code: "FLEXI60N",
    name: "FLEXISIM NACIONAL 60GB",
    stripeProduct: { test: "prod_UsPrx6NVOj4wYr", live: "prod_UsPkNh2LYxzR5v" },
    gb: 60,
    price: 8.5,
    priceLabel: "8,50 €",
    intlMin: 0,
    international: false,
  },
  {
    id: "nac150",
    familyId: "nac",
    code: "FLEXI150N",
    name: "FLEXISIM NACIONAL 150GB",
    stripeProduct: { test: "prod_UsPrsmyk2kawMk", live: "prod_UsPlm3iHjiIzVB" },
    gb: 150,
    price: 11.35,
    priceLabel: "11,35 €",
    intlMin: 0,
    international: false,
  },
];

export type PlanFamily = { id: FamilyId; variants: Plan[] };

/** Agrupa las variantes por familia, en orden de GB ascendente. */
export const PLAN_FAMILIES: PlanFamily[] = [
  { id: "intl", variants: PLANS.filter((p) => p.familyId === "intl") },
  { id: "nac", variants: PLANS.filter((p) => p.familyId === "nac") },
];
