import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SellerOnboarding, ProfileScreen, OrderCard } from "./seller";
import type { Coffee, Order, Seller } from "../types";

const seller: Seller = {
  id: "seller_local", role: "productor", fincaName: "Finca Demo", farmerName: "Demo Tester",
  region: "Cauca", altitude: "1.900 msnm", joined: new Date().toISOString(),
};

const sellerCoffee: Coffee = {
  id: "s_1", name: "Lote Uno", farm: "Finca Demo", farmer: "Demo Tester", region: "Cauca",
  process: "Lavado", variety: "Caturra", notes: ["Panela"], score: 86, price: 70000,
  weight: "340g", roast: "Medio", fresh: "Tueste a pedido", tag: "Novedad",
  img: "linear-gradient(#000,#fff)", bean: "#3D2817", stock: 20, bySeller: true, sellerId: "seller_local",
};

const sellerOrder: Order = {
  id: "o_demo_1", date: new Date().toISOString(), customer: { name: "Laura Gómez", city: "Medellín" },
  items: [{ id: "s_1", name: "Lote Uno", farm: "Finca Demo", price: 70000, qty: 2, bySeller: true, sellerId: "seller_local" }],
  subtotal: 140000, shipping: 12000, total: 152000, status: "Preparando",
};

describe("SellerOnboarding", () => {
  it("deshabilita el CTA hasta llenar los campos obligatorios", () => {
    render(<SellerOnboarding onRegister={vi.fn()}/>);
    const cta = screen.getByText("REGISTRAR MI FINCA");
    expect(cta).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText("Finca La Esperanza"), { target: { value: "Mi Finca" } });
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "Yo" } });
    fireEvent.change(screen.getByPlaceholderText("Huila, Pitalito"), { target: { value: "Huila" } });
    expect(cta).toBeEnabled();
  });

  it("cambia los textos al elegir el rol Tostador", () => {
    render(<SellerOnboarding onRegister={vi.fn()}/>);
    fireEvent.click(screen.getByText("Tostador"));
    expect(screen.getByText("REGISTRAR MI MARCA")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tinto Lab")).toBeInTheDocument();
  });

  it("registra con el rol elegido", () => {
    const onRegister = vi.fn();
    render(<SellerOnboarding onRegister={onRegister}/>);
    fireEvent.click(screen.getByText("Tostador"));
    fireEvent.change(screen.getByPlaceholderText("Tinto Lab"), { target: { value: "Mi Marca" } });
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "Yo" } });
    fireEvent.change(screen.getByPlaceholderText("Bogotá"), { target: { value: "Cali" } });
    fireEvent.click(screen.getByText("REGISTRAR MI MARCA"));
    expect(onRegister).toHaveBeenCalledWith(expect.objectContaining({ role: "curador", fincaName: "Mi Marca" }));
  });
});

describe("OrderCard", () => {
  it("muestra subtotal, comisión del 10% y ganancia neta", () => {
    render(<OrderCard order={sellerOrder} onAdvance={vi.fn()}/>);
    expect(screen.getAllByText("$140.000").length).toBe(2); // línea del item + subtotal
    expect(screen.getByText("−$14.000")).toBeInTheDocument();
    expect(screen.getByText("$126.000")).toBeInTheDocument();
  });

  it("avanza el pedido al siguiente estado", () => {
    const onAdvance = vi.fn();
    render(<OrderCard order={sellerOrder} onAdvance={onAdvance}/>);
    fireEvent.click(screen.getByText("MARCAR COMO ENVIADO"));
    expect(onAdvance).toHaveBeenCalledWith("o_demo_1");
  });

  it("no muestra botón de avance en pedidos entregados", () => {
    render(<OrderCard order={{ ...sellerOrder, status: "Entregado" }} onAdvance={vi.fn()}/>);
    expect(screen.queryByText(/MARCAR COMO/)).not.toBeInTheDocument();
  });
});

describe("ProfileScreen", () => {
  const noop = {
    onSubscribeOpen: vi.fn(), onUnsubscribe: vi.fn(), onRegister: vi.fn(), onNewCoffee: vi.fn(),
    onEditCoffee: vi.fn(), onDeleteCoffee: vi.fn(), onAdvanceOrder: vi.fn(), onUpdateSeller: vi.fn(),
    onOpenFarm: vi.fn(), onReset: vi.fn(), onRequestVerification: vi.fn(),
  };

  it("sin vendedor muestra el perfil de comprador con CTA de onboarding", () => {
    render(<ProfileScreen seller={null} coffees={[]} orders={[]} customer={null} subscription={null} {...noop}/>);
    expect(screen.getByText("Únete como productor o tostador")).toBeInTheDocument();
    fireEvent.click(screen.getByText("CONVERTIRME EN VENDEDOR"));
    expect(screen.getByText("Conviértete en productor")).toBeInTheDocument();
  });

  it("con vendedor muestra el panel con sus cafés y stock", () => {
    render(<ProfileScreen seller={seller} coffees={[sellerCoffee]} orders={[]} customer={null} subscription={null} {...noop}/>);
    expect(screen.getByText("PANEL DE PRODUCTOR")).toBeInTheDocument();
    expect(screen.getByText("Finca Demo")).toBeInTheDocument();
    expect(screen.getByText("Lote Uno")).toBeInTheDocument();
    expect(screen.getByText("20 en stock")).toBeInTheDocument();
  });

  it("la pestaña Pedidos muestra el resumen de ventas", () => {
    render(<ProfileScreen seller={seller} coffees={[sellerCoffee]} orders={[sellerOrder]} customer={null} subscription={null} {...noop}/>);
    fireEvent.click(screen.getByText("Pedidos"));
    expect(screen.getByText("Ingresos brutos")).toBeInTheDocument();
    expect(screen.getByText("Laura Gómez")).toBeInTheDocument();
  });

  it("permite cambiar al modo Comprador", () => {
    render(<ProfileScreen seller={seller} coffees={[]} orders={[]} customer={{ name: "Ana Prueba" }} subscription={null} {...noop}/>);
    fireEvent.click(screen.getByText("Comprador"));
    expect(screen.getByText("Hola, Ana")).toBeInTheDocument();
    expect(screen.getByText("IR A MI PANEL DE VENDEDOR →")).toBeInTheDocument();
  });
});
