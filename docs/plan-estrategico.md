# Paqarina Coffee — Plan estratégico a largo plazo

> Documento vivo. Creado: julio 2026. Estado del producto al crearlo: prototipo completo en
> producción (https://www.paqarinacoffee.com), sin backend, pagos simulados, un solo vendedor
> por sesión local.

---

## Visión

Ser la plataforma que conecta el café de especialidad colombiano —sus fincas, sus historias y
su gente— con compradores que valoran trazabilidad y origen, evolucionando de marketplace de
producto a plataforma de **producto + experiencias + turismo de origen**, primero en Colombia
y luego en otros países productores.

## Las 5 fases

| Fase | Nombre | Objetivo central | Horizonte orientativo |
|---|---|---|---|
| 0 | Fundamentos | Producto operable de verdad + base legal | 2–4 meses |
| 1 | Oferta | Conseguir proveedores (fincas y tostadores) reales | 3–6 meses (solapa con 0) |
| 2 | Demanda | Marketing de dos lados y primeras ventas recurrentes | 6–12 meses |
| 3 | Experiencias | Catas, talleres y experiencias ofrecidas por proveedores | 12–18 meses |
| 4 | Expansión | Replicar el modelo en otros países | 18–36 meses |
| 5 | Inmersión | Viajes y hospedaje en fincas (turismo de origen) | 36+ meses |

La regla de oro de un marketplace: **la oferta primero**. Un catálogo real y con historia atrae
compradores; lo contrario no funciona. Por eso la Fase 1 va antes que el marketing masivo.

---

## Fase 0 — Fundamentos (prerequisito de todo lo demás)

Hoy la app es un prototipo demo: los datos viven en localStorage del navegador de cada visitante,
los pagos son simulados y solo existe "un vendedor" por sesión. Para firmar el primer proveedor
real hay que cerrar esta brecha.

### Producto (técnico)

1. **Backend real** (Supabase es el candidato natural: Postgres + Auth + Storage, gratis para
   empezar). Implica: auth de usuarios, multi-vendedor real, cafés/pedidos/reseñas en base de
   datos, imágenes en bucket (hoy son base64 en localStorage).
2. **Pagos reales**: pasarela colombiana — Wompi, MercadoPago o ePayco (cubren PSE, Nequi,
   tarjetas). El flujo de checkout ya existe en la UI; falta conectarlo.
3. **Panel de pedidos funcional para el vendedor** con notificaciones (email al recibir pedido).
4. **Links directos por café/finca** (routing) — imprescindible para marketing (compartir en
   redes, WhatsApp).
5. Lo que ya está y es ventaja: UX completa, branding cerrado, 84 tests, deploy automático.

### Legal / operativo (Colombia)

- Constituir la empresa (SAS) y registro en Cámara de Comercio; RUT y facturación electrónica.
- Definir el **modelo operativo del envío**: ¿el proveedor despacha directo (dropshipping desde
  finca/tostador) o Paqarina consolida? Recomendado al inicio: **el proveedor despacha**, con
  guías de Servientrega/Interrapidísimo/Coordinadora negociadas.
- Café tostado empacado para venta requiere **registro sanitario INVIMA** — normalmente lo tiene
  el tostador/maquilador. Verificarlo por proveedor en el onboarding (checkbox + evidencia).
- Términos y condiciones, política de datos (Habeas Data), contrato marco con proveedores
  (comisión, calidad, tiempos de despacho, devoluciones).

### Modelo de ingresos inicial

- **Comisión por venta**: el 10% ya está en el producto (`COMMISSION_RATE`). Revisar contra el
  mercado: los marketplaces de especialidad suelen cobrar 15–25%; 10% puede ser el "precio de
  lanzamiento" para los primeros 20 proveedores, subiendo después para nuevos.
- Suscripciones de café (los 3 planes ya diseñados en la app) como segunda línea.

**Criterio de salida de Fase 0**: una persona cualquiera puede comprar un café real, pagarlo de
verdad, y el proveedor lo despacha y cobra su parte.

---

## Fase 1 — Conseguir proveedores (la oferta)

### Propuesta de valor al proveedor

- Vitrina digital profesional **gratis** (perfil de finca con historia, fotos, verificación) —
  la mayoría de fincas no tiene presencia digital decente.
- Solo pagan comisión cuando venden: cero riesgo.
- Paqarina cuenta su historia (trazabilidad, notas de cata, perfil del caficultor) — eso es
  exactamente lo que la app ya hace bien.
- Más adelante: canal para vender experiencias (Fase 3) y turismo (Fase 5) — mencionarlo desde
  el pitch inicial porque es diferenciador frente a "otro marketplace más".

### Dónde encontrarlos

1. **Círculo cercano primero**: contactos personales/familiares en zonas cafeteras. Los primeros
   3–5 proveedores se consiguen por relación, no por marketing.
2. **Ferias**: Cafés de Colombia Expo (Bogotá, octubre — la cita clave del año), ferias
   regionales del Eje Cafetero, Huila (Pitalito/Garzón), Nariño, Sierra Nevada.
3. **Cooperativas y asociaciones de caficultores** (vía comités departamentales de la FNC):
   una cooperativa aliada = decenas de fincas de un golpe.
4. **Tostadores urbanos de especialidad** (Bogotá, Medellín, Armenia): ya venden online, ya
   tienen INVIMA y fotos; son el proveedor más fácil de onboardear primero.
5. **Instagram**: buscar fincas/tostadores con cuenta activa pero sin e-commerce propio.

### Proceso de onboarding (definir y documentar)

Solicitud → llamada/visita → verificación (fotos reales, INVIMA si tuesta, prueba de producto:
pedir muestra y catarla) → alta en la plataforma con sesión de fotos/historia asistida por
Paqarina → primer café publicado. **La curaduría es el producto**: mejor 15 proveedores
excelentes que 100 mediocres.

### Metas sugeridas

- Mes 3: 5 proveedores activos (mezcla: 3 tostadores + 2 fincas), 15–25 cafés reales.
- Mes 6: 15 proveedores, cobertura de 4+ regiones (Huila, Eje Cafetero, Nariño, Sierra Nevada).
- KPI de salud: % de proveedores con ≥1 venta/mes, tiempo de despacho, tasa de recompra por café.

---

## Fase 2 — Plan de marketing (dos lados)

### Marca y mensaje

- Posicionamiento: **"del origen a tu taza, con nombre y apellido"** — trazabilidad + historia.
  No competir por precio; competir por confianza y relato.
- La identidad visual ya está cerrada (Q, dorado sobre negro cálido) — el marketing la hereda.

### Lado comprador (B2C Colombia)

1. **Contenido orgánico (el motor principal, bajo costo)**: Instagram + TikTok con historias de
   finca — el caficultor contando su lote, el proceso, la cata. Cada proveedor nuevo = una serie
   de contenido. Reels de "conoce a quien cultivó tu café" convierten mejor que fotos de producto.
2. **SEO**: páginas por café/finca/región (requiere el routing de Fase 0). Búsquedas objetivo:
   "café de especialidad colombia comprar", "café de Huila online", "suscripción café especialidad".
3. **Email/WhatsApp**: lista desde el checkout y la suscripción; campaña mensual de "lotes nuevos".
4. **Micro-influencers de café** (baristas, catadores con 5–50k seguidores): canje por producto
   + código de descuento (los cupones son un pendiente conocido del producto — priorizarlos aquí).
5. **Eventos**: cuponera/QR en ferias y cafeterías aliadas; cata de lanzamiento en Bogotá/Medellín.
6. **Pauta paga**: solo después de validar conversión orgánica; empezar con retargeting y
   lookalikes en Meta con presupuesto pequeño (COP 1–2M/mes) midiendo CAC vs. margen de comisión.

### Lado proveedor (B2B)

1. **Kit de vendedor**: landing "Vende en Paqarina" + PDF de una página con la propuesta de valor
   y casos (cuando existan).
2. **Caso de éxito como munición**: documentar al primer proveedor que venda bien (cifras,
   testimonio en video) y usarlo en ferias y llamadas.
3. **Los proveedores traen compradores**: cada finca/tostador comparte su perfil con su audiencia.
   Facilitárselo: assets listos (post de "ya estamos en Paqarina"), link directo a su perfil.
4. **Referidos entre proveedores**: comisión reducida 1–2 meses por cada proveedor referido que
   se active.

### Métricas norte

- **GMV mensual** (ventas totales) y **take rate efectivo**.
- CAC comprador vs. valor de vida (empujado por suscripciones y recompra).
- Ratio liquidez del marketplace: % de cafés listados que venden al menos 1 unidad/mes.

---

## Fase 3 — Experiencias de café

Extensión natural: los mismos proveedores ofrecen **catas, talleres de barismo, tours de finca
de un día**. Margen alto, inventario infinito (es tiempo, no producto) y profundiza la marca.

### Producto (app)

- Nueva entidad **`Experience`**: título, proveedor, tipo (cata / taller / tour de día), lugar
  (presencial en ciudad, en finca, o virtual), fecha(s)/cupos, precio, duración, qué incluye.
- Flujo de **reserva** (fecha + cupos) distinto del carrito de producto — es booking, no shipping.
- Pestaña o sección "Experiencias" en la app; las experiencias también aparecen en el perfil
  público de la finca/marca.
- **Cata virtual con kit**: híbrido perfecto — se vende el kit de cafés (logística ya resuelta)
  + sesión por videollamada. Es la experiencia más escalable y la mejor para empezar.

### Negocio

- Comisión mayor que en producto (15–20%) — justificada porque Paqarina aporta la demanda y la
  pasarela de reservas.
- Empezar con 2–3 proveedores piloto que ya hagan catas por su cuenta.
- Las experiencias son además el **semillero de la Fase 5**: los proveedores que operen bien
  tours de un día son los candidatos a hospedaje.

---

## Fase 4 — Expansión internacional

Dos rutas, no excluyentes; decidir con datos de Fase 2–3:

1. **Vender café colombiano al exterior** (export B2C/B2B): probablemente la primera, porque
   apalanca la oferta ya construida. Mercados naturales: EE. UU. y UE (especialidad), donde
   "single origin Colombia + historia del caficultor" tiene demanda probada. Requiere: logística
   internacional (aliado exportador o programa como el de la FNC), precios en USD/EUR, sitio
   multi-idioma, y revisar regulaciones de importación de alimentos por país.
2. **Replicar el marketplace en otros países productores** (Perú —el nombre quechua "Paqarina"
   ayuda—, Guatemala, Etiopía…): misma plataforma, nueva oferta local. Mucho más costoso en
   operación; solo con el playbook de Colombia probado y documentado (ese playbook se escribe
   durante las Fases 1–3).

Prerequisitos técnicos: multi-moneda, multi-idioma (i18n), envíos internacionales en checkout.

---

## Fase 5 — Experiencias inmersivas (turismo de origen)

Visión: el comprador viaja, se hospeda en la finca y vive el proceso completo (cosecha,
beneficio, secado, tueste, cata). Es "Airbnb del café" sobre la confianza construida en Fases 1–3.

- **Modelo**: Paqarina como plataforma de reserva y curaduría; la finca opera el hospedaje.
  Comisión estilo OTA (12–18%).
- **Requisitos duros**: en Colombia, hospedaje comercial exige **Registro Nacional de Turismo
  (RNT)** del operador; seguros de responsabilidad; estándares mínimos verificados en persona
  (habitación, baño, seguridad, acceso). La curaduría presencial no es opcional aquí.
- **Camino de entrada de bajo riesgo**: paquetes con **operadores de turismo cafetero ya
  existentes** (Eje Cafetero tiene oferta madura) co-brandeados con las fincas Paqarina, antes
  de construir el producto de reservas propio.
- Solo tiene sentido con: marca reconocida, ≥20–30 fincas activas y confiables, y demanda
  demostrada en experiencias de día (Fase 3).

---

## Riesgos principales y mitigación

| Riesgo | Mitigación |
|---|---|
| Huevo-gallina (proveedores sin ventas se van) | Pocos proveedores muy curados + marketing concentrado en sus cafés; expectativas claras de rampa |
| Calidad inconsistente (café llega mal, mata la confianza) | Muestras catadas antes del alta; reseñas; retirar cafés con quejas; empaque estándar sugerido |
| Logística desde fincas remotas | Empezar con tostadores urbanos; guías negociadas; SLA de despacho de 48h en el contrato |
| Desintermediación (comprador y finca cierran por fuera) | Aportar valor continuo: contenido, suscripciones, experiencias, reputación en plataforma |
| Costos de backend/pagos antes de tener ingresos | Stack de costo casi cero (Supabase free tier, Vercel, comisión de pasarela solo por venta) |
| Regulatorio (INVIMA, RNT en Fase 5) | Checklist legal por fase; exigir documentación en onboarding |

## Qué NO hacer todavía

- No gastar en pauta paga antes de tener oferta real y conversión orgánica medida.
- No construir el producto de reservas de hospedaje (Fase 5) antes de validar experiencias de día.
- No expandir a otro país antes de que Colombia tenga liquidez de marketplace (Fase 2 cumplida).
- No abrir la puerta a cualquier proveedor: la curaduría es la marca.

## Próximas acciones concretas (30 días)

1. Decidir stack de backend (recomendado: Supabase) y arrancar la migración de datos/auth.
2. Elegir pasarela de pagos y crear la cuenta (Wompi o MercadoPago) — se puede tramitar en paralelo.
3. Lista de 20 proveedores candidatos (nombre, región, contacto, tipo, ¿tiene INVIMA?, ¿tiene IG?).
4. Redactar el pitch de una página para proveedores + borrador de contrato marco.
5. Averiguar fechas/costos de Cafés de Colombia Expo y ferias regionales del semestre.
6. Añadir al roadmap del producto: routing por café/finca y cupones (soportan el marketing de Fase 2).
