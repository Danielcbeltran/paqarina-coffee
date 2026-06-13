import { describe, it, expect } from "vitest";
import {
  fmt,
  fmtDate,
  filtersAreDefault,
  findShipping,
  findPayment,
  findPlan,
  storyFor,
  makeStarterCoffees,
  cartKey,
  addItemToCart,
  setCartQty,
  decrementStock,
} from "./lib";
import { DEFAULT_FILTERS } from "./data";

describe("fmt (formato COP)", () => {
  it("formatea un valor entero", () => {
    expect(fmt(72000)).toBe("$72.000");
  });
  it("formatea cero", () => {
    expect(fmt(0)).toBe("$0");
  });
  it("formatea miles separados", () => {
    expect(fmt(1500000)).toBe("$1.500.000");
  });
  it("trata null/NaN como 0", () => {
    expect(fmt(NaN as any)).toBe("$0");
    expect(fmt(null as any)).toBe("$0");
    expect(fmt(undefined as any)).toBe("$0");
  });
});

describe("fmtDate", () => {
  it("formatea una ISO date a es-CO", () => {
    const out = fmtDate("2026-05-29T12:00:00.000Z");
    // Esperamos contener el día, mes corto y año
    expect(out).toMatch(/29/);
    expect(out).toMatch(/2026/);
  });
  it("devuelve '' para input inválido", () => {
    expect(fmtDate("no es una fecha")).toBe("");
  });
});

describe("filtersAreDefault", () => {
  it("retorna true para los filtros default", () => {
    expect(filtersAreDefault(DEFAULT_FILTERS)).toBe(true);
  });
  it("retorna false cuando hay precio mínimo", () => {
    expect(filtersAreDefault({ ...DEFAULT_FILTERS, priceMin: 50000 })).toBe(false);
  });
  it("retorna false cuando hay precio máximo", () => {
    expect(filtersAreDefault({ ...DEFAULT_FILTERS, priceMax: 100000 })).toBe(false);
  });
  it("retorna false cuando hay tueste seleccionado", () => {
    expect(filtersAreDefault({ ...DEFAULT_FILTERS, roasts: ["Medio"] })).toBe(false);
  });
  it("retorna false con onlyMicro activo", () => {
    expect(filtersAreDefault({ ...DEFAULT_FILTERS, onlyMicro: true })).toBe(false);
  });
  it("retorna false con onlyFairtrade activo", () => {
    expect(filtersAreDefault({ ...DEFAULT_FILTERS, onlyFairtrade: true })).toBe(false);
  });
});

describe("findShipping", () => {
  it("encuentra el método express", () => {
    expect(findShipping("express").price).toBe(18000);
  });
  it("encuentra el método pickup (gratis)", () => {
    expect(findShipping("pickup").price).toBe(0);
  });
  it("cae a 'standard' para id desconocido", () => {
    expect(findShipping("inexistente").id).toBe("standard");
  });
});

describe("findPayment", () => {
  it("encuentra el método nequi", () => {
    expect(findPayment("nequi").label).toContain("Nequi");
  });
  it("cae a 'card' para id desconocido", () => {
    expect(findPayment("inexistente").id).toBe("card");
  });
});

describe("findPlan", () => {
  it("encuentra el plan explorar", () => {
    expect(findPlan("explorar")?.price).toBe(119000);
  });
  it("retorna undefined para id desconocido", () => {
    expect(findPlan("inexistente")).toBeUndefined();
  });
});

describe("storyFor", () => {
  it("usa la historia del vendedor si el café es suyo", () => {
    const coffee = { bySeller: true, farm: "Mi Finca" };
    const seller = { story: "Mi historia personal" };
    expect(storyFor(coffee as any, seller as any)).toBe("Mi historia personal");
  });
  it("usa el bio del curador para cafés de marca", () => {
    const coffee = { isCurator: true, bio: "Curaduría única", farm: "Tinto Lab" };
    expect(storyFor(coffee as any, null as any)).toBe("Curaduría única");
  });
  it("cae a FARM_STORIES para fincas conocidas", () => {
    const coffee = { farm: "Finca El Paraíso" };
    expect(storyFor(coffee as any, null as any)).toContain("Andes del Cauca");
  });
  it("cae a una historia genérica para fincas desconocidas", () => {
    const coffee = { farm: "Finca Inventada" };
    expect(storyFor(coffee as any, null as any)).toContain("especialidad");
  });
});

describe("cartKey", () => {
  it("distingue el mismo café con moliendas distintas", () => {
    expect(cartKey({ id: "c01", grind: "V60" })).not.toBe(cartKey({ id: "c01", grind: "Espresso" }));
  });
  it("trata sin molienda y grano entero como claves distintas", () => {
    expect(cartKey({ id: "c01" })).toBe("c01::");
  });
});

describe("addItemToCart", () => {
  const coffee = { id: "c01", name: "Geisha", price: 100, stock: 5 };
  it("agrega un item nuevo con qty 1 por defecto", () => {
    const { cart, added } = addItemToCart([], coffee as any);
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(1);
    expect(added).toBe(1);
  });
  it("respeta la cantidad pedida", () => {
    const { cart, added } = addItemToCart([], { ...coffee, qty: 3 } as any);
    expect(cart[0].qty).toBe(3);
    expect(added).toBe(3);
  });
  it("acumula sobre la misma línea (mismo id y molienda)", () => {
    const first = addItemToCart([], { ...coffee, grind: "V60" } as any).cart;
    const { cart } = addItemToCart(first, { ...coffee, grind: "V60" } as any);
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(2);
  });
  it("crea otra línea para una molienda distinta", () => {
    const first = addItemToCart([], { ...coffee, grind: "V60" } as any).cart;
    const { cart } = addItemToCart(first, { ...coffee, grind: "Espresso" } as any);
    expect(cart).toHaveLength(2);
  });
  it("no agrega más que el stock disponible", () => {
    const { cart, added } = addItemToCart([], { ...coffee, qty: 9 } as any);
    expect(cart[0].qty).toBe(5);
    expect(added).toBe(5);
  });
  it("cuenta el stock entre moliendas del mismo café", () => {
    const first = addItemToCart([], { ...coffee, qty: 4, grind: "V60" } as any).cart;
    const { cart, added } = addItemToCart(first, { ...coffee, qty: 3, grind: "Espresso" } as any);
    expect(added).toBe(1);
    expect(cart[1].qty).toBe(1);
  });
  it("retorna added 0 si el café está agotado", () => {
    const { cart, added } = addItemToCart([], { ...coffee, stock: 0 } as any);
    expect(cart).toHaveLength(0);
    expect(added).toBe(0);
  });
});

describe("setCartQty", () => {
  it("actualiza la cantidad de la línea indicada", () => {
    const cart = [{ id: "c01", qty: 1, stock: 10 }];
    expect(setCartQty(cart as any, 0, 4)[0].qty).toBe(4);
  });
  it("no baja de 1", () => {
    const cart = [{ id: "c01", qty: 2, stock: 10 }];
    expect(setCartQty(cart as any, 0, 0)[0].qty).toBe(1);
  });
  it("no supera el stock", () => {
    const cart = [{ id: "c01", qty: 2, stock: 5 }];
    expect(setCartQty(cart as any, 0, 99)[0].qty).toBe(5);
  });
  it("descuenta lo ocupado por otras moliendas del mismo café", () => {
    const cart = [
      { id: "c01", grind: "V60", qty: 3, stock: 5 },
      { id: "c01", grind: "Espresso", qty: 1, stock: 5 },
    ];
    expect(setCartQty(cart as any, 1, 99)[1].qty).toBe(2);
  });
});

describe("decrementStock", () => {
  it("descuenta las unidades vendidas", () => {
    const coffees = [{ id: "s_1", stock: 10 }, { id: "s_2", stock: 5 }];
    const items = [{ id: "s_1", qty: 3 }];
    const out = decrementStock(coffees as any, items as any);
    expect(out[0].stock).toBe(7);
    expect(out[1].stock).toBe(5);
  });
  it("suma todas las moliendas del mismo café", () => {
    const coffees = [{ id: "s_1", stock: 10 }];
    const items = [{ id: "s_1", qty: 2, grind: "V60" }, { id: "s_1", qty: 3, grind: "Espresso" }];
    expect(decrementStock(coffees as any, items as any)[0].stock).toBe(5);
  });
  it("nunca deja stock negativo", () => {
    const coffees = [{ id: "s_1", stock: 2 }];
    const items = [{ id: "s_1", qty: 9 }];
    expect(decrementStock(coffees as any, items as any)[0].stock).toBe(0);
  });
});

describe("makeStarterCoffees", () => {
  it("genera 2 cafés semilla para un productor", () => {
    const seller = { id:"s1", role:"productor", fincaName:"X", farmerName:"Y", region:"Z" };
    const starters = makeStarterCoffees(seller as any);
    expect(starters).toHaveLength(2);
    expect(starters[0].farm).toBe("X");
    expect(starters[0].farmer).toBe("Y");
    expect(starters[0].bySeller).toBe(true);
    expect(starters[0].isCurator).toBe(false);
    expect(starters[0].draft).toBe(false);
    expect(starters[0].stock).toBeGreaterThan(0);
  });
  it("marca los cafés como isCurator si el rol es curador", () => {
    const seller = { id:"s2", role:"curador", fincaName:"Marca", farmerName:"Curador", region:"Bogotá" };
    const starters = makeStarterCoffees(seller as any);
    expect(starters.every(c => c.isCurator === true)).toBe(true);
  });
});
