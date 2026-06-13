import { GRADIENTS, FARM_STORIES, SHIPPING_METHODS, PAYMENT_METHODS, SUBSCRIPTION_PLANS } from "./data";

// Claves de localStorage
export const STORAGE = {
  seller: "paqarina_seller",
  coffees: "paqarina_seller_coffees",
  orders: "paqarina_orders",
  cart: "paqarina_cart",
  favorites: "paqarina_favorites",
  customer: "paqarina_customer",
  reviews: "paqarina_reviews",
  subscription: "paqarina_subscription",
};

export const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

// Formato monetario y fechas
export const fmt = (n) => "$" + (Number(n) || 0).toLocaleString("es-CO");
export const fmtDate = (iso) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CO", { day:"numeric", month:"short", year:"numeric" });
};

// Lookups
export const findShipping = (id) => SHIPPING_METHODS.find(s => s.id === id) || SHIPPING_METHODS[0];
export const findPayment = (id) => PAYMENT_METHODS.find(p => p.id === id) || PAYMENT_METHODS[0];
export const findPlan = (id) => SUBSCRIPTION_PLANS.find(p => p.id === id);

// Filtros
export function filtersAreDefault(f) {
  return !f.priceMin && !f.priceMax && !f.scoreMin && f.roasts.length === 0 && !f.onlyMicro && !f.onlyFairtrade;
}

// Historia mostrada en el detalle del café (prioriza vendedor → curador → mapa estático)
export function storyFor(coffee, seller) {
  if (coffee.bySeller && seller?.story) return seller.story.trim();
  if (coffee.isCurator && coffee.bio) return coffee.bio;
  return FARM_STORIES[coffee.farm] || "Cultivamos café de especialidad con dedicación y trazabilidad de origen.";
}

// Carrito: una línea por combinación id + molienda
export const cartKey = (i) => i.id + "::" + (i.grind || "");

// Agrega un item respetando el stock total del café (sumando todas sus moliendas).
// Retorna el nuevo carrito y cuántas unidades se agregaron realmente.
export function addItemToCart(cart, item) {
  const requested = item.qty || 1;
  const stock = item.stock ?? Infinity;
  const alreadyInCart = cart.filter(i => i.id === item.id).reduce((s, i) => s + (i.qty || 1), 0);
  const added = Math.min(requested, Math.max(0, stock - alreadyInCart));
  if (added <= 0) return { cart, added: 0 };
  const k = cartKey(item);
  const exists = cart.some(i => cartKey(i) === k);
  const next = exists
    ? cart.map(i => cartKey(i) === k ? { ...i, qty: (i.qty || 1) + added } : i)
    : [...cart, { ...item, qty: added }];
  return { cart: next, added };
}

// Cambia la cantidad de una línea, acotada entre 1 y el stock disponible
// (descontando lo que ya ocupa el mismo café en otras moliendas).
export function setCartQty(cart, idx, qty) {
  return cart.map((it, i) => {
    if (i !== idx) return it;
    const stock = it.stock ?? Infinity;
    const inOtherLines = cart.reduce((s, x, j) => (j !== idx && x.id === it.id) ? s + (x.qty || 1) : s, 0);
    const max = Math.max(1, stock - inOtherLines);
    return { ...it, qty: Math.min(Math.max(1, qty), max) };
  });
}

// Descuenta del stock las unidades vendidas (sumando todas las moliendas de cada café)
export function decrementStock(coffees, items) {
  return coffees.map(c => {
    const sold = items.filter(i => i.id === c.id).reduce((s, i) => s + (i.qty || 1), 0);
    return sold > 0 ? { ...c, stock: Math.max(0, (c.stock || 0) - sold) } : c;
  });
}

// Redimensiona imagen a JPEG base64 (cabe en localStorage)
export function fileToDataURL(file, maxWidth = 600, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Semillas para el panel del vendedor recién registrado
export function makeStarterCoffees(seller) {
  const base = {
    farm: seller.fincaName, farmer: seller.farmerName, region: seller.region,
    altitude: seller.altitude || "1.800 msnm",
    bySeller: true, sellerId: seller.id, fairtrade: true,
    isCurator: seller.role === "curador", verified: false, draft: false,
  };
  return [
    { ...base, id:"s_demo_1", name:"Mi Primer Lote", variety:"Caturra", process:"Lavado", roast:"Medio", price:72000, weight:"340g", notes:["Panela","Chocolate","Cítricos"], score:86, micro:false, fresh:"Tueste a pedido", tag:"Novedad", img:GRADIENTS[1].img, bean:GRADIENTS[1].bean, stock:20 },
    { ...base, id:"s_demo_2", name:"Reserva de la Casa", variety:"Bourbon", process:"Honey", roast:"Claro-medio", price:98000, weight:"250g", notes:["Durazno","Caramelo","Floral"], score:89, micro:true, fresh:"Tueste a pedido", tag:"Microlote", img:GRADIENTS[4].img, bean:GRADIENTS[4].bean, stock:12 },
  ];
}

export function makeDemoOrders(coffees) {
  const now = Date.now(), day = 86400000;
  const it = (c, qty) => ({ id:c.id, name:c.name, farm:c.farm, price:c.price, qty, bySeller:true, sellerId:c.sellerId });
  const mk = (id, offset, items, status, name, city) => {
    const subtotal = items.reduce((s,x) => s + x.price*x.qty, 0);
    return { id, date:new Date(now - offset).toISOString(), customer:{ name, city }, items, subtotal, shipping:12000, total:subtotal+12000, status };
  };
  const stamp = Date.now();
  return [
    mk(`o_demo_${stamp}_1`, 1*day, [it(coffees[0],2)], "Preparando", "Laura Gómez", "Medellín"),
    mk(`o_demo_${stamp}_2`, 4*day, [it(coffees[1],1), it(coffees[0],1)], "Entregado", "Carlos Ruiz", "Cali"),
  ];
}
