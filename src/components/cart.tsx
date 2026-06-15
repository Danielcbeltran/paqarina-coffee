import { useState } from "react";
import { PAYMENT_METHODS, SHIPPING_METHODS } from "../data";
import { findShipping, fmt } from "../lib";
import type { CartItem, Customer, Order } from "../types";
import { BrandMark, EmptyState, Field, Input, Textarea } from "./atoms";

interface CheckoutData {
  customer: Customer;
  notes: string;
  shippingMethod: string;
  paymentMethod: string;
  shipping: number;
}

export function CartView({ items, onClose, onRemove, onUpdateQty, onCheckout, onExplore, savedCustomer }: {
  items: CartItem[]; onClose: () => void; onRemove: (idx: number) => void; onUpdateQty: (idx: number, qty: number) => void;
  onCheckout: (data: CheckoutData) => Order; onExplore: () => void; savedCustomer: Customer | null;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const [step, setStep] = useState("cart"); // "cart" | "checkout" | "confirmed"
  const [confirmed, setConfirmed] = useState<Order | null>(null);
  const [form, setForm] = useState(() => ({
    name: savedCustomer?.name || "",
    email: savedCustomer?.email || "",
    phone: savedCustomer?.phone || "",
    address: savedCustomer?.address || "",
    city: savedCustomer?.city || "",
    notes: "",
    shippingId: savedCustomer?.shippingId || "standard",
    paymentId: savedCustomer?.paymentId || "card",
  }));
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const shipping = findShipping(form.shippingId);
  const isPickup = shipping.id === "pickup";
  const valid = form.name.trim() && /.+@.+\..+/.test(form.email) && form.phone.trim() && (isPickup || (form.address.trim() && form.city.trim()));
  const total = subtotal + shipping.price;

  const headerTitle = step === "confirmed" ? "Pedido confirmado" : step === "checkout" ? "Datos de envío" : "Tu canasta";
  const handleBack = () => { if (step === "checkout") setStep("cart"); else onClose(); };

  const confirmOrder = () => {
    const order = onCheckout({
      customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), address: form.address.trim(), city: form.city.trim() },
      notes: form.notes.trim(),
      shippingMethod: form.shippingId,
      paymentMethod: form.paymentId,
      shipping: shipping.price,
    });
    setConfirmed(order);
    setStep("confirmed");
  };

  return (
    <div className="anim-slide-up absolute inset-0 bg-page z-[70] flex flex-col">
      <div className="py-3.5 px-[18px] border-b border-line flex items-center justify-between shrink-0">
        <button onClick={handleBack} aria-label={step === "checkout" ? "Volver al carrito" : "Cerrar carrito"} className="bg-none border-none text-ink cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {step === "checkout"
              ? <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              : <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
          </svg>
        </button>
        <div className="font-serif text-lg text-ink font-medium">{headerTitle}</div>
        <div className="w-[22px]"/>
      </div>

      {step === "confirmed" && confirmed ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-[30px] text-center">
          <div className="w-[72px] h-[72px] rounded-full border-2 border-gold flex items-center justify-center mb-5">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="font-serif text-[26px] text-ink font-medium">¡Gracias, {confirmed.customer.name.split(" ")[0]}!</div>
          <p className="font-sans text-[13px] text-muted mt-2.5 leading-[1.5]">
            Tu pedido <b className="text-gold">#{confirmed.id.replace(/^o_/, "").slice(-6).toUpperCase()}</b> por {fmt(confirmed.total)} fue registrado. Lo verás en <b>Tú → Mis compras</b>.
          </p>
          <button onClick={() => { setConfirmed(null); setStep("cart"); onClose(); }} className="mt-6 bg-gold text-page border-none py-3.5 px-7 font-sans text-xs font-semibold tracking-[0.18em] cursor-pointer">SEGUIR EXPLORANDO</button>
        </div>
      ) : step === "cart" && items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState title="Tu canasta espera" message="Descubre cafés que cuentan historias." ctaLabel="EXPLORAR CAFÉS" onCta={onExplore}/>
        </div>
      ) : step === "cart" ? (
        <>
          <div className="flex-1 overflow-y-auto py-2 px-[18px]">
            {items.map((it, i) => (
              <div key={i} className="flex gap-3 py-3.5 border-b border-line-soft">
                <div className="w-16 h-[84px] shrink-0 flex items-center justify-center" style={{ background: it.imageUrl ? `url(${it.imageUrl}) center/cover` : it.img }}>
                  {!it.imageUrl && (
                    <div className="w-[38px] h-14 rounded-[3px] flex items-center justify-center" style={{ background: it.bean }}>
                      <BrandMark name={it.farm} size={15}/>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-serif text-[17px] text-ink font-medium">{it.name}</div>
                  <div className="font-sans text-[11px] text-muted mt-0.5">{it.farm}</div>
                  {it.grind && <div className="font-sans text-[10px] text-dim mt-1 tracking-[0.1em]">{it.grind.toUpperCase()}</div>}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-line py-0.5 px-1.5">
                      <button onClick={() => onUpdateQty(i, Math.max(1, (it.qty || 1) - 1))} className="bg-none border-none text-ink cursor-pointer text-sm">−</button>
                      <span className="font-sans text-xs text-ink min-w-3.5 text-center">{it.qty || 1}</span>
                      <button onClick={() => onUpdateQty(i, (it.qty || 1) + 1)} className="bg-none border-none text-ink cursor-pointer text-sm">+</button>
                    </div>
                    <div className="font-serif text-base text-gold">{fmt(it.price * (it.qty || 1))}</div>
                  </div>
                </div>
                <button onClick={() => onRemove(i)} aria-label="Eliminar del carrito" className="bg-none border-none text-dim cursor-pointer self-start p-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="pt-[18px] px-[22px] pb-6 border-t border-line bg-surface shrink-0">
            <div className="flex justify-between font-serif text-[22px] text-ink font-medium">
              <span>Subtotal</span><span className="text-gold">{fmt(subtotal)}</span>
            </div>
            <div className="font-sans text-[11px] text-dim mt-1">Envío e impuestos se calculan en el siguiente paso.</div>
            <button onClick={() => setStep("checkout")} className="mt-4 w-full bg-gold text-page border-none p-4 font-sans text-xs font-semibold tracking-[0.2em] cursor-pointer">PROCEDER AL PAGO</button>
          </div>
        </>
      ) : (
        // step === "checkout"
        <>
          <div className="flex-1 overflow-y-auto pt-[18px] px-[22px] pb-2">
            <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2.5">1. CONTACTO</div>
            <Field label="Nombre completo *"><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Juan Pérez"/></Field>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Email *"><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="tu@email.com"/></Field>
              <Field label="Teléfono *"><Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="3001234567"/></Field>
            </div>

            <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mt-[18px] mb-2.5">2. ENVÍO</div>
            <div className="flex flex-col gap-2 mb-3.5">
              {SHIPPING_METHODS.map(s => (
                <button key={s.id} onClick={() => set("shippingId", s.id)} className={`text-left py-3 px-3.5 cursor-pointer text-ink flex justify-between items-center gap-2.5 border ${form.shippingId === s.id ? "bg-gold-soft border-gold" : "bg-transparent border-line"}`}>
                  <span>
                    <div className={`font-serif text-[15px] font-medium ${form.shippingId === s.id ? "text-gold" : "text-ink"}`}>{s.label}</div>
                    <div className="font-sans text-[11px] text-muted mt-0.5">{s.desc}</div>
                  </span>
                  <span className="font-serif text-[15px] text-gold">{s.price === 0 ? "Gratis" : fmt(s.price)}</span>
                </button>
              ))}
            </div>
            {!isPickup && (
              <>
                <Field label="Dirección *"><Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Calle 123 # 45-67, Apto 301"/></Field>
                <Field label="Ciudad *"><Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Bogotá"/></Field>
              </>
            )}
            <Field label="Notas para el caficultor (opcional)"><Textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} placeholder="Ej. Por favor moler para V60"/></Field>

            <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mt-2 mb-2.5">3. PAGO</div>
            <div className="flex flex-col gap-2 mb-[18px]">
              {PAYMENT_METHODS.map(p => (
                <button key={p.id} onClick={() => set("paymentId", p.id)} className={`text-left py-3 px-3.5 cursor-pointer text-ink font-sans text-[13px] border ${form.paymentId === p.id ? "bg-gold-soft border-gold" : "bg-transparent border-line"}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="font-sans text-[10px] text-dim italic mb-2">Esto es una demo: no se procesa ningún pago real.</div>
          </div>
          <div className="pt-3.5 px-[22px] pb-[18px] border-t border-line bg-surface shrink-0">
            <div className="flex justify-between font-sans text-xs text-muted mb-1.5">
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between font-sans text-xs text-muted mb-2.5">
              <span>{shipping.label}</span><span>{shipping.price === 0 ? "Gratis" : fmt(shipping.price)}</span>
            </div>
            <div className="flex justify-between font-serif text-xl text-ink font-medium pt-2.5 border-t border-line">
              <span>Total</span><span className="text-gold">{fmt(total)}</span>
            </div>
            <button disabled={!valid} onClick={confirmOrder} className={`mt-3.5 w-full border-none p-4 font-sans text-xs font-semibold tracking-[0.2em] ${valid ? "bg-gold text-page cursor-pointer" : "bg-surface-2 text-dim cursor-not-allowed"}`}>CONFIRMAR PEDIDO</button>
            {!valid && <div className="mt-2 font-sans text-[10px] text-dim text-center">Completa los campos obligatorios para continuar.</div>}
          </div>
        </>
      )}
    </div>
  );
}
