// Datos estáticos y constantes del marketplace.
// Los tokens visuales del tema viven en src/index.css (@theme).

export const COFFEES = [
  { id:"c01", name:"Geisha Lavada", farm:"Finca El Paraíso", farmer:"Diego Bermúdez", region:"Cauca, Piendamó", altitude:"1.930 msnm", process:"Lavado bioreactor", variety:"Geisha", notes:["Jazmín","Lichi","Bergamota"], score:92.5, price:168000, weight:"250g", roast:"Claro", micro:true, fairtrade:true, fresh:"Tueste a pedido", tag:"Microlote", img:"linear-gradient(135deg,#C8956A 0%,#8B5E3C 50%,#3D2817 100%)", bean:"#3D2817" },
  { id:"c02", name:"Caturra Honey", farm:"Finca Tamana", farmer:"María del Pilar", region:"Huila, Pitalito", altitude:"1.750 msnm", process:"Honey amarillo", variety:"Caturra", notes:["Panela","Durazno","Almendra"], score:88, price:78000, weight:"340g", roast:"Medio", fairtrade:true, fresh:"Tostado hace 3 días", tag:"Comercio Justo", img:"linear-gradient(135deg,#E8C28C 0%,#B8854A 50%,#5C3A1E 100%)", bean:"#5C3A1E" },
  { id:"c03", name:"Sidra Natural", farm:"La Palma & El Tucán", farmer:"Cooperativa Cundinamarca", region:"Cundinamarca, Zipacón", altitude:"1.850 msnm", process:"Natural anaeróbico", variety:"Sidra", notes:["Frambuesa","Cacao","Vino tinto"], score:91, price:142000, weight:"250g", roast:"Claro-medio", micro:true, fresh:"Tueste a pedido", tag:"Edición Limitada", img:"linear-gradient(135deg,#B85450 0%,#6B2D2A 50%,#2A1010 100%)", bean:"#2A1010" },
  { id:"c04", name:"Bourbon Rosado", farm:"Hacienda Venecia", farmer:"Familia Vélez", region:"Caldas, Manizales", altitude:"1.500 msnm", process:"Lavado tradicional", variety:"Bourbon Rosado", notes:["Caramelo","Manzana roja","Nuez"], score:86, price:64000, weight:"500g", roast:"Medio", fairtrade:true, fresh:"Tostado hace 5 días", tag:"Más vendido", img:"linear-gradient(135deg,#D9A879 0%,#9A6B43 50%,#4A2D1A 100%)", bean:"#4A2D1A" },
  { id:"c05", name:"Tabi Anaeróbico", farm:"Finca Las Margaritas", farmer:"Andrés Salazar", region:"Tolima, Planadas", altitude:"1.880 msnm", process:"Anaeróbico extendido", variety:"Tabi", notes:["Mango","Maracuyá","Miel"], score:90, price:124000, weight:"250g", roast:"Claro", micro:true, fresh:"Tueste a pedido", tag:"Exótico", img:"linear-gradient(135deg,#E8B45C 0%,#A8722E 50%,#4A2E10 100%)", bean:"#4A2E10" },
  { id:"c06", name:"Castillo Tradición", farm:"Asoc. Mujeres Cafeteras", farmer:"Asomucafé", region:"Nariño, La Unión", altitude:"2.100 msnm", process:"Lavado", variety:"Castillo", notes:["Chocolate","Naranja","Caña"], score:87, price:58000, weight:"500g", roast:"Medio-oscuro", fairtrade:true, fresh:"Tostado hace 2 días", tag:"Impacto Social", img:"linear-gradient(135deg,#A87454 0%,#6B4028 50%,#2E1810 100%)", bean:"#2E1810" },
];

export const STORIES = [
  { id:"s1", name:"Diego", farm:"El Paraíso", img:"linear-gradient(135deg,#8B5E3C,#3D2817)" },
  { id:"s2", name:"María", farm:"Tamana", img:"linear-gradient(135deg,#B8854A,#5C3A1E)" },
  { id:"s3", name:"Andrés", farm:"Las Margaritas", img:"linear-gradient(135deg,#A8722E,#4A2E10)" },
  { id:"s4", name:"Asomucafé", farm:"Nariño", img:"linear-gradient(135deg,#6B4028,#2E1810)" },
  { id:"s5", name:"Familia Vélez", farm:"Venecia", img:"linear-gradient(135deg,#9A6B43,#4A2D1A)" },
];

export const CATEGORIES = ["Todos","Favoritos","Microlotes","Comercio justo","Tueste a pedido","Mujeres caficultoras","Anaeróbicos"];
export const ORDER_STATUSES = ["Nuevo","Preparando","Enviado","Entregado"];
export const ROASTS = ["Claro","Claro-medio","Medio","Medio-oscuro","Oscuro"];
export const FRESH_OPTS = ["Tueste a pedido","Tostado hace 2 días","Tostado hace 3 días","Tostado hace 5 días","Tostado hace 1 semana"];
export const TAGS = ["Microlote","Comercio Justo","Edición Limitada","Más vendido","Exótico","Impacto Social","Novedad"];
export const CERTS = ["Comercio Justo","Orgánico","Mujeres Caficultoras","Microlote","Bird Friendly"];
export const CURATOR_TAGS = ["Q-Grader","Catador SCA","Tueste artesanal","Especialidad","Microlotes","Origen único"];
export const PROCESSES = ["Lavado","Honey","Natural","Anaeróbico extendido","Lavado bioreactor"];

export const GRADIENTS = [
  { label:"Cacao", img:"linear-gradient(135deg,#A87454 0%,#6B4028 50%,#2E1810 100%)", bean:"#2E1810" },
  { label:"Caramelo", img:"linear-gradient(135deg,#D9A879 0%,#9A6B43 50%,#4A2D1A 100%)", bean:"#4A2D1A" },
  { label:"Tierra", img:"linear-gradient(135deg,#C8956A 0%,#8B5E3C 50%,#3D2817 100%)", bean:"#3D2817" },
  { label:"Rubí", img:"linear-gradient(135deg,#B85450 0%,#6B2D2A 50%,#2A1010 100%)", bean:"#2A1010" },
  { label:"Miel", img:"linear-gradient(135deg,#E8C28C 0%,#B8854A 50%,#5C3A1E 100%)", bean:"#5C3A1E" },
  { label:"Ámbar", img:"linear-gradient(135deg,#E8B45C 0%,#A8722E 50%,#4A2E10 100%)", bean:"#4A2E10" },
];

// Marcas curadoras de ejemplo (venden su propia marca con todas las características del café)
export const CURATOR_COFFEES = [
  { id:"k01", brand:"Tinto Lab", curator:"Valentina Ríos", city:"Bogotá", credential:"Q-Grader",
    bio:"Laboratorio de tueste enfocado en perfiles limpios y trazables, seleccionando microlotes de toda Colombia.", isCurator:true,
    name:"Blend Cordillera", variety:"Caturra · Castillo", region:"Multiorigen, Colombia", altitude:"1.600–1.900 msnm",
    process:"Lavado", roast:"Medio", notes:["Chocolate","Naranja","Caramelo"], score:87, price:69000, weight:"340g",
    fresh:"Tostado hace 4 días", tag:"Marca Tostada", fairtrade:true, img:GRADIENTS[0].img, bean:GRADIENTS[0].bean },
  { id:"k02", brand:"Tinto Lab", curator:"Valentina Ríos", city:"Bogotá", credential:"Q-Grader",
    bio:"Laboratorio de tueste enfocado en perfiles limpios y trazables, seleccionando microlotes de toda Colombia.", isCurator:true,
    name:"Serie Geisha", variety:"Geisha", region:"Cauca, Colombia", altitude:"1.900 msnm",
    process:"Lavado", roast:"Claro", notes:["Jazmín","Durazno","Té negro"], score:91, price:155000, weight:"250g",
    fresh:"Tueste a pedido", tag:"Edición Tostada", micro:true, img:GRADIENTS[2].img, bean:GRADIENTS[2].bean },
  { id:"k03", brand:"Altura Roasters", curator:"Mateo Quintero", city:"Medellín", credential:"Catador SCA",
    bio:"Tostadores de autor que rescatan variedades tradicionales con perfiles intensos y golosos.", isCurator:true,
    name:"Espresso de Autor", variety:"Bourbon", region:"Antioquia, Colombia", altitude:"1.700 msnm",
    process:"Natural", roast:"Medio-oscuro", notes:["Cacao","Panela","Cereza"], score:86, price:74000, weight:"500g",
    fresh:"Tostado hace 2 días", tag:"Marca Tostada", fairtrade:true, img:GRADIENTS[3].img, bean:GRADIENTS[3].bean },
];
CURATOR_COFFEES.forEach(c => { c.farm = c.brand; c.farmer = c.curator; });

export const FARM_STORIES = {
  "Finca El Paraíso": "Tres generaciones cultivando café en los Andes del Cauca. Cada cereza la recogemos a mano en el punto exacto de maduración, y el bioreactor controla la fermentación al grado.",
  "Finca Tamana": "En Pitalito, donde el sol matutino baña los cafetos, María del Pilar lidera una operación familiar con foco en perfiles dulces y trazables.",
  "La Palma & El Tucán": "Laboratorio de fermentación en Cundinamarca. Cada lote es un experimento controlado de bioreactor y proceso anaeróbico que rescata aromas únicos.",
  "Hacienda Venecia": "Más de un siglo de tradición cafetera en Manizales. Combinamos métodos ancestrales con investigación moderna en variedades resistentes.",
  "Finca Las Margaritas": "Andrés Salazar rescata variedades exóticas en la cordillera del Tolima, con tueste a pedido y procesos vanguardistas que sorprenden en taza.",
  "Asoc. Mujeres Cafeteras": "Asociación de 84 mujeres caficultoras de Nariño cultivando a más de 2.000 msnm con prácticas sostenibles y certificación de comercio justo.",
};

export const VERIFIED_NAMES = new Set(["Finca El Paraíso","Finca Tamana","Finca Las Margaritas","Asoc. Mujeres Cafeteras","Tinto Lab","Altura Roasters"]);
export const STOCK_BY_ID = { c01:8, c02:32, c03:6, c04:48, c05:14, c06:60, k01:38, k02:9, k03:42 };

// Mutación: agregar stock y verified a cada café estático.
[...COFFEES, ...CURATOR_COFFEES].forEach(c => {
  c.stock = STOCK_BY_ID[c.id] ?? 24;
  c.verified = VERIFIED_NAMES.has(c.farm);
});

export const SUBSCRIPTION_PLANS = [
  { id:"descubrir", name:"Descubrir", desc:"250g de un microlote distinto cada mes", weight:"250g", price:69000 },
  { id:"explorar", name:"Explorar", desc:"500g + ficha de cata mensual", weight:"500g", price:119000 },
  { id:"conocedor", name:"Conocedor", desc:"3 × 250g de orígenes únicos", weight:"3 × 250g", price:189000 },
];

export const SHIPPING_METHODS = [
  { id:"standard", label:"Envío estándar", desc:"3-5 días hábiles", price:12000 },
  { id:"express", label:"Envío express", desc:"24-48 horas", price:18000 },
  { id:"pickup", label:"Recoger en tienda", desc:"Sin costo · Bogotá", price:0 },
];

export const PAYMENT_METHODS = [
  { id:"card", label:"Tarjeta de crédito" },
  { id:"nequi", label:"Nequi / Daviplata" },
  { id:"transfer", label:"Transferencia bancaria (PSE)" },
  { id:"cod", label:"Contra entrega" },
];

export const COMMISSION_RATE = 0.10;
export const DEFAULT_FILTERS = { priceMin: 0, priceMax: 0, scoreMin: 0, roasts: [], onlyMicro: false, onlyFairtrade: false };

export const ROLE_INFO = {
  productor: {
    badge:"MODO PRODUCTOR", title:"Conviértete en productor",
    desc:"Registra tu finca para publicar el café que cultivas, recibir pedidos y compartir tu historia.",
    nameLabel:"Nombre de la finca *", namePh:"Finca La Esperanza",
    ownerLabel:"Caficultor / responsable *", ownerPh:"Tu nombre",
    placeLabel:"Región *", placePh:"Huila, Pitalito",
    extraLabel:"Altitud", extraPh:"1.800 msnm",
    storyLabel:"Historia de la finca", storyPh:"Cuenta tu historia, tradición y proceso...",
    tagsLabel:"Certificaciones", tagsOptions:CERTS, cta:"REGISTRAR MI FINCA",
  },
  curador: {
    badge:"MODO TOSTADOR", title:"Conviértete en tostador",
    desc:"Registra tu marca para vender tu propio café tostado, mostrando todas sus características, y llegar a más compradores.",
    nameLabel:"Nombre de tu marca *", namePh:"Tinto Lab",
    ownerLabel:"Tostador / responsable *", ownerPh:"Tu nombre",
    placeLabel:"Ciudad *", placePh:"Bogotá",
    extraLabel:"Credencial", extraPh:"Q-Grader, Catador SCA...",
    storyLabel:"Sobre tu marca", storyPh:"Cuenta tu filosofía de tueste y selección...",
    tagsLabel:"Especialidades", tagsOptions:CURATOR_TAGS, cta:"REGISTRAR MI MARCA",
  },
};
