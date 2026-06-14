# Paqarina Coffee ☕

Marketplace **mobile-first** de café de especialidad colombiano. Conecta **productores (fincas)** y **tostadores (marcas)** con compradores que buscan trazabilidad, historia y origen — de la montaña a la taza.

🔗 **Demo en vivo:** [paqarina-coffee.vercel.app](https://paqarina-coffee.vercel.app)

> La app se renderiza dentro de un **marco de teléfono** (390×844) en pantallas medianas/grandes para mostrarla como prototipo; en móvil ocupa toda la pantalla.

---

## ✨ Funcionalidades

**Para compradores**
- Catálogo con búsqueda (nombre, finca, región, notas) y filtros (precio, puntaje SCA, tueste, microlote, comercio justo)
- Categorías: Favoritos, Microlotes, Comercio justo, Tueste a pedido, Mujeres caficultoras, Anaeróbicos
- Detalle de café con trazabilidad, historia del productor, notas de cata y reseñas
- Carrito con checkout multi-paso (contacto, envío, pago, notas) e historial de pedidos
- Suscripción mensual (3 planes) y perfiles públicos de finca/marca

**Para vendedores**
- Onboarding con rol Productor / Tostador
- CRUD de cafés (stock, borrador, foto, notas, puntaje, etiquetas)
- Pedidos con estados avanzables y resumen de ventas (ingresos, comisión 10%, ganancia, sparkline)
- Editor de perfil y verificación Paqarina

---

## 🛠️ Stack

| | |
|---|---|
| **React** | 19 (función + hooks) |
| **Vite** | 8 |
| **TypeScript** | 6 (modo permisivo) |
| **Tailwind CSS** | v4 (`@tailwindcss/vite`, tokens en `@theme`) |
| **Tests** | Vitest 4 + Testing Library + jsdom (80 tests) |
| **Persistencia** | localStorage (sin backend) |
| **Deploy** | Vercel |

---

## 🚀 Desarrollo

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo → http://localhost:5173
npm run build      # build de producción → dist/
npm run preview    # servir el build
npm test           # correr los 80 tests
npm run lint       # ESLint
```

---

## 📁 Estructura

```
src/
├── App.tsx              # Orquestador: estado global, persistencia y composición
├── data.ts             # Constantes y datos demo
├── lib.ts              # Helpers puros (storage, format, carrito, seed)
├── types.ts            # Shapes del dominio (Coffee, Order, Seller…)
├── index.css           # Tailwind + tokens del tema (@theme)
└── components/         # UI agrupada por dominio
    ├── atoms.tsx       #   átomos reutilizables (Field, PillSelect, Stars…)
    ├── chrome.tsx      #   TopBar, Hero, BottomNav, SideMenu, búsqueda, filtros
    ├── coffee.tsx      #   tarjetas, detalle, reseñas, pantallas de catálogo
    ├── farms.tsx       #   fincas y tostadores
    ├── seller.tsx      #   onboarding, formulario de café, panel de vendedor
    ├── buyer.tsx       #   suscripción, historial, perfil de comprador
    └── cart.tsx        #   carrito + checkout (3 pasos)
```

Más detalle de arquitectura y decisiones de diseño en [`CLAUDE.md`](./CLAUDE.md).

---

## 📝 Notas

- **Demo sin backend**: todos los datos viven en `localStorage`. Los métodos de pago son simulados (no se procesa ningún pago real).
- **Reset de datos**: borra las claves `paqarina_*` del localStorage del navegador y recarga.

---

<sub>Café de especialidad colombiano · Bogotá · Colombia</sub>
