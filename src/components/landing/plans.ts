export type Plan = {
  id: "p80" | "p150";
  /** Código del plan que se escribe en la columna "Plan Code" del Excel/Sheet. */
  code: string;
  name: string;
  gb: number;
  price: number;
  priceLabel: string;
  intlMin: number;
  popular?: boolean;
  tagline: string;
  features: string[];
  /**
   * ID del producto de Stripe (modo LIVE). Si se usa, el checkout muestra el
   * nombre real del producto y los cupones limitados a él sí se aplican.
   */
  stripeProduct?: string;
};

export const PLANS: Plan[] = [
  {
    id: "p80",
    code: "CONN80",
    name: "Connectivity 80",
    stripeProduct: "prod_UqbYtVGLaRAEo8",
    gb: 80,
    price: 11.95,
    priceLabel: "11,95 €",
    intlMin: 1000,
    tagline: "Perfecto para el día a día conectado.",
    features: [
      "80 GB acumulables cada mes",
      "Llamadas nacionales ilimitadas",
      "1.000 min a países (fijo y móvil)",
      "Activación online con reconocimiento facial",
      "Red MÁS Orange 5G · Sin permanencia",
    ],
  },
  {
    id: "p150",
    code: "CONN150",
    name: "Connectivity 150",
    stripeProduct: "prod_UqtOZTtoJIf9s7",
    gb: 150,
    price: 14.95,
    priceLabel: "14,95 €",
    intlMin: 1000,
    tagline: "Para quien vive online sin pensarlo.",
    features: [
      "150 GB acumulables cada mes",
      "Llamadas nacionales ilimitadas",
      "1.000 min a países (fijo y móvil)",
      "Activación online con reconocimiento facial",
      "Red MÁS Orange 5G · Sin permanencia",
    ],
  },
];
