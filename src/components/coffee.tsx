import { useState } from "react";
import { STORIES } from "../data";
import { fmt, fmtDate, storyFor } from "../lib";
import type { CartItem, Coffee, Customer, Order, Review, Seller } from "../types";
import { EmptyState, PaqarinaMark, SectionHeader, Stars, Textarea, VerifiedBadge } from "./atoms";
import { CategoryChips, Hero } from "./chrome";

interface CoffeeListHandlers {
  onAdd: (c: Coffee) => void;
  onOpen: (c: Coffee) => void;
  favorites: string[];
  onToggleFav: (id: string) => void;
}

export function CoffeeCard({ coffee, onAdd, onOpen, isFav, onToggleFav }: { coffee: Coffee; onAdd: (c: Coffee) => void; onOpen: () => void; isFav: boolean; onToggleFav: (id: string) => void }) {
  const soldOut = (coffee.stock ?? 1) <= 0;
  const lowStock = !soldOut && (coffee.stock ?? 99) <= 5;
  const cover = coffee.imageUrl ? `url(${coffee.imageUrl}) center/cover` : coffee.img;
  return (
    <div onClick={onOpen} className={`bg-surface border border-line-soft cursor-pointer relative overflow-hidden ${soldOut ? "opacity-[0.65]" : ""}`}>
      <div className="h-[200px] relative flex items-end p-3.5" style={{ background: cover }}>
        <button onClick={e => { e.stopPropagation(); onToggleFav && onToggleFav(coffee.id); }} aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"} className={`absolute top-[42px] right-3 bg-black/55 border w-[30px] h-[30px] rounded-full cursor-pointer flex items-center justify-center p-0 ${isFav ? "border-gold text-gold" : "border-[rgba(245,239,227,0.25)] text-[rgba(245,239,227,0.85)]"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"}>
            <path d="M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
        </button>
        {!coffee.imageUrl && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92px] h-[124px] rounded-[4px_4px_6px_6px] shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_-8px_12px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center py-2.5 px-1.5 text-gold" style={{ background: `linear-gradient(180deg,${coffee.bean}f0 0%,${coffee.bean} 100%)` }}>
            <PaqarinaMark size={18}/>
            <div className="font-serif text-[10px] mt-1.5 tracking-[0.1em] text-center opacity-85">{(coffee.variety || "").toUpperCase()}</div>
            <div className="w-[22px] h-px bg-gold opacity-50 my-1 inline-block"/>
            <div className="font-sans text-[7px] tracking-[0.2em] opacity-60">{coffee.weight}</div>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-[8px] text-[#F5EFE3] px-2.5 py-1 text-[9px] font-sans font-semibold tracking-[0.12em]">{(coffee.tag || "").toUpperCase()}</div>
        <div className="absolute top-3 right-3 bg-gold text-page px-2 py-1 text-[10px] font-serif font-semibold">{coffee.score} SCA</div>
        {coffee.draft && <div className="absolute bottom-3 left-3 bg-[#0E0B08E6] text-ink px-2 py-[3px] text-[9px] font-sans font-semibold tracking-[0.14em] border border-gold">BORRADOR</div>}
        {!coffee.draft && coffee.bySeller && <div className="absolute bottom-3 right-3 bg-[#0E0B08DD] text-gold px-2 py-[3px] text-[8px] font-sans font-semibold tracking-[0.14em] border border-line">{coffee.isCurator ? "TU MARCA" : "TU FINCA"}</div>}
      </div>
      <div className="px-3.5 pt-3.5 pb-4">
        <div className="font-sans text-[9px] tracking-[0.18em] text-dim uppercase mb-1">{coffee.region}</div>
        <h3 className="font-serif text-[22px] font-medium text-ink m-0 leading-[1.1]">{coffee.name}</h3>
        <div className="font-sans text-[11px] text-muted mt-1 italic flex items-center gap-1.5">
          <span>por {coffee.farmer}</span>
          {coffee.verified && <VerifiedBadge size={12}/>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {(coffee.notes || []).map(n => <span key={n} className="text-[10px] font-sans px-2 py-[3px] border border-line text-muted rounded-full">{n}</span>)}
        </div>
        <div className="mt-3.5 flex items-center justify-between">
          <div>
            <div className="font-serif text-xl text-gold font-medium">{fmt(coffee.price)}</div>
            <div className={`text-[9px] font-sans tracking-[0.1em] ${soldOut ? "text-[#d77]" : lowStock ? "text-[#e6b04c]" : "text-dim"}`}>
              {soldOut ? "AGOTADO" : lowStock ? `¡SOLO ${coffee.stock} DISPONIBLE${coffee.stock === 1 ? "" : "S"}!` : `${coffee.weight} · ${coffee.fresh}`}
            </div>
          </div>
          <button disabled={soldOut} onClick={e => { e.stopPropagation(); onAdd(coffee); }} aria-label={soldOut ? "Agotado" : "Agregar al carrito"} className={`border-none w-[38px] h-[38px] flex items-center justify-center rounded-full ${soldOut ? "bg-surface-2 text-dim cursor-not-allowed" : "bg-gold text-page cursor-pointer"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CoffeeList({ coffees, onAdd, onOpen, favorites, onToggleFav }: { coffees: Coffee[] } & CoffeeListHandlers) {
  const favs = favorites || [];
  return (
    <div className="flex flex-col gap-3.5">
      {coffees.map(c => <CoffeeCard key={c.id} coffee={c} onAdd={onAdd} onOpen={() => onOpen(c)} isFav={favs.includes(c.id)} onToggleFav={onToggleFav}/>)}
    </div>
  );
}

export function ProducerStories({ onSeeAll }: { onSeeAll: () => void }) {
  return (
    <div className="bg-page pt-5 pb-2">
      <div className="px-[22px] pb-3 flex items-center justify-between">
        <div>
          <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1">HISTORIAS</div>
          <h2 className="font-serif text-2xl font-medium text-ink m-0 leading-none">Detrás del grano</h2>
        </div>
        <span onClick={onSeeAll} className="font-sans text-[11px] text-muted cursor-pointer">Ver todas →</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pt-1 px-[22px] pb-4 [scrollbar-width:none]">
        {STORIES.map(s => (
          <div key={s.id} className="shrink-0 text-center cursor-pointer">
            <div className="w-[74px] h-[74px] rounded-full border-2 border-gold box-border flex items-center justify-center relative" style={{ background: s.img }}>
              <div className="w-[88%] h-[88%] rounded-full border-2 border-page" style={{ background: s.img }}/>
            </div>
            <div className="mt-2 font-sans text-[10px] text-ink font-medium">{s.name}</div>
            <div className="font-serif text-[10px] text-dim italic">{s.farm}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OriginMap() {
  const points = [
    { x: 28, y: 38, label: "Cauca", n: 12 }, { x: 48, y: 26, label: "Huila", n: 24 },
    { x: 38, y: 14, label: "Caldas", n: 8 }, { x: 56, y: 46, label: "Nariño", n: 6 },
    { x: 42, y: 32, label: "Tolima", n: 14 }, { x: 34, y: 22, label: "Cundi.", n: 4 },
  ];
  return (
    <div className="my-6 mx-[18px] bg-surface border border-line p-[22px] relative overflow-hidden">
      <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1.5">ORIGEN</div>
      <h3 className="font-serif text-[22px] font-medium text-ink mt-0 mb-1 leading-[1.1]">De la montaña a tu taza</h3>
      <p className="font-sans text-[11px] text-muted mt-1.5 mb-4 leading-[1.5]">68 fincas activas en 6 departamentos cafeteros</p>
      <svg viewBox="0 0 100 70" className="w-full h-[180px]">
        <path d="M 30 8 L 48 6 L 58 14 L 62 24 L 60 34 L 64 42 L 60 52 L 52 60 L 44 62 L 36 58 L 28 50 L 22 38 L 24 26 L 28 16 Z" fill="var(--color-surface-2)" stroke="var(--color-line)" strokeWidth="0.3"/>
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="var(--color-gold)" opacity="0.25"/>
            <circle cx={p.x} cy={p.y} r="1.2" fill="var(--color-gold)"/>
            <text x={p.x + 3.5} y={p.y + 0.8} fontSize="2.4" fill="var(--color-ink)" fontFamily="var(--font-sans)" fontWeight="500">{p.label}</text>
            <text x={p.x + 3.5} y={p.y + 3.4} fontSize="1.8" fill="var(--color-dim)" fontFamily="var(--font-sans)">{p.n} cafés</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- Reseñas en el detalle del producto ---------- */
export function ReviewSection({ coffee, reviews, orders, customer, onAddReview }: { coffee: Coffee; reviews: Review[]; orders: Order[]; customer: Customer | null; onAddReview: (r: Partial<Review>) => void }) {
  const coffeeReviews = reviews.filter(r => r.coffeeId === coffee.id);
  const avg = coffeeReviews.length ? coffeeReviews.reduce((s, r) => s + r.rating, 0) / coffeeReviews.length : 0;
  const alreadyReviewed = customer && coffeeReviews.some(r => r.customerEmail === customer.email);
  const hasBought = customer && orders.some(o => o.byUser && o.customer?.email === customer.email && o.items.some(i => i.id === coffee.id));
  const canReview = hasBought && !alreadyReviewed;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const submit = () => {
    if (!rating || !comment.trim()) return;
    onAddReview({ coffeeId: coffee.id, rating, comment: comment.trim(), customerName: customer.name, customerEmail: customer.email });
    setRating(5); setComment("");
  };
  return (
    <div className="mt-7">
      <div className="flex items-center justify-between mb-3">
        <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold">RESEÑAS</div>
        {coffeeReviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars value={Math.round(avg)} size={14}/>
            <span className="font-serif text-sm text-ink">{avg.toFixed(1)}</span>
            <span className="font-sans text-[10px] text-dim">({coffeeReviews.length})</span>
          </div>
        )}
      </div>
      {coffeeReviews.length === 0
        ? <div className="font-sans text-xs text-muted italic">Aún no hay reseñas. {hasBought ? "Sé el primero en reseñar este café." : "Compra este café para dejar tu reseña."}</div>
        : (
          <div className="flex flex-col gap-3.5">
            {coffeeReviews.slice(0, 5).map(r => (
              <div key={r.id} className="py-3 px-3.5 bg-surface border border-line-soft">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="font-sans text-xs text-ink font-semibold">{r.customerName}</div>
                  <Stars value={r.rating} size={12}/>
                </div>
                <div className="font-serif text-sm text-ink leading-[1.45] italic">"{r.comment}"</div>
                <div className="font-sans text-[10px] text-dim mt-1.5">{fmtDate(r.date)}</div>
              </div>
            ))}
          </div>
        )}
      {canReview && (
        <div className="mt-[18px] p-3.5 bg-surface border border-line">
          <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2">ESCRIBE TU RESEÑA</div>
          <div className="flex items-center gap-2 mb-2.5">
            <Stars value={rating} size={20} onChange={setRating}/>
            <span className="font-serif text-sm text-muted">{rating}/5</span>
          </div>
          <Textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="¿Cómo te pareció en taza? ¿Lo recomendarías?"/>
          <button onClick={submit} disabled={!comment.trim()} className={`mt-2.5 w-full border-none p-3 font-sans text-[11px] font-semibold tracking-[0.18em] ${comment.trim() ? "bg-gold text-page cursor-pointer" : "bg-surface-2 text-dim cursor-not-allowed"}`}>PUBLICAR RESEÑA</button>
        </div>
      )}
      {alreadyReviewed && <div className="mt-3 font-sans text-[11px] text-muted italic">Ya publicaste una reseña de este café. ¡Gracias!</div>}
    </div>
  );
}

export function ProductDetail({ coffee, onBack, onAdd, onOpenFarm, isFav, onToggleFav, seller, reviews, orders, customer, onAddReview }: {
  coffee: Coffee; onBack: () => void; onAdd: (c: CartItem) => void; onOpenFarm: (name: string) => void;
  isFav: boolean; onToggleFav: (id: string) => void; seller: Seller | null;
  reviews: Review[]; orders: Order[]; customer: Customer | null; onAddReview: (r: Partial<Review>) => void;
}) {
  const [qty, setQty] = useState(1);
  const [grind, setGrind] = useState("Grano entero");
  const grinds = ["Grano entero", "Espresso", "V60", "Prensa francesa", "Aeropress"];
  const stock = coffee.stock ?? 99;
  const soldOut = stock <= 0;
  const cappedQty = Math.min(qty, Math.max(1, stock));
  const story = storyFor(coffee, seller);
  return (
    <div className="anim-slide-up absolute inset-0 bg-page z-[60] flex flex-col overflow-hidden">
      <div className="py-3 px-[18px] flex items-center justify-between border-b border-line shrink-0 bg-page">
        <button onClick={onBack} className="bg-none border-none text-ink cursor-pointer p-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <PaqarinaMark size={20}/>
        <button onClick={() => onToggleFav && onToggleFav(coffee.id)} aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"} className={`bg-none border-none cursor-pointer p-1.5 ${isFav ? "text-gold" : "text-muted"}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"}>
            <path d="M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="h-[320px] flex items-center justify-center" style={{ background: coffee.imageUrl ? `url(${coffee.imageUrl}) center/cover` : coffee.img }}>
          {!coffee.imageUrl && (
            <div className="w-[150px] h-[200px] rounded-[6px_6px_10px_10px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-[18px] text-gold" style={{ background: `linear-gradient(180deg,${coffee.bean}f0 0%,${coffee.bean} 100%)` }}>
              <PaqarinaMark size={32}/>
              <div className="font-serif text-base mt-3 tracking-[0.12em] text-center">{(coffee.variety || "").toUpperCase()}</div>
              <div className="w-8 h-px bg-gold opacity-50 my-2 inline-block"/>
              <div className="font-sans text-[9px] tracking-[0.24em] opacity-70">{coffee.weight}</div>
            </div>
          )}
        </div>
        <div className="pt-6 px-[22px] pb-[120px]">
          <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2">{(coffee.tag || "").toUpperCase()} · {coffee.score} SCA</div>
          <h1 className="font-serif text-4xl font-medium text-ink m-0 leading-none">{coffee.name}</h1>
          <div className="font-serif text-[15px] italic text-muted mt-1.5 flex items-center flex-wrap gap-1.5">
            <span onClick={() => onOpenFarm(coffee.farm)} className="cursor-pointer text-gold border-b border-line">{coffee.farm}</span>
            {coffee.verified && <VerifiedBadge size={14}/>}
            <span>· {coffee.region}</span>
          </div>
          <div className={`mt-2.5 font-sans text-[11px] tracking-[0.06em] ${soldOut ? "text-[#d77]" : stock <= 5 ? "text-[#e6b04c]" : "text-muted"}`}>
            {soldOut ? "AGOTADO" : `${stock} disponible${stock === 1 ? "" : "s"} en este lote`}
          </div>
          <div className="mt-6 py-5 border-t border-b border-line">
            <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold mb-3">NOTAS DE CATA</div>
            <div className="flex flex-wrap gap-2">
              {(coffee.notes || []).map(n => <div key={n} className="font-serif text-[22px] font-medium italic text-gold">{n}</div>)}
            </div>
          </div>
          <div className="mt-6">
            <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold mb-3.5">TRAZABILIDAD</div>
            <div className="grid grid-cols-2 gap-4">
              {[["Caficultor", coffee.farmer], ["Variedad", coffee.variety], ["Proceso", coffee.process], ["Altitud", coffee.altitude], ["Tueste", coffee.roast], ["Frescura", coffee.fresh]].map(([k, v]) => (
                <div key={k}>
                  <div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-1">{k}</div>
                  <div className="font-serif text-[15px] text-ink font-medium">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7 p-5 bg-surface border border-line-soft">
            <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2.5">{coffee.isCurator ? "SOBRE LA MARCA" : "HISTORIA DEL PRODUCTOR"}</div>
            <p className="font-serif text-[15px] leading-[1.55] text-ink m-0 italic">"{story}"</p>
            <div className="mt-3 font-sans text-[11px] text-muted">— {coffee.farmer}, {coffee.farm}</div>
          </div>
          <div className="mt-7">
            <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold mb-3">MOLIENDA</div>
            <div className="flex flex-wrap gap-1.5">
              {grinds.map(g => <button key={g} onClick={() => setGrind(g)} className={`font-sans text-[11px] py-2 px-3 cursor-pointer border ${grind === g ? "bg-gold text-page border-gold" : "bg-transparent text-ink border-line"}`}>{g}</button>)}
            </div>
          </div>
          <ReviewSection coffee={coffee} reviews={reviews || []} orders={orders || []} customer={customer} onAddReview={onAddReview}/>
        </div>
      </div>
      <div className="pt-3.5 px-[22px] pb-[18px] border-t border-line bg-page flex items-center gap-3.5 shrink-0">
        <div>
          <div className="text-[9px] font-sans text-dim tracking-[0.16em]">TOTAL</div>
          <div className="font-serif text-[22px] text-gold font-medium">{fmt(coffee.price * cappedQty)}</div>
        </div>
        <div className="flex items-center gap-3 border border-line py-0.5 px-2">
          <button onClick={() => setQty(Math.max(1, cappedQty - 1))} className="bg-none border-none text-ink text-lg cursor-pointer w-6">−</button>
          <span className="font-serif text-lg text-ink min-w-3.5 text-center">{cappedQty}</span>
          <button onClick={() => setQty(Math.min(stock, cappedQty + 1))} disabled={cappedQty >= stock} className={`bg-none border-none text-lg w-6 ${cappedQty >= stock ? "text-dim cursor-not-allowed" : "text-ink cursor-pointer"}`}>+</button>
        </div>
        <button disabled={soldOut} onClick={() => { onAdd({ ...coffee, qty: cappedQty, grind }); onBack(); }} className={`flex-1 border-none p-3.5 font-sans text-[11px] font-semibold tracking-[0.18em] ${soldOut ? "bg-surface-2 text-dim cursor-not-allowed" : "bg-gold text-page cursor-pointer"}`}>
          {soldOut ? "AGOTADO" : "AGREGAR AL CARRITO"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Screens de catálogo ---------- */
interface CatalogProps extends CoffeeListHandlers {
  coffees: Coffee[];
  activeCat: string;
  setActiveCat: (c: string) => void;
  onOpenFilters: () => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

function FiltersButton({ onOpenFilters, hasActiveFilters }: { onOpenFilters: () => void; hasActiveFilters: boolean }) {
  return (
    <button onClick={onOpenFilters} className={`bg-none border-none font-sans text-[11px] cursor-pointer p-1 flex items-center gap-1.5 ${hasActiveFilters ? "text-gold" : "text-muted"}`}>
      Filtros ↓{hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block"/>}
    </button>
  );
}

export function HomeScreen({ coffees, activeCat, setActiveCat, onAdd, onOpen, onExplore, onFarms, onCurators, favorites, onToggleFav, onOpenFilters, hasActiveFilters, onClearAll }: CatalogProps & { onExplore: () => void; onFarms: () => void; onCurators: () => void }) {
  return (
    <>
      <Hero onExplore={onExplore} onFarms={onFarms} onCurators={onCurators}/>
      <CategoryChips active={activeCat} setActive={setActiveCat}/>
      <div id="home-catalog" className="pt-2 px-[18px] pb-1 scroll-mt-2">
        <SectionHeader kicker="SELECCIÓN ACTIVA" title={`${coffees.length} cafés disponibles`} right={<FiltersButton onOpenFilters={onOpenFilters} hasActiveFilters={hasActiveFilters}/>}/>
        {coffees.length === 0
          ? <EmptyState title="Sin resultados" message="No encontramos cafés que coincidan con tu búsqueda o filtros." ctaLabel="LIMPIAR TODO" onCta={onClearAll}/>
          : <CoffeeList coffees={coffees} onAdd={onAdd} onOpen={onOpen} favorites={favorites} onToggleFav={onToggleFav}/>}
      </div>
      <ProducerStories onSeeAll={onFarms}/>
      <OriginMap/>
      <div className="pt-8 px-[22px] pb-6 text-center border-t border-line">
        <img src="/logo-paqarina-full.png" alt="Paqarina Coffee — Café de especialidad" className="h-16 w-auto mx-auto select-none" draggable={false}/>
        <div className="mt-3.5 font-serif italic text-[13px] text-muted">"Café de especialidad colombiano."</div>
        <div className="mt-[18px] font-sans text-[9px] tracking-[0.28em] text-dim">BOGOTÁ · COLOMBIA — MMXXVI</div>
      </div>
    </>
  );
}

export function CatalogScreen({ coffees, activeCat, setActiveCat, onAdd, onOpen, favorites, onToggleFav, onOpenFilters, hasActiveFilters, onClearAll }: CatalogProps) {
  return (
    <>
      <div className="pt-[22px] px-[18px] pb-1.5">
        <SectionHeader kicker="CATÁLOGO" title={`${coffees.length} cafés`} right={<FiltersButton onOpenFilters={onOpenFilters} hasActiveFilters={hasActiveFilters}/>}/>
      </div>
      <CategoryChips active={activeCat} setActive={setActiveCat}/>
      <div className="pt-3 px-[18px] pb-7">
        {coffees.length === 0
          ? <EmptyState title="Sin resultados" message="Ajusta tu búsqueda, categoría o filtros." ctaLabel="LIMPIAR TODO" onCta={onClearAll}/>
          : <CoffeeList coffees={coffees} onAdd={onAdd} onOpen={onOpen} favorites={favorites} onToggleFav={onToggleFav}/>}
      </div>
    </>
  );
}
