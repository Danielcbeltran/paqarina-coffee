import { useState } from "react";
import {
  CERTS, COMMISSION_RATE, CURATOR_TAGS, FRESH_OPTS, GRADIENTS,
  ORDER_STATUSES, PROCESSES, ROASTS, ROLE_INFO, TAGS,
} from "../data";
import { fileToDataURL, fmt, fmtDate } from "../lib";
import type { Coffee, Customer, Order, Seller, SellerRole, Subscription } from "../types";
import { EmptyState, Field, Input, PillSelect, SectionHeader, Textarea, VerifiedBadge } from "./atoms";
import { BuyerOrders, BuyerProfile, SubscriptionStatus } from "./buyer";

export function SellerOnboarding({ onRegister }: { onRegister: (data: Partial<Seller> & { role: SellerRole }) => void }) {
  const [role, setRole] = useState<SellerRole>("productor");
  const [f, setF] = useState({ fincaName: "", farmerName: "", region: "", altitude: "", story: "", certifications: [] as string[] });
  const i = ROLE_INFO[role];
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const toggleCert = (c: string) => setF(p => ({ ...p, certifications: p.certifications.includes(c) ? p.certifications.filter(x => x !== c) : [...p.certifications, c] }));
  const valid = f.fincaName.trim() && f.farmerName.trim() && f.region.trim();
  const roleBtn = (key: SellerRole, label: string, sub: string) => (
    <button onClick={() => { setRole(key); setF(p => ({ ...p, certifications: [] })); }} className={`flex-1 text-left p-3.5 cursor-pointer border ${role === key ? "bg-gold-soft border-gold" : "bg-transparent border-line"}`}>
      <div className={`font-serif text-[17px] font-medium ${role === key ? "text-gold" : "text-ink"}`}>{label}</div>
      <div className="font-sans text-[10px] text-muted mt-[3px] leading-[1.4]">{sub}</div>
    </button>
  );
  return (
    <div className="pt-6 px-[22px] pb-8">
      <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2">{i.badge}</div>
      <h1 className="font-serif text-[32px] font-medium text-ink m-0 leading-[1.05]">{i.title}</h1>
      <p className="font-sans text-[13px] leading-[1.55] text-muted mt-2.5 mb-[18px]">{i.desc}</p>

      <div className="font-sans text-[9px] tracking-[0.2em] text-dim uppercase font-semibold mb-2">Tipo de cuenta</div>
      <div className="flex gap-2.5 mb-[22px]">
        {roleBtn("productor", "Productor", "Cultivas y vendes el café de tu finca.")}
        {roleBtn("curador", "Tostador", "Vendes tu propia marca de café tostado.")}
      </div>

      <Field label={i.nameLabel}><Input value={f.fincaName} onChange={e => set("fincaName", e.target.value)} placeholder={i.namePh}/></Field>
      <Field label={i.ownerLabel}><Input value={f.farmerName} onChange={e => set("farmerName", e.target.value)} placeholder={i.ownerPh}/></Field>
      <Field label={i.placeLabel}><Input value={f.region} onChange={e => set("region", e.target.value)} placeholder={i.placePh}/></Field>
      <Field label={i.extraLabel}><Input value={f.altitude} onChange={e => set("altitude", e.target.value)} placeholder={i.extraPh}/></Field>
      <Field label={i.storyLabel}><Textarea value={f.story} onChange={e => set("story", e.target.value)} rows={4} placeholder={i.storyPh}/></Field>
      <Field label={i.tagsLabel}><PillSelect options={i.tagsOptions} value={f.certifications} onChange={toggleCert} multi/></Field>
      <button disabled={!valid} onClick={() => onRegister({ ...f, role })} className={`mt-2 w-full border-none p-4 font-sans text-xs font-semibold tracking-[0.2em] ${valid ? "bg-gold text-page cursor-pointer" : "bg-surface-2 text-dim cursor-not-allowed"}`}>
        {i.cta}
      </button>
      <p className="font-sans text-[10px] text-dim mt-3 text-center">* Campos obligatorios. Te agregaremos 2 cafés de ejemplo para empezar.</p>
    </div>
  );
}

export function CoffeeForm({ seller, initial, onSave, onClose }: { seller: Seller; initial: Coffee | "new" | null; onSave: (c: Coffee) => void; onClose: () => void }) {
  const src = (initial && initial !== "new") ? initial : null;
  const gi0 = src ? Math.max(0, GRADIENTS.findIndex(g => g.img === src.img)) : 2;
  const [f, setF] = useState({
    name: src?.name || "", variety: src?.variety || "", region: src?.region || seller.region || "",
    process: src?.process || PROCESSES[0], altitude: src?.altitude || seller.altitude || "",
    roast: src?.roast || "Medio", price: src?.price ?? "", weight: src?.weight || "250g",
    notes: (src?.notes || []).join(", "), tag: src?.tag || "Novedad", fresh: src?.fresh || "Tueste a pedido",
    score: src?.score ?? "", micro: !!src?.micro, fairtrade: src?.fairtrade !== undefined ? src.fairtrade : true,
    gi: gi0 < 0 ? 2 : gi0,
    stock: src?.stock ?? 20, draft: !!src?.draft, imageUrl: src?.imageUrl || "",
  });
  const [uploadErr, setUploadErr] = useState("");
  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploadErr("");
    try {
      const url = await fileToDataURL(file);
      setF(p => ({ ...p, imageUrl: url }));
    } catch {
      setUploadErr("No se pudo procesar la imagen.");
    }
  };
  const set = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));
  const valid = f.name.trim() && Number(f.price) > 0;
  const save = () => {
    const coffee: Coffee = {
      id: src?.id || ("s_" + Date.now()),
      name: f.name.trim(), farm: seller.fincaName, farmer: seller.farmerName,
      region: f.region.trim() || seller.region, altitude: f.altitude.trim() || seller.altitude,
      process: f.process, variety: f.variety.trim() || "Variedad",
      notes: f.notes.split(",").map(s => s.trim()).filter(Boolean).slice(0, 4),
      score: Number(f.score) || 85, price: Number(f.price) || 0, weight: f.weight.trim() || "250g",
      roast: f.roast, micro: f.micro, fairtrade: f.fairtrade, fresh: f.fresh, tag: f.tag,
      img: GRADIENTS[f.gi].img, bean: GRADIENTS[f.gi].bean, bySeller: true, sellerId: seller.id,
      isCurator: seller.role === "curador",
      stock: Math.max(0, Number(f.stock) || 0), draft: !!f.draft, imageUrl: f.imageUrl || "",
      verified: src?.verified || false,
    };
    onSave(coffee);
  };
  const checkboxCls = "flex items-center gap-2 font-sans text-xs text-ink cursor-pointer";
  return (
    <div className="anim-slide-up absolute inset-0 bg-page z-[65] flex flex-col overflow-hidden">
      <div className="py-3 px-[18px] flex items-center justify-between border-b border-line shrink-0">
        <button onClick={onClose} className="bg-none border-none text-ink cursor-pointer p-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <div className="font-serif text-[17px] text-ink font-medium">{src ? "Editar café" : "Nuevo café"}</div>
        <div className="w-[34px]"/>
      </div>
      <div className="flex-1 overflow-y-auto pt-5 px-[22px] pb-7">
        <Field label="Nombre del café *"><Input value={f.name} onChange={e => set("name", e.target.value)} placeholder="Geisha Lavada"/></Field>
        <Field label="Variedad"><Input value={f.variety} onChange={e => set("variety", e.target.value)} placeholder="Caturra"/></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio (COP) *"><Input type="number" value={f.price} onChange={e => set("price", e.target.value)} placeholder="78000"/></Field>
          <Field label="Peso"><Input value={f.weight} onChange={e => set("weight", e.target.value)} placeholder="250g"/></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Puntaje SCA"><Input type="number" value={f.score} onChange={e => set("score", e.target.value)} placeholder="88"/></Field>
          <Field label="Región"><Input value={f.region} onChange={e => set("region", e.target.value)} placeholder="Huila, Pitalito"/></Field>
        </div>
        <Field label="Altitud"><Input value={f.altitude} onChange={e => set("altitude", e.target.value)} placeholder="1.800 msnm"/></Field>
        <Field label="Notas de cata (separadas por coma)"><Input value={f.notes} onChange={e => set("notes", e.target.value)} placeholder="Panela, Durazno, Almendra"/></Field>
        <Field label="Proceso"><PillSelect options={PROCESSES} value={f.process} onChange={v => set("process", v)}/></Field>
        <Field label="Tueste"><PillSelect options={ROASTS} value={f.roast} onChange={v => set("roast", v)}/></Field>
        <Field label="Frescura"><PillSelect options={FRESH_OPTS} value={f.fresh} onChange={v => set("fresh", v)}/></Field>
        <Field label="Etiqueta"><PillSelect options={TAGS} value={f.tag} onChange={v => set("tag", v)}/></Field>
        <Field label="Foto del café (opcional, máx 600px)">
          {f.imageUrl ? (
            <div className="flex items-center gap-3">
              <img src={f.imageUrl} alt="Vista previa" className="w-20 h-20 object-cover rounded"/>
              <button type="button" onClick={() => setF(p => ({ ...p, imageUrl: "" }))} className="font-sans text-[11px] px-3 py-[7px] bg-transparent text-ink border border-line cursor-pointer">QUITAR</button>
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0])} className="font-sans text-[11px] text-ink"/>
          )}
          {uploadErr && <div className="mt-1.5 text-[11px] text-[#d77]">{uploadErr}</div>}
          <div className="mt-1.5 text-[10px] text-dim">Si no subes foto, se usa el color de empaque que elijas abajo.</div>
        </Field>
        <Field label="Color de empaque (fallback)">
          <div className="flex gap-2 flex-wrap">
            {GRADIENTS.map((g, i) => (
              <button key={g.label} type="button" onClick={() => set("gi", i)} title={g.label} className={`w-[42px] h-[42px] rounded-md cursor-pointer border-2 ${f.gi === i ? "border-gold" : "border-transparent"}`} style={{ background: g.img }}/>
            ))}
          </div>
        </Field>
        <Field label="Stock (unidades disponibles)">
          <Input type="number" min="0" value={f.stock} onChange={e => set("stock", e.target.value)}/>
        </Field>
        <div className="flex gap-[18px] mt-1.5 flex-wrap">
          <label className={checkboxCls}>
            <input type="checkbox" checked={f.micro} onChange={e => set("micro", e.target.checked)}/> Microlote
          </label>
          <label className={checkboxCls}>
            <input type="checkbox" checked={f.fairtrade} onChange={e => set("fairtrade", e.target.checked)}/> Comercio justo
          </label>
          <label className={checkboxCls}>
            <input type="checkbox" checked={f.draft} onChange={e => set("draft", e.target.checked)}/> Guardar como borrador
          </label>
        </div>
      </div>
      <div className="pt-3.5 px-[22px] pb-[18px] border-t border-line flex gap-2.5 shrink-0">
        <button onClick={onClose} className="flex-none bg-transparent text-ink border border-line py-3.5 px-[18px] font-sans text-[11px] font-semibold tracking-[0.16em] cursor-pointer">CANCELAR</button>
        <button disabled={!valid} onClick={save} className={`flex-1 border-none p-3.5 font-sans text-[11px] font-semibold tracking-[0.18em] ${valid ? "bg-gold text-page cursor-pointer" : "bg-surface-2 text-dim cursor-not-allowed"}`}>
          {src ? "GUARDAR CAMBIOS" : "PUBLICAR CAFÉ"}
        </button>
      </div>
    </div>
  );
}

export function SalesSummary({ orders }: { orders: Order[] }) {
  let revenue = 0, units = 0; const byName: Record<string, number> = {};
  orders.forEach(o => o.items.filter(i => i.bySeller).forEach(i => {
    revenue += i.price * i.qty; units += i.qty; byName[i.name] = (byName[i.name] || 0) + i.qty;
  }));
  const commission = Math.round(revenue * COMMISSION_RATE);
  const earnings = revenue - commission;
  const top = Object.entries(byName).sort((a, b) => b[1] - a[1])[0];
  const cell = (label: string, value: string | number, big = false) => (
    <div className="flex-1">
      <div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-1">{label}</div>
      <div className={`font-serif font-medium ${big ? "text-xl text-gold" : "text-base text-ink"}`}>{value}</div>
    </div>
  );
  return (
    <div className="bg-surface border border-line p-[18px] mb-[18px]">
      <div className="flex gap-3.5 mb-3">
        {cell("Ingresos brutos", fmt(revenue))}
        {cell(`Comisión (${Math.round(COMMISSION_RATE * 100)}%)`, `−${fmt(commission)}`)}
      </div>
      <div className="flex gap-3.5 pt-3 border-t border-line-soft mb-3">
        {cell("Ganancia neta", fmt(earnings), true)}
        {cell("Pedidos", orders.length, true)}
      </div>
      <div className="flex gap-3.5 pt-3 border-t border-line-soft">
        {cell("Unidades vendidas", units)}
        <div className="flex-1">
          <div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-1">Top café</div>
          <div className="font-serif text-[15px] text-ink font-medium leading-[1.1]">{top ? top[0] : "—"}</div>
        </div>
      </div>
      <Sparkline orders={orders}/>
    </div>
  );
}

export function Sparkline({ orders }: { orders: Order[] }) {
  const days = 7;
  const now = new Date(); now.setHours(23, 59, 59, 999);
  const buckets = Array.from({ length: days }, () => 0);
  orders.forEach(o => {
    const diffMs = now.getTime() - new Date(o.date).getTime();
    const idx = Math.floor(diffMs / (24 * 3600 * 1000));
    if (idx >= 0 && idx < days) {
      const rev = o.items.filter(i => i.bySeller).reduce((s, i) => s + i.price * i.qty, 0);
      buckets[days - 1 - idx] += rev;
    }
  });
  const max = Math.max(...buckets, 1);
  const W = 280, H = 60, gap = 6;
  const barW = (W - gap * (days - 1)) / days;
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (days - 1 - i));
    return ["D", "L", "M", "X", "J", "V", "S"][d.getDay()];
  });
  return (
    <div className="mt-3.5 pt-3.5 border-t border-line-soft">
      <div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-2">Ingresos · últimos 7 días</div>
      <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full h-20 block" aria-label="Ingresos diarios">
        {buckets.map((v, i) => {
          const h = (v / max) * (H - 4);
          const x = i * (barW + gap);
          return (
            <g key={i}>
              <rect x={x} y={H - h} width={barW} height={h || 1} fill={v > 0 ? "var(--color-gold)" : "var(--color-line-soft)"} rx="1"/>
              <text x={x + barW / 2} y={H + 12} textAnchor="middle" fontSize="9" fill="var(--color-dim)" fontFamily="var(--font-sans)">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function OrderCard({ order, onAdvance }: { order: Order; onAdvance: (orderId: string) => void }) {
  const sellerItems = order.items.filter(i => i.bySeller);
  const sellerSubtotal = sellerItems.reduce((s, i) => s + i.price * i.qty, 0);
  const commission = Math.round(sellerSubtotal * COMMISSION_RATE);
  const earnings = sellerSubtotal - commission;
  const statusIdx = ORDER_STATUSES.indexOf(order.status);
  const nextStatus = ORDER_STATUSES[statusIdx + 1];
  const done = order.status === "Entregado";
  return (
    <div className="bg-surface border border-line-soft p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-sans text-[10px] tracking-[0.14em] text-dim">#{order.id.replace(/^o_/, "").slice(-6).toUpperCase()} · {fmtDate(order.date)}</div>
          <div className="font-serif text-lg text-ink font-medium mt-0.5">{order.customer.name}</div>
          <div className="font-sans text-[11px] text-muted">{order.customer.city}</div>
        </div>
        <span className={`font-sans text-[9px] font-semibold tracking-[0.12em] uppercase px-2.5 py-[5px] rounded-full ${done ? "bg-gold text-page" : "bg-gold-soft text-gold"}`}>{order.status}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-line-soft">
        {sellerItems.map((i, idx) => (
          <div key={idx} className="flex justify-between font-sans text-xs text-muted mb-1">
            <span>{i.qty} × {i.name}{i.grind ? ` · ${i.grind}` : ""}</span><span className="text-ink">{fmt(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="mt-2.5 pt-2.5 border-t border-dashed border-line-soft font-sans text-[11px] text-muted">
          <div className="flex justify-between mb-[3px]"><span>Subtotal</span><span className="text-ink">{fmt(sellerSubtotal)}</span></div>
          <div className="flex justify-between mb-[3px]"><span>Comisión Paqarina ({Math.round(COMMISSION_RATE * 100)}%)</span><span>−{fmt(commission)}</span></div>
        </div>
        <div className="flex justify-between mt-2 font-serif text-[17px] text-ink font-medium">
          <span>Tu ganancia</span><span className="text-gold">{fmt(earnings)}</span>
        </div>
      </div>
      {!done && nextStatus && (
        <button onClick={() => onAdvance(order.id)} className="mt-3 w-full bg-transparent text-gold border border-gold p-2.5 font-sans text-[10px] font-semibold tracking-[0.16em] cursor-pointer">
          MARCAR COMO {nextStatus.toUpperCase()}
        </button>
      )}
    </div>
  );
}

export function FincaEditor({ seller, onUpdate, onOpenFarm, onReset, onRequestVerification }: {
  seller: Seller; onUpdate: (data: Partial<Seller>) => void; onOpenFarm: () => void;
  onReset: () => void; onRequestVerification: () => void;
}) {
  const isCurador = seller.role === "curador";
  const [f, setF] = useState({ fincaName: seller.fincaName, farmerName: seller.farmerName, region: seller.region, altitude: seller.altitude || "", story: seller.story || "", certifications: seller.certifications || [] });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const toggleCert = (c: string) => setF(p => ({ ...p, certifications: p.certifications.includes(c) ? p.certifications.filter(x => x !== c) : [...p.certifications, c] }));
  const [saved, setSaved] = useState(false);
  const save = () => { onUpdate(f); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  return (
    <div>
      <div className={`flex items-center gap-2.5 py-3 px-3.5 mb-3.5 border ${seller.verified ? "bg-gold-soft border-gold" : "bg-surface border-line"}`}>
        {seller.verified ? <VerifiedBadge size={18}/> : <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-dashed border-dim"/>}
        <div className="flex-1 font-sans text-xs text-ink">{seller.verified ? "Verificado por Paqarina" : "Verificación pendiente"}</div>
        {!seller.verified && <button onClick={onRequestVerification} className="font-sans text-[10px] px-2.5 py-1.5 bg-gold text-page border-none cursor-pointer tracking-[0.12em] font-semibold">SOLICITAR</button>}
      </div>
      <Field label={isCurador ? "Nombre de la marca" : "Nombre de la finca"}><Input value={f.fincaName} onChange={e => set("fincaName", e.target.value)}/></Field>
      <Field label={isCurador ? "Tostador" : "Caficultor"}><Input value={f.farmerName} onChange={e => set("farmerName", e.target.value)}/></Field>
      <Field label={isCurador ? "Ciudad" : "Región"}><Input value={f.region} onChange={e => set("region", e.target.value)}/></Field>
      <Field label={isCurador ? "Credencial" : "Altitud"}><Input value={f.altitude} onChange={e => set("altitude", e.target.value)}/></Field>
      <Field label={isCurador ? "Sobre tu marca" : "Historia"}><Textarea value={f.story} onChange={e => set("story", e.target.value)} rows={4}/></Field>
      <Field label={isCurador ? "Especialidades" : "Certificaciones"}><PillSelect options={isCurador ? CURATOR_TAGS : CERTS} value={f.certifications} onChange={toggleCert} multi/></Field>
      <div className="flex gap-2.5 mt-1.5">
        <button onClick={save} className="flex-1 bg-gold text-page border-none p-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] cursor-pointer">{saved ? "✓ GUARDADO" : "GUARDAR CAMBIOS"}</button>
        <button onClick={onOpenFarm} className="flex-1 bg-transparent text-ink border border-line p-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] cursor-pointer">VER PERFIL PÚBLICO</button>
      </div>
      <button onClick={() => { if (confirm("¿Cerrar tu perfil de vendedor? Tus cafés publicados se quitarán del marketplace. Podrás registrarte de nuevo después como productor o tostador.")) onReset(); }} className="mt-[18px] w-full bg-none border-none text-dim font-sans text-[10px] tracking-[0.14em] uppercase cursor-pointer underline">
        Cerrar perfil de vendedor
      </button>
    </div>
  );
}

export function ProfileScreen({ seller, coffees, orders, customer, subscription, onSubscribeOpen, onUnsubscribe, onRegister, onNewCoffee, onEditCoffee, onDeleteCoffee, onAdvanceOrder, onUpdateSeller, onOpenFarm, onReset, onRequestVerification }: {
  seller: Seller | null; coffees: Coffee[]; orders: Order[]; customer: Customer | null; subscription: Subscription | null;
  onSubscribeOpen: () => void; onUnsubscribe: () => void; onRegister: (data: Partial<Seller> & { role: SellerRole }) => void;
  onNewCoffee: () => void; onEditCoffee: (c: Coffee) => void; onDeleteCoffee: (id: string) => void;
  onAdvanceOrder: (orderId: string) => void; onUpdateSeller: (data: Partial<Seller>) => void;
  onOpenFarm: (name: string) => void; onReset: () => void; onRequestVerification: () => void;
}) {
  const [tab, setTab] = useState("coffees");
  const [mode, setMode] = useState("seller");
  const [showOnboarding, setShowOnboarding] = useState(false);
  if (!seller) {
    if (showOnboarding) return <SellerOnboarding onRegister={(d) => { onRegister(d); setShowOnboarding(false); }}/>;
    return <BuyerProfile orders={orders} customer={customer} subscription={subscription} onSubscribeOpen={onSubscribeOpen} onUnsubscribe={onUnsubscribe} onBecomeSeller={() => setShowOnboarding(true)}/>;
  }

  const isCurador = seller.role === "curador";
  const sellerOrders = orders.filter(o => o.items.some(i => i.bySeller));
  const buyerOrders = orders.filter(o => o.byUser);
  const tabs = [
    { id: "coffees", label: "Mis cafés" },
    { id: "orders", label: "Pedidos" },
    { id: "finca", label: isCurador ? "Marca" : "Finca" },
  ];
  const totalSpent = buyerOrders.reduce((s, o) => s + (o.total || 0), 0);

  // Switch comprador/vendedor: 2 modos claros para una misma cuenta
  const modeBtn = (id: string, label: string) => {
    const on = mode === id;
    return (
      <button key={id} onClick={() => setMode(id)} aria-pressed={on} className={`flex-1 py-3 px-2 font-sans text-[11px] font-bold tracking-[0.14em] uppercase cursor-pointer border ${on ? "bg-gold text-page border-gold" : "bg-transparent text-muted border-line"}`}>{label}</button>
    );
  };

  return (
    <div className="pt-[22px] px-[18px] pb-7">
      <div className="flex gap-0 mb-5">
        {modeBtn("buyer", "Comprador")}
        {modeBtn("seller", "Vendedor")}
      </div>

      {mode === "buyer" ? (
        <div>
          <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1.5">MI CUENTA</div>
          <h1 className="font-serif text-3xl font-medium text-ink m-0 leading-[1.05]">{customer?.name ? `Hola, ${customer.name.split(" ")[0]}` : "Bienvenido"}</h1>
          <div className="font-serif text-sm italic text-muted mt-1">{buyerOrders.length} pedido{buyerOrders.length === 1 ? "" : "s"} · {fmt(totalSpent)} invertidos en origen</div>

          <SubscriptionStatus subscription={subscription} onSubscribe={onSubscribeOpen} onCancel={onUnsubscribe}/>

          <div className="mt-6">
            <SectionHeader kicker="MIS COMPRAS" title={`${buyerOrders.length} pedido${buyerOrders.length === 1 ? "" : "s"}`}/>
            <BuyerOrders orders={buyerOrders}/>
          </div>

          <button onClick={() => setMode("seller")} className="mt-6 w-full bg-transparent text-gold border border-gold p-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] cursor-pointer">
            IR A MI PANEL DE VENDEDOR →
          </button>
        </div>
      ) : (
        <div>
          <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1.5">{isCurador ? "PANEL DE TOSTADOR" : "PANEL DE PRODUCTOR"}</div>
          <h1 className="font-serif text-3xl font-medium text-ink m-0 leading-[1.05]">{seller.fincaName}</h1>
          <div className="font-serif text-sm italic text-muted mt-1">{isCurador ? "Tostado por " : ""}{seller.farmerName} · {seller.region}</div>

          <div className="flex gap-1.5 mt-5 mb-[18px]">
            {tabs.map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)} className={`flex-1 py-2.5 px-1 font-sans text-[10px] font-semibold tracking-[0.06em] uppercase rounded-full cursor-pointer whitespace-nowrap border ${tab === tb.id ? "bg-gold text-page border-gold" : "bg-transparent text-muted border-line"}`}>{tb.label}</button>
            ))}
          </div>

          {tab === "coffees" && (
            <div>
              <button onClick={onNewCoffee} className="w-full bg-gold text-page border-none p-3.5 font-sans text-[11px] font-semibold tracking-[0.16em] cursor-pointer mb-4 flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg> AGREGAR CAFÉ
              </button>
              {coffees.length === 0 ? (
                <EmptyState title="Aún no tienes cafés" message="Publica tu primer café para que aparezca en el marketplace." ctaLabel="AGREGAR MI PRIMER CAFÉ" onCta={onNewCoffee}/>
              ) : coffees.map(c => {
                const soldOut = (c.stock ?? 1) <= 0;
                const lowStock = !soldOut && (c.stock ?? 99) <= 5;
                return (
                  <div key={c.id} className="flex gap-3 py-3 border-b border-line-soft items-center">
                    <div className="w-12 h-16 shrink-0 flex items-center justify-center" style={{ background: c.imageUrl ? `url(${c.imageUrl}) center/cover` : c.img }}>
                      {!c.imageUrl && <div className="w-7 h-[42px] rounded-[2px]" style={{ background: c.bean }}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="font-serif text-base text-ink font-medium whitespace-nowrap overflow-hidden text-ellipsis">{c.name}</div>
                        {c.draft && <span className="font-sans text-[8px] px-1.5 py-0.5 bg-surface-2 text-gold tracking-[0.12em] border border-gold">BORRADOR</span>}
                      </div>
                      <div className="font-sans text-[11px] text-muted">{c.variety} · {c.weight} · {soldOut ? <span className="text-[#d77]">Agotado</span> : <span className={lowStock ? "text-[#e6b04c]" : "text-muted"}>{c.stock} en stock</span>}</div>
                      <div className="font-serif text-[15px] text-gold mt-0.5">{fmt(c.price)}</div>
                    </div>
                    <button onClick={() => onEditCoffee(c)} className="bg-transparent border border-line text-ink px-3 py-[7px] font-sans text-[10px] font-semibold tracking-[0.1em] cursor-pointer">EDITAR</button>
                    <button onClick={() => { if (confirm(`¿Eliminar "${c.name}"?`)) onDeleteCoffee(c.id); }} aria-label="Eliminar café" className="bg-none border-none text-dim cursor-pointer p-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5h6v2M7 7l1 12h8l1-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "orders" && (
            <div>
              <SalesSummary orders={sellerOrders}/>
              {sellerOrders.length === 0 ? (
                <EmptyState title="Sin pedidos todavía" message="Cuando alguien compre tus cafés, los pedidos aparecerán aquí con su estado y total."/>
              ) : (
                <div className="flex flex-col gap-3">
                  {sellerOrders.map(o => <OrderCard key={o.id} order={o} onAdvance={onAdvanceOrder}/>)}
                </div>
              )}
            </div>
          )}

          {tab === "finca" && <FincaEditor seller={seller} onUpdate={onUpdateSeller} onOpenFarm={() => onOpenFarm(seller.fincaName)} onReset={onReset} onRequestVerification={onRequestVerification}/>}
        </div>
      )}
    </div>
  );
}
