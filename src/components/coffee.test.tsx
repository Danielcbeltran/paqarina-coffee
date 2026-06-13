import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CoffeeCard, ProductDetail } from "./coffee";
import type { Coffee } from "../types";

const coffee: Coffee = {
  id: "c_test", name: "Geisha de Prueba", farm: "Finca Test", farmer: "Tester",
  region: "Huila, Pitalito", altitude: "1.800 msnm", process: "Lavado", variety: "Geisha",
  notes: ["Jazmín", "Lichi"], score: 90, price: 100000, weight: "250g", roast: "Claro",
  fresh: "Tueste a pedido", tag: "Microlote", img: "linear-gradient(#000,#fff)", bean: "#3D2817",
  stock: 10, verified: true,
};

describe("CoffeeCard", () => {
  const setup = (over: Partial<Coffee> = {}, props: Record<string, unknown> = {}) => {
    const onAdd = vi.fn(), onOpen = vi.fn(), onToggleFav = vi.fn();
    render(<CoffeeCard coffee={{ ...coffee, ...over }} onAdd={onAdd} onOpen={onOpen} isFav={false} onToggleFav={onToggleFav} {...props}/>);
    return { onAdd, onOpen, onToggleFav };
  };

  it("muestra nombre, región, caficultor y precio formateado", () => {
    setup();
    expect(screen.getByText("Geisha de Prueba")).toBeInTheDocument();
    expect(screen.getByText("Huila, Pitalito")).toBeInTheDocument();
    expect(screen.getByText("por Tester")).toBeInTheDocument();
    expect(screen.getByText("$100.000")).toBeInTheDocument();
  });

  it("abre el detalle al hacer click en la tarjeta", () => {
    const { onOpen } = setup();
    fireEvent.click(screen.getByText("Geisha de Prueba"));
    expect(onOpen).toHaveBeenCalled();
  });

  it("el botón + agrega al carrito sin abrir el detalle", () => {
    const { onAdd, onOpen } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: "c_test" }));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("deshabilita el botón y muestra AGOTADO sin stock", () => {
    setup({ stock: 0 });
    expect(screen.getByRole("button", { name: "Agotado" })).toBeDisabled();
    expect(screen.getByText("AGOTADO")).toBeInTheDocument();
  });

  it("avisa cuando queda poco stock", () => {
    setup({ stock: 2 });
    expect(screen.getByText("¡SOLO 2 DISPONIBLES!")).toBeInTheDocument();
  });

  it("marca favorito con el corazón", () => {
    const { onToggleFav } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Agregar a favoritos" }));
    expect(onToggleFav).toHaveBeenCalledWith("c_test");
  });

  it("muestra el badge BORRADOR para borradores del vendedor", () => {
    setup({ draft: true, bySeller: true });
    expect(screen.getByText("BORRADOR")).toBeInTheDocument();
  });
});

describe("ProductDetail", () => {
  const setup = (over: Partial<Coffee> = {}) => {
    const onAdd = vi.fn(), onBack = vi.fn(), onOpenFarm = vi.fn(), onToggleFav = vi.fn(), onAddReview = vi.fn();
    render(<ProductDetail coffee={{ ...coffee, ...over }} onBack={onBack} onAdd={onAdd} onOpenFarm={onOpenFarm}
      isFav={false} onToggleFav={onToggleFav} seller={null} reviews={[]} orders={[]} customer={null} onAddReview={onAddReview}/>);
    return { onAdd, onBack, onOpenFarm };
  };

  it("muestra notas de cata y trazabilidad", () => {
    setup();
    expect(screen.getByText("Jazmín")).toBeInTheDocument();
    expect(screen.getByText("NOTAS DE CATA")).toBeInTheDocument();
    expect(screen.getByText("TRAZABILIDAD")).toBeInTheDocument();
    expect(screen.getByText("Lavado")).toBeInTheDocument();
  });

  it("incrementa cantidad y actualiza el total", () => {
    setup();
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("$300.000")).toBeInTheDocument();
  });

  it("no permite pasar del stock disponible", () => {
    setup({ stock: 2 });
    const plus = screen.getByText("+");
    fireEvent.click(plus);
    fireEvent.click(plus);
    fireEvent.click(plus);
    expect(screen.getByText("$200.000")).toBeInTheDocument();
    expect(plus).toBeDisabled();
  });

  it("agrega al carrito con cantidad y molienda elegidas y cierra", () => {
    const { onAdd, onBack } = setup();
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("V60"));
    fireEvent.click(screen.getByText("AGREGAR AL CARRITO"));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: "c_test", qty: 2, grind: "V60" }));
    expect(onBack).toHaveBeenCalled();
  });

  it("navega al perfil de la finca al tocar su nombre", () => {
    const { onOpenFarm } = setup();
    fireEvent.click(screen.getByText("Finca Test"));
    expect(onOpenFarm).toHaveBeenCalledWith("Finca Test");
  });

  it("muestra AGOTADO y deshabilita la compra sin stock", () => {
    setup({ stock: 0 });
    const btn = screen.getByRole("button", { name: "AGOTADO" });
    expect(btn).toBeDisabled();
  });
});
