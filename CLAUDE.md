# Paqarina Coffee

Marketplace mobile-first de café de especialidad colombiano. Conecta **productores (fincas)** y **tostadores (marcas)** con compradores que buscan trazabilidad, historia y origen.

La app se renderiza dentro de un **marco de teléfono** (390×844) en pantallas medianas y grandes para mostrarla como prototipo; en mobile (≤640px) ocupa el viewport completo.

---

## Tecnologías

| Stack | Versión / detalle |
|---|---|
| **React** | 19 (función + hooks) |
| **Vite** | 8 — dev server + build de producción |
| **TypeScript** | 6 en modo permisivo (`strict:false`, `allowJs:true`, `noImplicitAny:false`) para migración incremental |
| **Tailwind CSS** | v4 con `@tailwindcss/vite` y tokens del tema en `@theme` |
| **Vitest** | 4 + `@testing-library/react` + `jsdom` |
| **Persistencia** | localStorage (sin backend) |
| **Fuentes** | Playfair Display (display) + Cormorant Garamond (serif) + Inter (sans), vía Google Fonts |

### Scripts disponibles

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # Build de producción → dist/
npm run preview      # Sirve el build
npm test             # vitest run (80 tests)
npm run test:watch   # vitest en modo watch
npm run lint         # ESLint
```

---

## Estructura de archivos

```
mi-proyecto/
├── CLAUDE.md                  # Este archivo
├── README.md                  # Portada del repo (descripción, stack, scripts, demo)
├── tsconfig.json              # TS permisivo, allowJs, jsx: react-jsx
├── vite.config.js             # Plugins: react + tailwindcss + vitest
├── package.json               # Scripts y deps
├── eslint.config.js
├── index.html                 # Entry HTML → /src/main.tsx (lang=es, theme-color, OG metas)
├── .claude/
│   └── launch.json            # Config del preview server (Vite via node)
├── public/
│   ├── favicon.png            # Isotipo: la Q oficial sobre badge cuadrado #15100C (512²)
│   ├── q-mark.png             # La Q oficial sola, transparente (isotipo dentro de la app)
│   ├── avatar-512.png         # Isotipo sobre badge 512² (avatar GitHub/Vercel/redes, apple-touch-icon)
│   ├── avatar-1024.png        # Isotipo sobre badge 1024² (avatar alta resolución, og:image)
│   ├── logo-paqarina.png      # Wordmark oficial PAQARINA+COFFEE (transparente, para TopBar/menú)
│   └── logo-paqarina-full.png # Wordmark + tagline "CAFÉ DE ESPECIALIDAD" (para footer)
└── src/
    ├── main.tsx               # createRoot + <App/>
    ├── App.tsx                # Orquestador: estado global, persistencia y composición (~250 líneas)
    ├── data.ts                # Constantes y datos demo
    ├── lib.ts                 # Helpers puros (storage, format, carrito, seed)
    ├── lib.test.ts            # 41 tests unitarios de helpers
    ├── types.ts               # Shapes del dominio (Coffee, Order, Seller…)
    ├── index.css              # Tailwind + @theme tokens + animaciones + a11y
    ├── components/
    │   ├── atoms.tsx          # PaqarinaMark, BrandMark, Field, Input, Textarea, PillSelect, VerifiedBadge, Stars, Toast, EmptyState, SectionHeader
    │   ├── chrome.tsx         # TopBar, Hero, CategoryChips, BottomNav, SideMenu, SearchBar, FiltersPanel
    │   ├── coffee.tsx         # CoffeeCard, CoffeeList, ProducerStories, OriginMap, ReviewSection, ProductDetail, HomeScreen, CatalogScreen
    │   ├── farms.tsx          # FarmCard, FarmsScreen, FarmProfile
    │   ├── seller.tsx         # SellerOnboarding, CoffeeForm, SalesSummary, Sparkline, OrderCard, FincaEditor, ProfileScreen
    │   ├── buyer.tsx          # SubscriptionStatus, SubscriptionPanel, BuyerOrderCard, BuyerOrders, BuyerProfile
    │   ├── cart.tsx           # CartView (3 pasos)
    │   └── *.test.tsx         # 39 tests de componentes (coffee, cart, seller, buyer) con RTL
    └── test/
        └── setup.js           # Setup de Vitest (@testing-library/jest-dom)
```

---

## Modelo de datos

### Roles del vendedor (`Seller.role`)

| Valor interno | UI muestra | Significado |
|---|---|---|
| `"productor"` | "Productor" / "PANEL DE PRODUCTOR" | Caficultor que cultiva y vende café de su finca |
| `"curador"` | "Tostador" / "PANEL DE TOSTADOR" | Marca que vende café propio tostado |

> **Importante**: el valor interno sigue siendo `"curador"` (por compatibilidad con localStorage existente). Toda la UI fue renombrada a "Tostador" pero el código sigue usando `role === "curador"` y `isCurator`.

### Entidades principales (ver `src/types.ts`)

- **`Coffee`** — nombre, finca, caficultor, región, altitud, proceso, variedad, notas, score SCA, precio, peso, tueste, fresh, tag, stock, verified, imageUrl, etc. Cafés del vendedor llevan `bySeller`, `sellerId`, `isCurator`, `draft`.
- **`CartItem`** = `Coffee` + `qty` + `grind` opcional.
- **`Order`** — id, fecha, customer, items, subtotal, shipping, total, status, byUser, shippingMethod, paymentMethod, notes.
- **`Seller`** — id, role, fincaName, farmerName, region, altitude, story, certifications, verified, joined.
- **`Customer`** — name, email, phone, address, city, shippingId, paymentId (se guarda tras checkout).
- **`Subscription`** — planId + startDate.
- **`Review`** — id, coffeeId, customerName, customerEmail, rating, comment, date.
- **`FincaEntity`** — vista derivada para listas/perfiles públicos: name, farmer, region, coffees, isSeller, kind (`"finca"|"curador"`), verified.

### Persistencia (claves de localStorage)

```ts
STORAGE = {
  seller: "paqarina_seller",
  coffees: "paqarina_seller_coffees",
  orders: "paqarina_orders",
  cart: "paqarina_cart",
  favorites: "paqarina_favorites",
  customer: "paqarina_customer",
  reviews: "paqarina_reviews",
  subscription: "paqarina_subscription",
}
```

---

## Componentes principales

### Layout / chrome (`components/chrome.tsx`)
- **`App`** (`src/App.tsx`): orquesta todo el estado global (cart, seller, orders, favorites, customer, reviews, subscription, navegación, modales, toasts) y compone los screens.
- **`TopBar`** — header con menú (hamburguesa), logo Paqarina, búsqueda y carrito.
- **`BottomNav`** — 5 pestañas: Inicio · Cafés · Fincas · Tostadores · Tú.
- **`SideMenu`** — drawer izquierdo que abre la hamburguesa. Lista navegación + acciones (carrito, suscripción) + saludo al cliente.
- **`Hero`** — sección de bienvenida del Inicio con CTA "EXPLORAR CAFÉS" (scroll dentro de Inicio), FINCAS y TOSTADORES (navegan a pestañas).
- **`CategoryChips`** — chips horizontales (Todos, Favoritos, Microlotes, Comercio justo, Tueste a pedido, Mujeres caficultoras, Anaeróbicos).

### Pantallas (Screens) (`components/coffee.tsx`, `farms.tsx`, `seller.tsx`)
- **`HomeScreen`** — Hero + CategoryChips + listado de cafés (con `id="home-catalog"` para el scroll del botón EXPLORAR CAFÉS) + ProducerStories + OriginMap + footer.
- **`CatalogScreen`** — versión enfocada del catálogo (solo header + chips + lista).
- **`FarmsScreen`** — lista de fincas o tostadores (mismo componente, distinto contenido según pestaña activa).
- **`ProfileScreen`** — sección Tú. Si no eres vendedor, muestra `BuyerProfile`. Si lo eres, un **toggle Comprador/Vendedor** arriba que cambia entre:
  - **Comprador**: saludo + suscripción + Mis compras + botón "Ir a mi panel de vendedor".
  - **Vendedor**: dashboard con 3 sub-pestañas (Mis cafés, Pedidos, Finca/Marca).

### Café / catálogo (`components/coffee.tsx`; `CoffeeForm` vive en `seller.tsx`)
- **`CoffeeCard`** — tarjeta con cover (imagen o gradiente), tag, score SCA, badge favorito, badge "BORRADOR"/"TU FINCA"/"TU MARCA", verified badge junto al caficultor, stock indicator, botón "+" deshabilitado si agotado.
- **`CoffeeList`** — wrapper que renderiza varias `CoffeeCard`.
- **`ProductDetail`** — overlay (zIndex 60) con imagen, notas de cata, trazabilidad, historia del productor (dinámica via `storyFor`), molienda, reseñas y bottom bar con qty + AGREGAR AL CARRITO. Respeta stock.
- **`CoffeeForm`** — overlay para crear/editar un café (vendedor). Incluye stock, borrador, subida de imagen (canvas resize a 600px → JPEG base64).
- **`ReviewSection`** — promedio + estrellas + lista de reseñas. Solo compradores que han comprado pueden reseñar (1 por café por email).
- **`Stars`** — componente reutilizable, lectura o selección (con `aria-label`).

### Finca / tostador (`components/farms.tsx`)
- **`FarmCard`** — tarjeta de finca/marca para listas.
- **`FarmProfile`** — overlay (zIndex 55) con perfil público: cover, nombre + verified badge, certificaciones, altitud/credencial, historia, lista de cafés.

### Vendedor (`components/seller.tsx`)
- **`SellerOnboarding`** — formulario con selector de rol (Productor / Tostador) y campos adaptables. Al registrar siembra 2 cafés starter + 2 órdenes demo.
- **`FincaEditor`** — edita el perfil de finca/marca + estado de verificación + botón "CERRAR PERFIL DE VENDEDOR" (resetea seller y sus cafés).
- **`OrderCard`** — muestra un pedido al vendedor con items que son suyos, subtotal, comisión Paqarina (10%) y ganancia neta. Botón "MARCAR COMO ENVIADO/ENTREGADO".
- **`SalesSummary`** — KPIs (Ingresos brutos, Comisión, Ganancia neta, Pedidos, Unidades, Top café).
- **`Sparkline`** — SVG simple de barras con los ingresos de los últimos 7 días.

### Comprador (`components/buyer.tsx`)
- **`BuyerProfile`** — vista cuando aún no eres vendedor (greeting + suscripción + Mis compras + CTA "Conviértete en vendedor").
- **`BuyerOrders`** + **`BuyerOrderCard`** — historial de pedidos del comprador con envío, pago, dirección, status, total.
- **`SubscriptionStatus`** — tarjeta de suscripción: si no hay, CTA "Ver planes"; si hay, datos del plan + próximo envío + cancelar.
- **`SubscriptionPanel`** — bottom-sheet con 3 planes (Descubrir $69k, Explorar $119k, Conocedor $189k) y "ACTIVAR SUSCRIPCIÓN".

### Carrito / checkout (`components/cart.tsx`)
- **`CartView`** — overlay con **3 pasos**:
  1. **cart**: lista de items con qty (dedupe por `id + grind`).
  2. **checkout**: formulario (contacto + envío con 3 métodos + pago con 4 métodos + notas).
  3. **confirmed**: pantalla de gracias con id de pedido.
- Persiste datos del cliente en localStorage para autocompletar futuros checkouts.

### Buscar / filtrar / feedback (`SearchBar`/`FiltersPanel` en `chrome.tsx`; `Toast`/`EmptyState` en `atoms.tsx`)
- **`SearchBar`** — abre desde la lupa de TopBar; busca por nombre, finca, región, notas, variedad.
- **`FiltersPanel`** — bottom-sheet con precio min/max, score SCA min, tueste (multi-pill), microlote, comercio justo.
- **`Toast`** — notificación al añadir al carrito, marcar favorito, etc. Auto-dismiss 2.2s, `role="status"` + `aria-live="polite"`.
- **`EmptyState`** — patrón reutilizable: icono + título + mensaje + CTA opcional.

### Atoms / utilidades (`components/atoms.tsx`)
- **`PaqarinaMark`** — la **Q** suelta para empty states y el header del detalle. El wordmark completo usa el PNG oficial, no vector.
- **`BrandMark`** — monograma (iniciales) de la **marca del vendedor** para el empaque del café. Cada finca/marca muestra su propio sello, NO el isotipo de Paqarina (que es el marketplace, no el productor). Iniciales vía `brandInitials()` en `lib.ts` (ignora prefijos genéricos: Finca, Hacienda, La, El…).
- **`Field`** — wrapper consistente para inputs con label uppercase.
- **`Input`** / **`Textarea`** — inputs con el estilo base del tema (reemplazan al viejo `inputStyle(t)`).
- **`PillSelect`** — selector pill, single o multi.
- **`VerifiedBadge`** — check dorado para fincas/marcas verificadas por Paqarina.
- **`SectionHeader`** — kicker dorado + título serif.

---

## Decisiones de diseño importantes

### Identidad de marca
- **El wordmark oficial es el PNG** `public/logo-paqarina.png` (PAQARINA + COFFEE) y `public/logo-paqarina-full.png` (con tagline "CAFÉ DE ESPECIALIDAD"). Se generaron a partir del logo oficial (`Paqarina Coffee.jpg`): recortados al wordmark y con el negro convertido a transparencia (alpha por luminancia) para que asienten limpios sobre el oscuro de la UI. Usos: `<img>` en TopBar (`h-7`), SideMenu (`h-7`) y footer del Home (full, `h-16`).
  - **Regenerar** (si cambia el logo): instalar `sharp` (`npm i -D sharp`), correr un script que lea el JPG raw, calcule alpha = `(luminancia−58)/(178−58)` clamp, recorte al bbox (cortando la tagline en y≈580 para la versión de header), y exporte PNG. El original NO se versiona; usar el archivo oficial.
- **Lo distintivo de la Q**: es una **Q serif** con (1) **bowl de trazo con contraste** (lados gruesos, arriba/abajo finos — no un anillo geométrico uniforme), (2) un **diamante (rombo) en el centro** del counter, y (3) una **cola caligráfica que barre a la derecha y tapera a punta** (guiño sutil a un grano de café). NO es un óvalo, NO es un punto redondo, NO es una "lupa", NO es una cola que cae por debajo.
- **El arte de la Q es oficial (raster), no vector**. Archivos fuente del diseñador: `q-final2-transparent.png` (Q dorada transparente 1000²), `q-final2-ink.png` (Q sobre tinta) y `q-final2-favicon-512.png` (optimizada para favicon). NO viven en el repo — están en `~/Downloads`.
- **`PaqarinaMark`** (`components/atoms.tsx`): renderiza `<img src="/q-mark.png">` (la Q oficial transparente, recortada) para empty states y el header del detalle. Es raster gold; ya no acepta recolor. **No** se usa en empaques de café — ahí va `BrandMark` (la marca del vendedor).
- **Isotipo (la Q sola)**: `favicon.png` y `avatar-512/1024.png` se generan con `sharp` componiendo la Q oficial transparente sobre un badge cuadrado redondeado #15100C. **Regenerar**: `npm i -D sharp`, copiar las `q-final2-*.png` de Downloads a `public/`, y correr el script de composición (badge rx 22%, Q al ~62% centrada con `.trim()`); ver historial de git. El header de la app mantiene el wordmark completo, no el isotipo. El icono "Cafés" del BottomNav (círculo + punto) es un eco intencional del motivo.

### Tema visual
- **Un solo tema activo** — dark con dorado, paleta derivada del logo oficial. Tokens (`src/index.css` `@theme`):
  - **page** `#15100C` · **surface** `#1D1610` · **surface-2** `#241B14` (negros cálidos del fondo del logo).
  - **ink** `#FAF6EF` (crema del logo) · **muted**/**dim** rgba de ink.
  - **gold** `#D4B36A` · **gold-light** `#E8D5A3` (hover) · **gold-dark** `#B8954A` (activos) · **gold-soft**, **line**, **line-soft** derivados.
- **Fuentes**: `font-display` (Playfair Display) para títulos hero/editoriales, `font-serif` (Cormorant Garamond) para el resto del editorial e itálicas, `font-sans` (Inter) para cuerpo/UI. Cargadas vía Google Fonts en el `<style>` de `App.tsx`.
- **Tailwind v4, tokens solo en CSS variables** — expuestos como utilities (`bg-page`, `text-gold`, `text-gold-light`, `font-display`, `font-serif`, etc.). El antiguo objeto JS `THEMES`/prop `t` fue eliminado; todo el estilo es Tailwind. Los `style={{...}}` que quedan son solo valores dinámicos (gradientes de café, imágenes, tamaños calculados).
- **Contraste**: el dorado `#D4B36A` se usa para títulos grandes y acentos; para texto pequeño sobre fondo claro usar `gold-dark`/`brown` (la app es dark, así que el dorado va sobre negro = alto contraste).
- **Marco de teléfono** solo en desktop (`sm:` y arriba). Mobile usa viewport completo.

### Modelo de datos
- **`role: "curador"`** se conserva internamente aunque la UI dice "Tostador" — evita migración de datos en localStorage de usuarios ya registrados.
- **Decremento de stock** al hacer checkout, solo para cafés del vendedor (los estáticos se quedan con su stock).
- **Demo orders sembradas** al registrar vendedor para que el dashboard no esté vacío. Sus ids llevan timestamp único para evitar colisión de keys de React.
- **Comisión Paqarina** fija al 10% (`COMMISSION_RATE` en `data.ts`).

### Migración (completada)
- **TypeScript**: todos los componentes tienen props tipadas con las interfaces de `types.ts`. El modo sigue permisivo (`strict:false`) — endurecerlo es opcional.
- **Tailwind**: conversión completa. No queda theme-prop `t` ni `inputStyle(t)`; los inputs usan los átomos `Input`/`Textarea` de `components/atoms.tsx`.

### Accesibilidad
- Focus visible global con outline dorado en `index.css`.
- `aria-label`, `aria-pressed`, `aria-current`, `aria-live` en componentes interactivos.
- Animaciones desactivadas con `prefers-reduced-motion: reduce` (todas a 0ms).

### Animaciones
4 keyframes definidos en `index.css`:
- `anim-fade-in` (200ms) — backdrops
- `anim-slide-up` (280ms) — overlays full-screen (ProductDetail, CartView, FarmProfile, CoffeeForm)
- `anim-sheet-up` (320ms) — bottom-sheets (Filtros, Suscripción)
- `anim-toast-in` (240ms) — toast
- `anim-slide-in-left` (280ms) — menú lateral

### Estructura de App.tsx
`App.tsx` quedó como orquestador puro (~250 líneas): estado global, efectos de persistencia en localStorage, derivaciones memoizadas (catálogo filtrado, fincas/marcas) y composición de screens/overlays. La UI vive en `src/components/` agrupada por dominio (ver estructura de archivos).

---

## Funcionalidades implementadas

### Para compradores
- ✅ Búsqueda por nombre, finca, región, notas
- ✅ Filtros (precio, score SCA, tueste, microlote, comercio justo)
- ✅ Categorías (Favoritos, Microlotes, Comercio justo, Tueste a pedido, Mujeres caficultoras, Anaeróbicos)
- ✅ Favoritos persistidos (heart en card y detail)
- ✅ Detalle de café con trazabilidad, historia del productor, notas de cata, reseñas
- ✅ Carrito con multi-paso checkout (datos cliente, envío, pago, notas)
- ✅ Historial de pedidos con estado en tiempo real
- ✅ Suscripción mensual (3 planes)
- ✅ Reseñas (1 por café por persona, solo compradores)
- ✅ Perfiles públicos de finca/marca

### Para vendedores
- ✅ Onboarding con selector de rol (Productor/Tostador)
- ✅ CRUD de cafés con stock, borrador, foto, color de empaque, notas, score, etiquetas
- ✅ Pedidos con estados avanzables (Nuevo → Preparando → Enviado → Entregado)
- ✅ Resumen de ventas (Ingresos, Comisión 10%, Ganancia, Unidades, Top café)
- ✅ Sparkline de ventas últimos 7 días
- ✅ Editor de perfil de finca/marca
- ✅ Solicitud de verificación Paqarina (simulada con timeout)
- ✅ Cerrar perfil de vendedor

### Tooling / calidad
- ✅ TypeScript activo (modo permisivo) con props tipadas en todos los componentes
- ✅ Tailwind v4 con tokens del tema en `@theme` — conversión completa, sin inline styles salvo valores dinámicos
- ✅ Componentes partidos por dominio en `src/components/`
- ✅ Animaciones + soporte `prefers-reduced-motion`
- ✅ Responsive (phone frame en desktop, fullscreen en mobile)
- ✅ Accesibilidad básica (focus visible, aria, labels)
- ✅ 80 tests con Vitest: 41 de helpers (`lib.test.ts`) + 39 de componentes con React Testing Library (`components/*.test.tsx`)
- ✅ Build de producción verificado (`npm run build`)

---

## Próximos pasos pendientes

> El refactor grande (Tailwind completo, tipado de props, split de `App.tsx` en `components/`) ya se completó.

### Tests
1. **Tests E2E con Playwright** (opcional) — flujos críticos: registro de vendedor, checkout, marcar favorito. (Los tests de componentes con RTL ya están hechos.)

### Funcionalidad nueva (no priorizada)
2. **Cupones / códigos de descuento** en checkout (item #9 original — saltado por petición).
3. **Curador "real"**: que el tostador arme colecciones de cafés de múltiples productores en lugar de vender solo su marca (item #15 original — saltado por petición).
4. **Múltiples vendedores reales** — hoy el "vendedor" es la sesión local. Para multi-vendor, requiere backend.
5. **Multi-tema** — los tokens viven en `@theme` (CSS variables); un segundo tema sería otro set de variables + un toggle.

### Deploy
6. **Desplegar a Vercel/Netlify** — el build de producción (`dist/`) está listo. Conectar repo + auto-deploy. Falta crear el repo y hacer el push inicial (el proyecto local no es un repo git aún).

### Backend (transformación grande)
7. **Persistencia real**: hoy todo es localStorage. Para producción real se necesitaría backend (Supabase, Firebase, custom). Tendría implicaciones en el modelo (multi-usuario, auth, etc.).
8. **Pagos reales**: hoy los métodos de pago son simulados ("Demo: no se procesa ningún pago real"). Integrar Stripe / MercadoPago / PSE / Nequi requeriría backend.
9. **Subida de imágenes a CDN**: hoy las imágenes se guardan como base64 en localStorage (límite ~5MB). Para producción habría que subirlas a un bucket (Cloudinary, S3, etc.).

---

## Notas operativas

- **Node**: instalado vía winget en `C:\Program Files\nodejs\`. Si la sesión no tiene `node` en el PATH, prependerlo: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`.
- **Reset de datos**: borrar las 8 claves `paqarina_*` de localStorage del navegador y recargar.
- **HMR + módulos renombrados**: tras renombrar `.jsx` → `.tsx` puede que el dev server cachee errores de HMR históricos. Suelen ser inocuos; recargar la página los limpia. Si persisten, matar el proceso de Vite y `npm run dev` de nuevo.
