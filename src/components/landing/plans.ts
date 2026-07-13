export type PlanId = "intl80" | "intl150" | "nac60" | "nac150";
export type FamilyId = "intl" | "nac";

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
  /**
   * ID del producto de Stripe (modo LIVE). Si se usa, el checkout muestra el
   * nombre real del producto y los cupones limitados a él sí se aplican.
   */
  stripeProduct?: string;
};

/**
 * Cada plan es en realidad una "familia" con dos opciones de GB. La variante
 * concreta (con su precio, código y GB) es lo que viaja al checkout y a la hoja.
 */
export const PLANS: Plan[] = [
  {
    id: "intl80",
    familyId: "intl",
    code: "CONN80",
    name: "Connectivity 80",
    stripeProduct: "prod_UqbYtVGLaRAEo8",
    gb: 80,
    price: 11.95,
    priceLabel: "11,95 €",
    intlMin: 1000,
    international: true,
  },
  {
    id: "intl150",
    familyId: "intl",
    code: "CONN150",
    name: "Connectivity 150",
    stripeProduct: "prod_UqtOZTtoJIf9s7",
    gb: 150,
    price: 14.95,
    priceLabel: "14,95 €",
    intlMin: 1000,
    international: true,
  },
  {
    id: "nac60",
    familyId: "nac",
    code: "CONN60N",
    name: "Connectivity Nacional 60",
    gb: 60,
    price: 8.5,
    priceLabel: "8,50 €",
    intlMin: 0,
    international: false,
  },
  {
    id: "nac150",
    familyId: "nac",
    code: "CONN150N",
    name: "Connectivity Nacional 150",
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
