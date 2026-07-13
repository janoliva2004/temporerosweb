import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * i18n mínimo (ES/EN/FR) para la landing de Connectivity.
 *
 * - El idioma por defecto es ES (también en SSR, para evitar mismatch de
 *   hidratación). Tras montar, se lee la preferencia de localStorage.
 * - `useI18n()` devuelve { lang, setLang, t } donde `t` es el diccionario del
 *   idioma actual.
 */

export type Lang = "es" | "en" | "fr";
export const LANGS: Lang[] = ["es", "en", "fr"];
const STORAGE_KEY = "connectivity_lang";

type Point = { title: string; text: string };
type Step = { title: string; text: string; hint?: string };
type Feature = { text: string; kind: "normal" | "bold" | "countries" };
type Faq = { q: string; a: string };

const es = {
  header: {
    nav: {
      como: "Cómo funciona",
      planes: "Planes",
      paises: "Países",
      faq: "FAQ",
      contacto: "Contacto",
    },
    cta: "Ver planes",
  },
  whatsapp: {
    label: "¿Dudas? Escríbenos",
    aria: "¿Dudas? Escríbenos por WhatsApp",
    msg: "Hola, tengo una duda sobre Connectivity",
  },
  hero: {
    titleLine1: "Tu SIM/eSIM 5G española",
    titleLine2: "activada online en 3 minutos.",
    subtitle:
      "Sin ir a la tienda. Sin contratos. Gigas que se acumulan y llamadas ilimitadas en España.",
    ctaPlan: "Elegir mi plan",
    ctaHow: "¿Cómo funciona?",
  },
  why: {
    title: "Por qué Connectivity",
    points: [
      { title: "Red MÁS Orange 5G", text: "Una de las mejores redes de España, a precios muy competitivos." },
      { title: "Activación 100% online", text: "Fácil y rápido, sin ir a ninguna tienda ni hacer cola." },
      { title: "Gigas acumulables", text: "Lo que no uses este mes, lo tienes el mes siguiente." },
      { title: "Escoge tu formato", text: "SIM física o eSIM, tú decides. Mismo precio para las dos." },
    ] as Point[],
  },
  plans: {
    badge: "Elige y activa hoy",
    title: "Dos planes. Tú eliges los GB.",
    subtitle: "Con llamadas internacionales o solo España. Gigas acumulables y red 5G en ambos.",
    perMonth: "€/mes",
    mobile: "Móvil",
    buy: "Comprar y activar",
    choose: "Elige tus datos",
    gbSuffix: "GB acumulables cada mes",
    intl: "1.000 min a países (fijo y móvil)",
    intlAria: "Ver países disponibles para llamadas internacionales",
    dialog: {
      title: "Países incluidos en el bono internacional",
      desc: "1.000 minutos a destinos internacionales.",
      country: "País",
      fijo: "Fijo",
      movil: "Móvil",
    },
    families: {
      intl: {
        name: "Internacional",
        tagline: "Con llamadas a tu país incluidas.",
        badge: "Más completo",
        features: [
          { text: "Llamadas nacionales ilimitadas", kind: "normal" },
          { text: "1.000 min a países (fijo y móvil)", kind: "countries" },
          { text: "Activación online con reconocimiento facial", kind: "normal" },
          { text: "Red MÁS Orange 5G · Sin permanencia", kind: "normal" },
        ] as Feature[],
      },
      nac: {
        name: "Nacional",
        tagline: "Solo España, al mejor precio.",
        badge: "Mejor precio",
        features: [
          { text: "Llamadas nacionales ilimitadas", kind: "normal" },
          { text: "Activación online con reconocimiento facial", kind: "normal" },
          { text: "Red MÁS Orange 5G · Sin permanencia", kind: "normal" },
        ] as Feature[],
      },
    },
  },
  how: {
    badge: "Cómo funciona",
    title: "Así de fácil",
    esimTitle: "eSIM",
    esimSub: "Compra y activa desde la web, al instante.",
    simTitle: "SIM física",
    simSub: "Recógela en tu partner de confianza.",
    verifyHint:
      "La verificación se hace 100% online con tu cámara, sin necesidad de desplazarte a ninguna tienda.",
    esimSteps: [
      { title: "Elige tu plan", text: "80 GB o 150 GB. Sin permanencia y mismo precio para SIM y eSIM." },
      { title: "Rellena tus datos y verifica tu identidad", text: "Escanea tu documento y haz un selfie.", hint: "HINT" },
      { title: "Empieza a navegar", text: "Recibes tu eSIM al instante: escaneas el QR y ya estás conectado en 5G." },
    ] as Step[],
    simSteps: [
      { title: "Elige tu partner", text: "Acude a un partner de Connectivity de tu confianza." },
      { title: "Elige tu plan: 80 GB o 150 GB", text: "Sin permanencia y mismo precio para SIM y eSIM." },
      { title: "Rellena tus datos y verifica tu identidad", text: "Escanea tu documento y haz un selfie.", hint: "HINT" },
      { title: "Activa tu SIM con el ICC y empieza a navegar", text: "Introduce el número de ICC (empieza por 8934, 13 dígitos) y tu SIM quedará lista." },
    ] as Step[],
    footnote: "Verificación de identidad 100% online, sin desplazarte a ninguna tienda.",
  },
  countries: {
    badge: "Destinos internacionales",
    title: "Descubre a qué países puedes llamar",
    subtitle:
      "Bono de voz internacional de 1.000 minutos a los siguientes destinos. Consulta si el país que buscas está incluido para llamadas a fijo, móvil o ambos.",
    statDestinos: "Destinos disponibles",
    statFijo: "Con llamadas a fijo",
    statMovil: "Con llamadas a móvil",
    searchPh: "Buscar país…",
    country: "País",
    fijo: "Fijo",
    movil: "Móvil",
    included: "Incluido",
    notIncluded: "No incluido",
    empty: "No encontramos ese país en los destinos incluidos.",
    footnote:
      "Superado el bono de voz internacional, el precio de la llamada y el establecimiento serán el estándar de cada destino.",
  },
  faq: {
    badge: "Preguntas frecuentes",
    title: "Todo lo que necesitas saber.",
    items: [
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
    ] as Faq[],
  },
  contact: {
    badge: "Soporte",
    title: "¿Necesitas ayuda?",
    subtitle: "Cuéntanos tu incidencia y te ayudamos lo antes posible.",
    name: "Nombre",
    namePh: "Tu nombre",
    email: "Email",
    emailPh: "tu@email.com",
    phone: "Teléfono",
    phonePh: "600 123 456",
    category: "Tipo de incidencia",
    categoryPh: "Selecciona una categoría",
    categories: {
      activacion: "Activación",
      pagos: "Cobros y pagos",
      cobertura: "Cobertura / red",
      sim: "SIM / eSIM",
      portabilidad: "Portabilidad",
      otro: "Otro",
    },
    message: "Mensaje",
    messagePh: "Describe tu incidencia…",
    send: "Enviar incidencia",
    sending: "Enviando…",
    ticket: "Nº de incidencia",
    successTitle: "¡Incidencia registrada!",
    successDesc: "Te responderemos lo antes posible.",
    errTitle: "No se pudo registrar la incidencia",
    errDesc: "Inténtalo de nuevo en unos segundos.",
  },
  footer: {
    tagline: "SIMs prepago 5G con gigas acumulables. Sin permanencia, sin sorpresas.",
    plans: "Planes",
    company: "Compañía",
    como: "Cómo funciona",
    faq: "Preguntas frecuentes",
    aviso: "Aviso legal",
    privacidad: "Política de privacidad",
    cookies: "Cookies",
    rights: "Todos los derechos reservados.",
  },
  cookie: {
    textPre:
      "Usamos cookies propias necesarias para el funcionamiento de la web (pago y verificación de identidad) y, con tu consentimiento, cookies opcionales para mejorar tu experiencia. Consulta nuestra ",
    link: "política de cookies",
    reject: "Rechazar",
    accept: "Aceptar",
  },
  purchase: {
    titlePrefix: "Contratar ",
    descSuffix: " · sin permanencia. Elige formato y rellena tus datos.",
    perMonth: "/mes",
    formatLabel: "Elige tu formato",
    simLabel: "SIM física",
    simHint: "Recógela en tu partner",
    esimLabel: "eSIM",
    esimHint: "Activación inmediata",
    name: "Nombre completo",
    email: "Email",
    email2: "Confirmar email",
    email2Ph: "repite tu email",
    phone: "Teléfono",
    icc: "Número de ICC",
    iccPh: "8934000000000",
    iccHint: "Empieza por 8934 · 13 dígitos",
    iccTooltip: "Contacta con tu partner para conseguir tu SIM física.",
    esimNote: "Para activar tu eSIM tendrás que verificar tu identidad tras el pago.",
    portaQ: "¿Quieres conservar tu número?",
    portaNoPre: "No, quiero un ",
    portaNoStrong: "número nuevo",
    portaNoPost: ".",
    portaYesPre: "Sí, ya tengo un número y quiero ",
    portaYesStrong: "cambiarme a Connectivity",
    portaYesPost: " (portabilidad).",
    portaNumero: "Tu número de teléfono actual",
    portaOperador: "Tu operador actual",
    portaOperadorPh: "Movistar, Vodafone, Orange…",
    monthsLabel: "Meses a contratar (prepago)",
    monthOne: "mes",
    monthMany: "meses",
    tycPre: "Acepto los ",
    tycLink: "términos y condiciones",
    tycPost: " de la web.",
    payPrefix: "Pagar — ",
    opening: "Abriendo pago…",
    payNote: "Pago seguro con Stripe · Podrás aplicar tu código de descuento en el checkout.",
    emailsMismatchTitle: "Los emails no coinciden",
    emailsMismatchDesc: "Revisa el campo de confirmar email.",
    tycError: "Debes aceptar los términos y condiciones para continuar.",
    portaMissingTitle: "Faltan datos de portabilidad",
    portaMissingDesc: "Indica tu número actual y tu operador actual.",
    startErrTitle: "No se pudo iniciar el pago",
    startErrDesc: "Revisa la configuración de Stripe.",
  },
};

type Dict = typeof es;

const en: Dict = {
  header: {
    nav: {
      como: "How it works",
      planes: "Plans",
      paises: "Countries",
      faq: "FAQ",
      contacto: "Contact",
    },
    cta: "See plans",
  },
  whatsapp: {
    label: "Questions? Message us",
    aria: "Questions? Message us on WhatsApp",
    msg: "Hi, I have a question about Connectivity",
  },
  hero: {
    titleLine1: "Your Spanish 5G SIM/eSIM",
    titleLine2: "activated online in 3 minutes.",
    subtitle:
      "No store visits. No contracts. Data that rolls over and unlimited calls within Spain.",
    ctaPlan: "Choose my plan",
    ctaHow: "How does it work?",
  },
  why: {
    title: "Why Connectivity",
    points: [
      { title: "MÁS Orange 5G network", text: "One of the best networks in Spain, at very competitive prices." },
      { title: "100% online activation", text: "Quick and easy, with no store visits or queues." },
      { title: "Rollover data", text: "Whatever you don't use this month carries over to the next." },
      { title: "Choose your format", text: "Physical SIM or eSIM, your choice. Same price for both." },
    ],
  },
  plans: {
    badge: "Choose and activate today",
    title: "Two plans. You pick the GB.",
    subtitle: "With international calls or Spain only. Rollover data and 5G network on both.",
    perMonth: "€/mo",
    mobile: "Mobile",
    buy: "Buy and activate",
    choose: "Choose your data",
    gbSuffix: "GB rollover data every month",
    intl: "1,000 min to countries (landline & mobile)",
    intlAria: "See available countries for international calls",
    dialog: {
      title: "Countries included in the international bundle",
      desc: "1,000 minutes to international destinations.",
      country: "Country",
      fijo: "Landline",
      movil: "Mobile",
    },
    families: {
      intl: {
        name: "International",
        tagline: "Calls to your country included.",
        badge: "Most complete",
        features: [
          { text: "Unlimited national calls", kind: "normal" },
          { text: "1,000 min to countries (landline & mobile)", kind: "countries" },
          { text: "Online activation with facial recognition", kind: "normal" },
          { text: "MÁS Orange 5G network · No commitment", kind: "normal" },
        ],
      },
      nac: {
        name: "National",
        tagline: "Spain only, at the best price.",
        badge: "Best price",
        features: [
          { text: "Unlimited national calls", kind: "normal" },
          { text: "Online activation with facial recognition", kind: "normal" },
          { text: "MÁS Orange 5G network · No commitment", kind: "normal" },
        ],
      },
    },
  },
  how: {
    badge: "How it works",
    title: "It's that easy",
    esimTitle: "eSIM",
    esimSub: "Buy and activate from the web, instantly.",
    simTitle: "Physical SIM",
    simSub: "Pick it up at your trusted partner.",
    verifyHint:
      "Verification is done 100% online with your camera, with no need to visit a store.",
    esimSteps: [
      { title: "Choose your plan", text: "80 GB or 150 GB. No commitment and the same price for SIM and eSIM." },
      { title: "Fill in your details and verify your identity", text: "Scan your document and take a selfie.", hint: "HINT" },
      { title: "Start browsing", text: "You get your eSIM instantly: scan the QR and you're connected on 5G." },
    ],
    simSteps: [
      { title: "Choose your partner", text: "Visit a trusted Connectivity partner." },
      { title: "Choose your plan: 80 GB or 150 GB", text: "No commitment and the same price for SIM and eSIM." },
      { title: "Fill in your details and verify your identity", text: "Scan your document and take a selfie.", hint: "HINT" },
      { title: "Activate your SIM with the ICC and start browsing", text: "Enter the ICC number (starts with 8934, 13 digits) and your SIM will be ready." },
    ],
    footnote: "100% online identity verification, with no need to visit a store.",
  },
  countries: {
    badge: "International destinations",
    title: "Discover which countries you can call",
    subtitle:
      "1,000-minute international voice bundle to the destinations below. Check whether the country you're looking for is included for landline, mobile or both.",
    statDestinos: "Available destinations",
    statFijo: "With landline calls",
    statMovil: "With mobile calls",
    searchPh: "Search country…",
    country: "Country",
    fijo: "Landline",
    movil: "Mobile",
    included: "Included",
    notIncluded: "Not included",
    empty: "We couldn't find that country among the included destinations.",
    footnote:
      "Once the international voice bundle is used up, call and connection charges follow each destination's standard rate.",
  },
  faq: {
    badge: "Frequently asked questions",
    title: "Everything you need to know.",
    items: [
      { q: "What document do I need?", a: "Passport, NIE or DNI. You just scan it with your phone camera." },
      { q: "Do I have to go to a store?", a: "No. Everything is done online: you choose, pay, verify your identity and activate. From home." },
      { q: "What is camera verification?", a: "It's the legal and secure way to confirm the SIM is yours, with no paperwork. You scan your document and take a selfie. It takes seconds." },
      { q: "What's the difference between eSIM and physical SIM?", a: "The eSIM activates instantly with a QR code, no card. The physical SIM is picked up at a Connectivity partner." },
      { q: "How do I get a physical SIM?", a: "If you need a physical SIM, visit a Connectivity partner. If you'd like us to point you to a nearby one, contact us and we'll help." },
      { q: "Do I lose the data I don't use?", a: "No. It rolls over to the next month." },
      { q: "Is there a commitment period?", a: "No. You pay month to month and cancel whenever you want." },
      { q: "Can I keep my number?", a: "Yes. Request the port-in when you sign up and we'll make the switch for you." },
      { q: "How do I top up?", a: "Online from your phone, in seconds." },
      { q: "What happens if I run out of data?", a: "You can add extra data or wait for your next renewal." },
    ],
  },
  contact: {
    badge: "Support",
    title: "Need help?",
    subtitle: "Tell us about your issue and we'll help you as soon as possible.",
    name: "Name",
    namePh: "Your name",
    email: "Email",
    emailPh: "you@email.com",
    phone: "Phone",
    phonePh: "600 123 456",
    category: "Issue type",
    categoryPh: "Select a category",
    categories: {
      activacion: "Activation",
      pagos: "Billing & payments",
      cobertura: "Coverage / network",
      sim: "SIM / eSIM",
      portabilidad: "Number port-in",
      otro: "Other",
    },
    message: "Message",
    messagePh: "Describe your issue…",
    send: "Submit ticket",
    sending: "Sending…",
    ticket: "Ticket no.",
    successTitle: "Ticket submitted!",
    successDesc: "We'll get back to you as soon as possible.",
    errTitle: "The ticket couldn't be submitted",
    errDesc: "Please try again in a few seconds.",
  },
  footer: {
    tagline: "5G prepaid SIMs with rollover data. No commitment, no surprises.",
    plans: "Plans",
    company: "Company",
    como: "How it works",
    faq: "Frequently asked questions",
    aviso: "Legal notice",
    privacidad: "Privacy policy",
    cookies: "Cookies",
    rights: "All rights reserved.",
  },
  cookie: {
    textPre:
      "We use our own cookies that are necessary for the website to work (payment and identity verification) and, with your consent, optional cookies to improve your experience. See our ",
    link: "cookie policy",
    reject: "Reject",
    accept: "Accept",
  },
  purchase: {
    titlePrefix: "Get ",
    descSuffix: " · no commitment. Choose a format and fill in your details.",
    perMonth: "/mo",
    formatLabel: "Choose your format",
    simLabel: "Physical SIM",
    simHint: "Pick it up at your partner",
    esimLabel: "eSIM",
    esimHint: "Instant activation",
    name: "Full name",
    email: "Email",
    email2: "Confirm email",
    email2Ph: "repeat your email",
    phone: "Phone",
    icc: "ICC number",
    iccPh: "8934000000000",
    iccHint: "Starts with 8934 · 13 digits",
    iccTooltip: "Contact your partner to get your physical SIM.",
    esimNote: "To activate your eSIM you'll need to verify your identity after payment.",
    portaQ: "Do you want to keep your number?",
    portaNoPre: "No, I want a ",
    portaNoStrong: "new number",
    portaNoPost: ".",
    portaYesPre: "Yes, I already have a number and want to ",
    portaYesStrong: "switch to Connectivity",
    portaYesPost: " (port-in).",
    portaNumero: "Your current phone number",
    portaOperador: "Your current operator",
    portaOperadorPh: "Movistar, Vodafone, Orange…",
    monthsLabel: "Months to purchase (prepaid)",
    monthOne: "month",
    monthMany: "months",
    tycPre: "I accept the ",
    tycLink: "terms and conditions",
    tycPost: " of the website.",
    payPrefix: "Pay — ",
    opening: "Opening payment…",
    payNote: "Secure payment with Stripe · You can apply your discount code at checkout.",
    emailsMismatchTitle: "Emails don't match",
    emailsMismatchDesc: "Check the confirm email field.",
    tycError: "You must accept the terms and conditions to continue.",
    portaMissingTitle: "Missing port-in details",
    portaMissingDesc: "Enter your current number and current operator.",
    startErrTitle: "Payment couldn't be started",
    startErrDesc: "Check your Stripe configuration.",
  },
};

const fr: Dict = {
  header: {
    nav: {
      como: "Comment ça marche",
      planes: "Forfaits",
      paises: "Pays",
      faq: "FAQ",
      contacto: "Contact",
    },
    cta: "Voir les forfaits",
  },
  whatsapp: {
    label: "Des questions ? Écris-nous",
    aria: "Des questions ? Écris-nous sur WhatsApp",
    msg: "Bonjour, j'ai une question sur Connectivity",
  },
  hero: {
    titleLine1: "Ta SIM/eSIM 5G espagnole",
    titleLine2: "activée en ligne en 3 minutes.",
    subtitle:
      "Sans aller en boutique. Sans engagement. Des Go qui se cumulent et des appels illimités en Espagne.",
    ctaPlan: "Choisir mon forfait",
    ctaHow: "Comment ça marche ?",
  },
  why: {
    title: "Pourquoi Connectivity",
    points: [
      { title: "Réseau MÁS Orange 5G", text: "L'un des meilleurs réseaux d'Espagne, à des prix très compétitifs." },
      { title: "Activation 100 % en ligne", text: "Simple et rapide, sans boutique ni file d'attente." },
      { title: "Go cumulables", text: "Ce que tu n'utilises pas ce mois-ci, tu le gardes le mois suivant." },
      { title: "Choisis ton format", text: "SIM physique ou eSIM, à toi de choisir. Même prix pour les deux." },
    ],
  },
  plans: {
    badge: "Choisis et active aujourd'hui",
    title: "Deux forfaits. Tu choisis les Go.",
    subtitle: "Avec appels internationaux ou Espagne uniquement. Go cumulables et réseau 5G sur les deux.",
    perMonth: "€/mois",
    mobile: "Mobile",
    buy: "Acheter et activer",
    choose: "Choisis tes données",
    gbSuffix: "Go cumulables chaque mois",
    intl: "1 000 min vers l'étranger (fixe et mobile)",
    intlAria: "Voir les pays disponibles pour les appels internationaux",
    dialog: {
      title: "Pays inclus dans le forfait international",
      desc: "1 000 minutes vers des destinations internationales.",
      country: "Pays",
      fijo: "Fixe",
      movil: "Mobile",
    },
    families: {
      intl: {
        name: "International",
        tagline: "Appels vers ton pays inclus.",
        badge: "Le plus complet",
        features: [
          { text: "Appels nationaux illimités", kind: "normal" },
          { text: "1 000 min vers l'étranger (fixe et mobile)", kind: "countries" },
          { text: "Activation en ligne avec reconnaissance faciale", kind: "normal" },
          { text: "Réseau MÁS Orange 5G · Sans engagement", kind: "normal" },
        ],
      },
      nac: {
        name: "National",
        tagline: "Espagne uniquement, au meilleur prix.",
        badge: "Meilleur prix",
        features: [
          { text: "Appels nationaux illimités", kind: "normal" },
          { text: "Activation en ligne avec reconnaissance faciale", kind: "normal" },
          { text: "Réseau MÁS Orange 5G · Sans engagement", kind: "normal" },
        ],
      },
    },
  },
  how: {
    badge: "Comment ça marche",
    title: "C'est aussi simple que ça",
    esimTitle: "eSIM",
    esimSub: "Achète et active depuis le web, en un instant.",
    simTitle: "SIM physique",
    simSub: "Récupère-la chez ton partenaire de confiance.",
    verifyHint:
      "La vérification se fait 100 % en ligne avec ta caméra, sans avoir à te déplacer en boutique.",
    esimSteps: [
      { title: "Choisis ton forfait", text: "80 Go ou 150 Go. Sans engagement et même prix pour SIM et eSIM." },
      { title: "Remplis tes informations et vérifie ton identité", text: "Scanne ton document et prends un selfie.", hint: "HINT" },
      { title: "Commence à naviguer", text: "Tu reçois ta eSIM instantanément : scanne le QR et te voilà connecté en 5G." },
    ],
    simSteps: [
      { title: "Choisis ton partenaire", text: "Rends-toi chez un partenaire Connectivity de confiance." },
      { title: "Choisis ton forfait : 80 Go ou 150 Go", text: "Sans engagement et même prix pour SIM et eSIM." },
      { title: "Remplis tes informations et vérifie ton identité", text: "Scanne ton document et prends un selfie.", hint: "HINT" },
      { title: "Active ta SIM avec l'ICC et commence à naviguer", text: "Saisis le numéro ICC (commence par 8934, 13 chiffres) et ta SIM sera prête." },
    ],
    footnote: "Vérification d'identité 100 % en ligne, sans te déplacer en boutique.",
  },
  countries: {
    badge: "Destinations internationales",
    title: "Découvre les pays que tu peux appeler",
    subtitle:
      "Forfait voix international de 1 000 minutes vers les destinations ci-dessous. Vérifie si le pays que tu cherches est inclus pour le fixe, le mobile ou les deux.",
    statDestinos: "Destinations disponibles",
    statFijo: "Avec appels vers fixe",
    statMovil: "Avec appels vers mobile",
    searchPh: "Rechercher un pays…",
    country: "Pays",
    fijo: "Fixe",
    movil: "Mobile",
    included: "Inclus",
    notIncluded: "Non inclus",
    empty: "Ce pays ne figure pas parmi les destinations incluses.",
    footnote:
      "Une fois le forfait voix international épuisé, le prix de l'appel et de la mise en relation sont ceux du tarif standard de chaque destination.",
  },
  faq: {
    badge: "Questions fréquentes",
    title: "Tout ce que tu dois savoir.",
    items: [
      { q: "De quel document ai-je besoin ?", a: "Passeport, NIE ou DNI. Il suffit de le scanner avec la caméra de ton téléphone." },
      { q: "Dois-je aller en boutique ?", a: "Non. Tout se fait en ligne : tu choisis, tu paies, tu vérifies ton identité et tu actives. Depuis chez toi." },
      { q: "Qu'est-ce que la vérification par caméra ?", a: "C'est la façon légale et sûre de confirmer que la SIM est bien la tienne, sans paperasse. Tu scannes ton document et tu prends un selfie. Cela prend quelques secondes." },
      { q: "Quelle différence entre eSIM et SIM physique ?", a: "L'eSIM s'active instantanément avec un QR, sans carte. La SIM physique se récupère chez un partenaire Connectivity." },
      { q: "Comment obtenir une SIM physique ?", a: "Si tu as besoin d'une SIM physique, rends-toi chez un partenaire Connectivity. Si tu veux qu'on t'en indique un proche, contacte-nous et on t'aide." },
      { q: "Est-ce que je perds les Go que je n'utilise pas ?", a: "Non. Ils se cumulent pour le mois suivant." },
      { q: "Y a-t-il un engagement ?", a: "Non. Tu paies mois par mois et tu annules quand tu veux." },
      { q: "Puis-je conserver mon numéro ?", a: "Oui. Demande la portabilité lors de la souscription et on fait le changement pour toi." },
      { q: "Comment recharger ?", a: "En ligne depuis ton téléphone, en quelques secondes." },
      { q: "Que se passe-t-il si je n'ai plus de Go ?", a: "Tu peux ajouter des Go supplémentaires ou attendre ton prochain renouvellement." },
    ],
  },
  contact: {
    badge: "Support",
    title: "Besoin d'aide ?",
    subtitle: "Décris-nous ton incident et on t'aide dès que possible.",
    name: "Nom",
    namePh: "Ton nom",
    email: "Email",
    emailPh: "toi@email.com",
    phone: "Téléphone",
    phonePh: "600 123 456",
    category: "Type d'incident",
    categoryPh: "Choisis une catégorie",
    categories: {
      activacion: "Activation",
      pagos: "Facturation & paiements",
      cobertura: "Couverture / réseau",
      sim: "SIM / eSIM",
      portabilidad: "Portabilité",
      otro: "Autre",
    },
    message: "Message",
    messagePh: "Décris ton incident…",
    send: "Envoyer l'incident",
    sending: "Envoi…",
    ticket: "N° d'incident",
    successTitle: "Incident enregistré !",
    successDesc: "Nous te répondrons dès que possible.",
    errTitle: "L'incident n'a pas pu être enregistré",
    errDesc: "Réessaie dans quelques secondes.",
  },
  footer: {
    tagline: "SIM prépayées 5G avec Go cumulables. Sans engagement, sans surprises.",
    plans: "Forfaits",
    company: "Entreprise",
    como: "Comment ça marche",
    faq: "Questions fréquentes",
    aviso: "Mentions légales",
    privacidad: "Politique de confidentialité",
    cookies: "Cookies",
    rights: "Tous droits réservés.",
  },
  cookie: {
    textPre:
      "Nous utilisons nos propres cookies nécessaires au fonctionnement du site (paiement et vérification d'identité) et, avec ton consentement, des cookies optionnels pour améliorer ton expérience. Consulte notre ",
    link: "politique de cookies",
    reject: "Refuser",
    accept: "Accepter",
  },
  purchase: {
    titlePrefix: "Souscrire à ",
    descSuffix: " · sans engagement. Choisis un format et remplis tes informations.",
    perMonth: "/mois",
    formatLabel: "Choisis ton format",
    simLabel: "SIM physique",
    simHint: "Récupère-la chez ton partenaire",
    esimLabel: "eSIM",
    esimHint: "Activation immédiate",
    name: "Nom complet",
    email: "Email",
    email2: "Confirmer l'email",
    email2Ph: "répète ton email",
    phone: "Téléphone",
    icc: "Numéro ICC",
    iccPh: "8934000000000",
    iccHint: "Commence par 8934 · 13 chiffres",
    iccTooltip: "Contacte ton partenaire pour obtenir ta SIM physique.",
    esimNote: "Pour activer ta eSIM, tu devras vérifier ton identité après le paiement.",
    portaQ: "Veux-tu conserver ton numéro ?",
    portaNoPre: "Non, je veux un ",
    portaNoStrong: "nouveau numéro",
    portaNoPost: ".",
    portaYesPre: "Oui, j'ai déjà un numéro et je veux ",
    portaYesStrong: "passer à Connectivity",
    portaYesPost: " (portabilité).",
    portaNumero: "Ton numéro de téléphone actuel",
    portaOperador: "Ton opérateur actuel",
    portaOperadorPh: "Movistar, Vodafone, Orange…",
    monthsLabel: "Mois à souscrire (prépayé)",
    monthOne: "mois",
    monthMany: "mois",
    tycPre: "J'accepte les ",
    tycLink: "conditions générales",
    tycPost: " du site.",
    payPrefix: "Payer — ",
    opening: "Ouverture du paiement…",
    payNote: "Paiement sécurisé avec Stripe · Tu pourras appliquer ton code de réduction au paiement.",
    emailsMismatchTitle: "Les emails ne correspondent pas",
    emailsMismatchDesc: "Vérifie le champ de confirmation d'email.",
    tycError: "Tu dois accepter les conditions générales pour continuer.",
    portaMissingTitle: "Informations de portabilité manquantes",
    portaMissingDesc: "Indique ton numéro actuel et ton opérateur actuel.",
    startErrTitle: "Le paiement n'a pas pu démarrer",
    startErrDesc: "Vérifie la configuration de Stripe.",
  },
};

export const translations: Record<Lang, Dict> = { es, en, fr };

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const Ctx = createContext<I18nCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Siempre ES en el primer render (server + cliente) para no romper la hidratación.
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGS.includes(stored)) {
      setLangState(stored);
      return;
    }
    const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    if (nav === "en" || nav === "fr") setLangState(nav);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within <LanguageProvider>");
  return ctx;
}
