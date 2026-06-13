import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SubscriptionStatus, SubscriptionPanel, BuyerOrderCard } from "./buyer";
import type { Order } from "../types";

describe("SubscriptionStatus", () => {
  it("sin suscripción muestra el CTA de planes", () => {
    const onSubscribe = vi.fn();
    render(<SubscriptionStatus subscription={null} onSubscribe={onSubscribe} onCancel={vi.fn()}/>);
    fireEvent.click(screen.getByText("VER PLANES"));
    expect(onSubscribe).toHaveBeenCalled();
  });

  it("con suscripción muestra plan, precio y permite cancelar", () => {
    const onCancel = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<SubscriptionStatus subscription={{ planId: "explorar", startDate: new Date().toISOString() }} onSubscribe={vi.fn()} onCancel={onCancel}/>);
    expect(screen.getByText("Plan Explorar")).toBeInTheDocument();
    expect(screen.getByText("$119.000/mes")).toBeInTheDocument();
    fireEvent.click(screen.getByText("CANCELAR SUSCRIPCIÓN"));
    expect(onCancel).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("no cancela si el usuario no confirma", () => {
    const onCancel = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<SubscriptionStatus subscription={{ planId: "explorar", startDate: new Date().toISOString() }} onSubscribe={vi.fn()} onCancel={onCancel}/>);
    fireEvent.click(screen.getByText("CANCELAR SUSCRIPCIÓN"));
    expect(onCancel).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});

describe("SubscriptionPanel", () => {
  it("activa el plan seleccionado", () => {
    const onSubscribe = vi.fn();
    render(<SubscriptionPanel onSubscribe={onSubscribe} onClose={vi.fn()}/>);
    fireEvent.click(screen.getByText("Plan Conocedor"));
    fireEvent.click(screen.getByText("ACTIVAR SUSCRIPCIÓN"));
    expect(onSubscribe).toHaveBeenCalledWith("conocedor");
  });

  it("cierra con el botón de cerrar", () => {
    const onClose = vi.fn();
    render(<SubscriptionPanel onSubscribe={vi.fn()} onClose={onClose}/>);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar planes" }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("BuyerOrderCard", () => {
  const order: Order = {
    id: "o_777999", date: "2026-06-01T10:00:00.000Z",
    customer: { name: "Ana Prueba", address: "Cra 7 # 12-34", city: "Bogotá" },
    items: [
      { id: "c1", name: "Geisha", farm: "F", price: 100000, qty: 1, grind: "V60" },
      { id: "c2", name: "Caturra", farm: "F", price: 50000, qty: 2 },
    ],
    subtotal: 200000, shipping: 12000, total: 212000, status: "Enviado",
    shippingMethod: "express", paymentMethod: "nequi",
  };

  it("muestra items, unidades, envío, pago y total", () => {
    render(<BuyerOrderCard order={order}/>);
    expect(screen.getByText("3 cafés")).toBeInTheDocument();
    expect(screen.getByText("1 × Geisha · V60")).toBeInTheDocument();
    expect(screen.getByText("Envío express")).toBeInTheDocument();
    expect(screen.getByText("Nequi / Daviplata")).toBeInTheDocument();
    expect(screen.getByText("$212.000")).toBeInTheDocument();
    expect(screen.getByText("Enviado")).toBeInTheDocument();
  });

  it("muestra la dirección de entrega", () => {
    render(<BuyerOrderCard order={order}/>);
    expect(screen.getByText("Cra 7 # 12-34, Bogotá")).toBeInTheDocument();
  });
});
