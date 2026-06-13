import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartView } from "./cart";
import type { CartItem, Order } from "../types";

const item: CartItem = {
  id: "c_test", name: "Geisha de Prueba", farm: "Finca Test", farmer: "Tester",
  region: "Huila", process: "Lavado", variety: "Geisha", notes: [], score: 90,
  price: 50000, weight: "250g", roast: "Claro", fresh: "Tueste a pedido", tag: "Microlote",
  img: "linear-gradient(#000,#fff)", bean: "#3D2817", stock: 10, qty: 2, grind: "V60",
};

const fakeOrder: Order = {
  id: "o_123456", date: new Date().toISOString(), customer: { name: "Ana Prueba" },
  items: [], subtotal: 100000, shipping: 12000, total: 112000, status: "Nuevo",
};

const setup = (items: CartItem[] = [item]) => {
  const onClose = vi.fn(), onRemove = vi.fn(), onUpdateQty = vi.fn(), onExplore = vi.fn();
  const onCheckout = vi.fn(() => fakeOrder);
  render(<CartView items={items} onClose={onClose} onRemove={onRemove} onUpdateQty={onUpdateQty}
    onCheckout={onCheckout} onExplore={onExplore} savedCustomer={null}/>);
  return { onClose, onRemove, onUpdateQty, onCheckout, onExplore };
};

const fillContact = () => {
  fireEvent.change(screen.getByPlaceholderText("Juan Pérez"), { target: { value: "Ana Prueba" } });
  fireEvent.change(screen.getByPlaceholderText("tu@email.com"), { target: { value: "ana@test.com" } });
  fireEvent.change(screen.getByPlaceholderText("3001234567"), { target: { value: "3009998877" } });
};

describe("CartView — paso carrito", () => {
  it("muestra empty state con CTA cuando está vacío", () => {
    const { onExplore } = setup([]);
    expect(screen.getByText("Tu canasta espera")).toBeInTheDocument();
    fireEvent.click(screen.getByText("EXPLORAR CAFÉS"));
    expect(onExplore).toHaveBeenCalled();
  });

  it("lista items con molienda y subtotal por línea", () => {
    setup();
    expect(screen.getByText("Geisha de Prueba")).toBeInTheDocument();
    expect(screen.getByText("V60")).toBeInTheDocument();
    expect(screen.getAllByText("$100.000").length).toBeGreaterThan(0); // 2 × 50.000
  });

  it("los botones de cantidad llaman onUpdateQty", () => {
    const { onUpdateQty } = setup();
    fireEvent.click(screen.getByText("+"));
    expect(onUpdateQty).toHaveBeenCalledWith(0, 3);
    fireEvent.click(screen.getByText("−"));
    expect(onUpdateQty).toHaveBeenCalledWith(0, 1);
  });

  it("elimina la línea con la X", () => {
    const { onRemove } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar del carrito" }));
    expect(onRemove).toHaveBeenCalledWith(0);
  });
});

describe("CartView — checkout", () => {
  it("no permite confirmar hasta completar los campos obligatorios", () => {
    setup();
    fireEvent.click(screen.getByText("PROCEDER AL PAGO"));
    const confirmBtn = screen.getByText("CONFIRMAR PEDIDO");
    expect(confirmBtn).toBeDisabled();

    fillContact();
    expect(confirmBtn).toBeDisabled(); // falta dirección

    fireEvent.change(screen.getByPlaceholderText("Calle 123 # 45-67, Apto 301"), { target: { value: "Cra 7 # 12-34" } });
    fireEvent.change(screen.getByPlaceholderText("Bogotá"), { target: { value: "Bogotá" } });
    expect(confirmBtn).toBeEnabled();
  });

  it("con 'Recoger en tienda' no exige dirección", () => {
    setup();
    fireEvent.click(screen.getByText("PROCEDER AL PAGO"));
    fillContact();
    fireEvent.click(screen.getByText("Recoger en tienda"));
    expect(screen.queryByPlaceholderText("Calle 123 # 45-67, Apto 301")).not.toBeInTheDocument();
    expect(screen.getByText("CONFIRMAR PEDIDO")).toBeEnabled();
  });

  it("valida el formato del email", () => {
    setup();
    fireEvent.click(screen.getByText("PROCEDER AL PAGO"));
    fillContact();
    fireEvent.click(screen.getByText("Recoger en tienda"));
    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), { target: { value: "no-es-email" } });
    expect(screen.getByText("CONFIRMAR PEDIDO")).toBeDisabled();
  });

  it("suma el costo del envío elegido al total", () => {
    setup();
    fireEvent.click(screen.getByText("PROCEDER AL PAGO"));
    fireEvent.click(screen.getByText("Envío express"));
    expect(screen.getByText("$118.000")).toBeInTheDocument(); // 100.000 + 18.000
  });

  it("confirma el pedido y muestra la pantalla de gracias", () => {
    const { onCheckout } = setup();
    fireEvent.click(screen.getByText("PROCEDER AL PAGO"));
    fillContact();
    fireEvent.click(screen.getByText("Recoger en tienda"));
    fireEvent.click(screen.getByText("CONFIRMAR PEDIDO"));
    expect(onCheckout).toHaveBeenCalledWith(expect.objectContaining({
      customer: expect.objectContaining({ name: "Ana Prueba", email: "ana@test.com" }),
      shippingMethod: "pickup",
      shipping: 0,
    }));
    expect(screen.getByText("¡Gracias, Ana!")).toBeInTheDocument();
    expect(screen.getByText("#123456")).toBeInTheDocument();
  });
});
