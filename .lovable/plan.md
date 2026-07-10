## Objetivo

Landing page de una sola ruta (`/`) para vender las SIMs prepago de **Connectivity**, con dos tarifas destacadas y un visualizador didáctico interactivo que compara ambos planes y permite seleccionar cuál comprar. Sin ninguna mención a DIGI.

## Planes (según Excel + tu confirmación)

| Plan | Datos | Llamadas nacionales | Min. internacionales | Precio |
|---|---|---|---|---|
| **Connectivity 80** | 80 GB acumulables | Ilimitadas | 1.000 min | **11,95 €/mes** |
| **Connectivity 150** | 150 GB acumulables | Ilimitadas | 1.000 min | **14,95 €/mes** |

Extras comunes (del Excel): 5G, sin permanencia, SIM física, activación por lotes, gigas acumulables.

## Estructura de la página

1. **Header** — logo Connectivity (imagen subida) + nav ancla (Planes · Comparador · Contacto) + CTA "Contratar".
2. **Hero** — titular fuerte ("Tu SIM prepago, sin límites y sin ataduras"), subtítulo con los 3 argumentos clave (5G, sin permanencia, gigas acumulables), botón primario "Ver planes", degradado sutil naranja→amarillo de acento.
3. **Sección Planes** — dos tarjetas grandes lado a lado (80GB y 150GB), la de 150GB marcada como "Más popular". Cada tarjeta lista incluidos con iconos y su propio CTA "Elegir este plan".
4. **Visualizador didáctico** (pieza central) — comparador interactivo:
   - Tabs / toggle grande arriba: **80 GB** · **150 GB** (o "Comparar ambos").
   - En vista individual: barras animadas mostrando GB, minutos nacionales (∞), minutos internacionales, precio; iconos ilustrativos (streaming, videollamadas, redes) con equivalencias didácticas ("150 GB ≈ 50 h de vídeo HD + navegación diaria").
   - En vista "Comparar": las dos tarjetas alineadas con las mismas métricas para ver diferencias de un vistazo, resaltando en qué gana cada una.
   - Debajo del comparador: **dos botones de compra** ("Comprar 80 GB — 11,95 €" y "Comprar 150 GB — 14,95 €") para que el usuario pueda contratar cualquiera de las dos, tal como pediste.
5. **Sección "Cómo funciona"** — 3-4 pasos con iconos (Elige plan → Recibe SIM → Activa → Navega).
6. **FAQ** — acordeón con preguntas típicas (¿son acumulables?, ¿hay permanencia?, ¿5G?, ¿llamadas al extranjero?).
7. **Footer** — logo, enlaces, aviso legal, redes.

## Compra

Como no mencionaste pasarela, los botones "Comprar" abrirán un **formulario de contratación** en un modal (nombre, email, teléfono, plan elegido, dirección de envío) que por ahora solo muestra un toast de confirmación. Cuando quieras conectar pagos reales o enviar el pedido por email, lo añadimos en un segundo paso.

## Identidad visual

- **Colores**: fondo blanco, naranja `#F58220` → amarillo `#FDB913` (degradado del logo) como acento en CTAs, iconos y highlights; texto en gris oscuro `#1F1B16`; grises suaves para tarjetas y bordes.
- **Tipografía**: display bold moderna para titulares + sans humanista para texto (por ejemplo *Outfit* + *Figtree* vía `@fontsource`).
- **Estilo**: limpio, cálido, con generoso whitespace, esquinas redondeadas medias, sombras suaves, degradados sutiles del naranja→amarillo en piezas clave (tarjeta destacada, barras del visualizador, CTA principal). Micro-animaciones al hacer scroll y transiciones suaves en el comparador.
- **Logo**: se sube como asset (`user-uploads://Logo_Connectivity.png`) y se usa en header y footer.

## Notas técnicas

- Ruta única `/` en `src/routes/index.tsx` (TanStack Start).
- Componentes en `src/components/landing/` (Hero, PlansSection, Visualizer, HowItWorks, FAQ, Footer, PurchaseDialog).
- Tokens de color añadidos a `src/styles.css` (`--brand-orange`, `--brand-yellow`, gradiente `--gradient-brand`).
- Estado del comparador con `useState` (plan activo / modo comparar).
- shadcn: `Card`, `Button`, `Tabs`, `Dialog`, `Accordion`, `Slider` si hace falta.
- Metadatos SEO en el `head()` de la ruta: título "Connectivity — SIMs prepago 5G con gigas acumulables", descripción, og:title/description/type, twitter:card.
- Sin backend, sin Cloud, sin menciones a DIGI en ningún texto.
