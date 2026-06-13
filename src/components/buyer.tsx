import { useState } from "react";
import { SUBSCRIPTION_PLANS } from "../data";
import { findPayment, findPlan, findShipping, fmt, fmtDate } from "../lib";
import type { Customer, Order, Subscription } from "../types";
import { EmptyState, SectionHeader } from "./atoms";

/* ---------- Suscripción ---------- */
export function SubscriptionStatus({ subscription, onSubscribe, onCancel }: { subscription: Subscription | null; onSubscribe: () => void; onCancel: () => void }) {
  if (!subscription) {
    return (
      <div className="mt-[18px] p-[18px] bg-surface border border-line">
        <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1.5">CAJA DEL MES</div>
        <div className="font-serif text-xl text-ink font-medium leading-[1.15]">Suscríbete y recibe un café distinto cada mes</div>
        <p className="font-sans text-xs text-muted mt-2 leading-[1.5]">Curaduría rotativa entre nuestras fincas y marcas, con envío incluido y ficha de cata.</p>
        <button onClick={onSubscribe} className="mt-3 bg-gold text-page border-none px-[22px] py-3 font-sans text-[11px] font-semibold tracking-[0.18em] cursor-pointer">VER PLANES</button>
      </div>
    );
  }
  const plan = findPlan(subscription.planId);
  const nextDate = new Date(subscription.startDate);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return (
    <div className="mt-[18px] p-[18px] bg-gold-soft border border-gold">
      <div className="flex justify-between items-start mb-2">
        <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold">SUSCRIPCIÓN ACTIVA</div>
        <span className="font-sans text-[9px] px-2 py-[3px] bg-gold text-page tracking-[0.14em] font-semibold">{plan?.weight}</span>
      </div>
      <div className="font-serif text-[22px] text-ink font-medium leading-[1.1]">Plan {plan?.name}</div>
      <div className="font-sans text-xs text-muted mt-1.5">{plan?.desc}</div>
      <div className="mt-3 flex justify-between items-center pt-3 border-t border-[#D4AF6A55]">
        <div>
          <div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase">Próximo envío</div>
          <div className="font-serif text-[15px] text-ink mt-0.5">{fmtDate(nextDate.toISOString())}</div>
        </div>
        <div className="font-serif text-lg text-gold font-medium">{fmt(plan?.price || 0)}/mes</div>
      </div>
      <button onClick={() => { if (confirm("¿Cancelar tu suscripción mensual?")) onCancel(); }} className="mt-3 w-full bg-transparent text-muted border border-line p-2.5 font-sans text-[10px] font-semibold tracking-[0.16em] cursor-pointer">CANCELAR SUSCRIPCIÓN</button>
    </div>
  );
}

export function SubscriptionPanel({ onSubscribe, onClose }: { onSubscribe: (planId: string) => void; onClose: () => void }) {
  const [planId, setPlanId] = useState("explorar");
  return (
    <div onClick={onClose} className="anim-fade-in absolute inset-0 bg-black/60 z-[62] flex flex-col justify-end">
      <div onClick={e => e.stopPropagation()} className="anim-sheet-up bg-page border-t border-line pt-[22px] px-[22px] pb-6 max-h-[86%] overflow-y-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="font-serif text-[22px] text-ink font-medium">Caja del mes</div>
          <button onClick={onClose} aria-label="Cerrar planes" className="bg-none border-none text-muted cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
        <p className="font-sans text-xs text-muted mt-0 mb-[18px] leading-[1.5]">Café distinto cada mes, seleccionado y tostado por nuestro equipo, con envío incluido. Cancela cuando quieras.</p>
        <div className="flex flex-col gap-2.5">
          {SUBSCRIPTION_PLANS.map(p => {
            const active = planId === p.id;
            return (
              <button key={p.id} onClick={() => setPlanId(p.id)} className={`text-left py-3.5 px-4 cursor-pointer border ${active ? "bg-gold-soft border-gold" : "bg-transparent border-line"}`}>
                <div className="flex justify-between items-center">
                  <div className={`font-serif text-lg font-medium ${active ? "text-gold" : "text-ink"}`}>Plan {p.name}</div>
                  <div className="font-serif text-[17px] text-gold">{fmt(p.price)}<span className="font-sans text-[10px] text-muted ml-1">/mes</span></div>
                </div>
                <div className="font-sans text-xs text-muted mt-1">{p.desc}</div>
              </button>
            );
          })}
        </div>
        <button onClick={() => onSubscribe(planId)} className="mt-[18px] w-full bg-gold text-page border-none p-4 font-sans text-xs font-semibold tracking-[0.2em] cursor-pointer">ACTIVAR SUSCRIPCIÓN</button>
        <div className="mt-2.5 font-sans text-[10px] text-dim text-center">Demo: no se cobra. Puedes cancelar desde tu perfil.</div>
      </div>
    </div>
  );
}

/* ---------- Pedidos del comprador ---------- */
export function BuyerOrderCard({ order }: { order: Order }) {
  const shipping = findShipping(order.shippingMethod);
  const payment = findPayment(order.paymentMethod);
  const delivered = order.status === "Entregado";
  const units = order.items.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="bg-surface border border-line-soft p-4 mb-3">
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <div className="font-sans text-[10px] tracking-[0.14em] text-dim">#{order.id.replace(/^o_/, "").slice(-6).toUpperCase()} · {fmtDate(order.date)}</div>
          <div className="font-serif text-lg text-ink font-medium mt-0.5">{units} {units === 1 ? "café" : "cafés"}</div>
        </div>
        <span className={`font-sans text-[9px] font-semibold tracking-[0.12em] uppercase px-2.5 py-[5px] rounded-full ${delivered ? "bg-gold text-page" : "bg-gold-soft text-gold"}`}>{order.status}</span>
      </div>
      <div className="pt-2.5 border-t border-line-soft">
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between font-sans text-xs text-muted mb-1">
            <span>{i.qty} × {i.name}{i.grind ? ` · ${i.grind}` : ""}</span><span className="text-ink">{fmt(i.price * i.qty)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 pt-2.5 border-t border-dashed border-line-soft grid grid-cols-2 gap-2 font-sans text-[10px] text-dim">
        <div><span className="tracking-[0.1em] uppercase">Envío</span><div className="text-xs text-ink mt-0.5">{shipping.label}</div></div>
        <div><span className="tracking-[0.1em] uppercase">Pago</span><div className="text-xs text-ink mt-0.5">{payment.label}</div></div>
        {order.customer?.address && <div className="col-span-full"><span className="tracking-[0.1em] uppercase">Dirección</span><div className="text-xs text-ink mt-0.5">{order.customer.address}{order.customer.city ? `, ${order.customer.city}` : ""}</div></div>}
      </div>
      <div className="flex justify-between mt-3 pt-3 border-t border-line-soft font-serif text-[17px] text-ink font-medium">
        <span>Total</span><span className="text-gold">{fmt(order.total)}</span>
      </div>
    </div>
  );
}

export function BuyerOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <EmptyState title="Aún no has comprado" message="Cuando finalices una compra verás aquí tu historial de pedidos."/>;
  }
  return (
    <div>
      {orders.map(o => <BuyerOrderCard key={o.id} order={o}/>)}
    </div>
  );
}

export function BuyerProfile({ orders, customer, subscription, onSubscribeOpen, onUnsubscribe, onBecomeSeller }: {
  orders: Order[]; customer: Customer | null; subscription: Subscription | null;
  onSubscribeOpen: () => void; onUnsubscribe: () => void; onBecomeSeller: () => void;
}) {
  const myOrders = orders.filter(o => o.byUser);
  const totalSpent = myOrders.reduce((s, o) => s + (o.total || 0), 0);
  return (
    <div className="pt-[22px] px-[18px] pb-7">
      <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1.5">MI CUENTA</div>
      <h1 className="font-serif text-3xl font-medium text-ink m-0 leading-[1.05]">{customer?.name ? `Hola, ${customer.name.split(" ")[0]}` : "Bienvenido"}</h1>
      <div className="font-serif text-sm italic text-muted mt-1">{myOrders.length} pedido{myOrders.length === 1 ? "" : "s"} · {fmt(totalSpent)} invertidos en origen</div>

      <SubscriptionStatus subscription={subscription} onSubscribe={onSubscribeOpen} onCancel={onUnsubscribe}/>

      <div className="mt-6">
        <SectionHeader kicker="MIS COMPRAS" title={`${myOrders.length} pedido${myOrders.length === 1 ? "" : "s"}`}/>
        <BuyerOrders orders={myOrders}/>
      </div>

      <div className="mt-7 p-5 bg-surface border border-line">
        <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2">¿VENDES CAFÉ?</div>
        <div className="font-serif text-xl text-ink font-medium leading-[1.15]">Únete como productor o tostador</div>
        <p className="font-sans text-xs text-muted mt-2 leading-[1.5]">Publica tus cafés, recibe pedidos y comparte tu historia con miles de compradores.</p>
        <button onClick={onBecomeSeller} className="mt-3 bg-gold text-page border-none px-[22px] py-3 font-sans text-[11px] font-semibold tracking-[0.18em] cursor-pointer">CONVERTIRME EN VENDEDOR</button>
      </div>
    </div>
  );
}
