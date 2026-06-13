import { useState } from "react";
import { CATEGORIES, ROASTS, DEFAULT_FILTERS } from "../data";
import type { Customer, Filters, Seller } from "../types";
import { Field, Input, PillSelect } from "./atoms";

export function TopBar({ cartCount, onCart, onMenu, onSearch }: { cartCount: number; onCart: () => void; onMenu: () => void; onSearch: () => void }) {
  return (
    <div className="pt-[14px] px-[18px] pb-[10px] flex items-center justify-between bg-page border-b border-line shrink-0">
      <button onClick={onMenu} aria-label="Abrir menú" className="bg-none border-none p-1.5 cursor-pointer text-ink">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
      <img src="/logo-paqarina.png" alt="Paqarina Coffee" className="h-7 w-auto select-none" draggable={false}/>
      <div className="flex gap-1">
        <button onClick={onSearch} aria-label="Buscar" className="bg-none border-none p-1.5 cursor-pointer text-ink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
        <button onClick={onCart} aria-label={cartCount > 0 ? `Carrito (${cartCount})` : "Carrito"} className="bg-none border-none p-1.5 cursor-pointer text-ink relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1.5 10.5a2 2 0 01-2 1.5h-7a2 2 0 01-2-1.5L5 7z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6"/></svg>
          {cartCount > 0 && <span className="absolute top-0 right-0 bg-gold text-page text-[9px] font-bold font-sans min-w-4 h-4 rounded-lg flex items-center justify-center px-1">{cartCount}</span>}
        </button>
      </div>
    </div>
  );
}

export function Hero({ onExplore, onFarms, onCurators }: { onExplore: () => void; onFarms: () => void; onCurators: () => void }) {
  return (
    <div className="pt-8 px-[22px] pb-7 bg-page relative overflow-hidden">
      <div className="relative z-[1]">
        <div className="font-sans text-[10px] tracking-[0.32em] text-gold font-semibold mb-3.5 flex items-center gap-2.5">
          <span className="w-5 h-px bg-gold inline-block"/> COSECHA 2026
        </div>
        <h1 className="font-display text-[42px] leading-[1.02] font-medium text-ink m-0 tracking-[-0.01em]">
          El despertar<br/>de un <em className="text-gold italic">origen</em>.
        </h1>
        <p className="mt-4 font-sans text-sm leading-[1.55] text-muted max-w-[320px]">
          Paqarina Coffee conecta caficultores con quienes buscan el café como una experiencia.
        </p>
        <div className="mt-[22px] flex flex-col gap-2.5 items-start">
          <button onClick={onExplore} className="bg-gold text-page border-none px-[22px] py-3 font-sans text-xs font-semibold tracking-[0.16em] cursor-pointer">EXPLORAR CAFÉS</button>
          <div className="flex gap-2.5">
            <button onClick={onFarms} className="bg-transparent text-ink border border-line px-[18px] py-3 font-sans text-xs font-medium tracking-[0.16em] cursor-pointer">FINCAS</button>
            <button onClick={onCurators} className="bg-transparent text-ink border border-line px-[18px] py-3 font-sans text-xs font-medium tracking-[0.16em] cursor-pointer">TOSTADORES</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryChips({ active, setActive }: { active: string; setActive: (c: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-[18px] py-[14px] bg-page shrink-0 [scrollbar-width:none]">
      {CATEGORIES.map(c => {
        const on = active === c;
        return (
          <button key={c} onClick={() => setActive(c)} aria-pressed={on} className={`shrink-0 px-[14px] py-2 font-sans text-[11px] font-medium tracking-[0.1em] uppercase rounded-full cursor-pointer whitespace-nowrap border ${on ? "bg-gold text-page border-gold" : "bg-transparent text-muted border-line"} transition-colors`}>
            {c}
          </button>
        );
      })}
    </div>
  );
}

export function BottomNav({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  const items = [
    { id: "home", label: "Inicio" },
    { id: "shop", label: "Cafés" },
    { id: "farms", label: "Fincas" },
    { id: "curators", label: "Tostadores" },
    { id: "profile", label: "Tú" },
  ];
  const icons = {
    home: <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.6" fill="none"/>,
    shop: <><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" fill="none"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></>,
    farms: <path d="M12 3l9 6v12H3V9l9-6zm-3 18v-7h6v7" stroke="currentColor" strokeWidth="1.6" fill="none"/>,
    curators: <path d="M12 3l2.5 5.3 5.5.8-4 4 1 5.6-5-2.8-5 2.8 1-5.6-4-4 5.5-.8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>,
    profile: <><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6" stroke="currentColor" strokeWidth="1.6" fill="none"/></>,
  };
  return (
    <div className="bg-page/95 border-t border-line py-2.5 flex justify-around shrink-0">
      {items.map(it => {
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => setActive(it.id)} aria-current={on ? "page" : undefined} className={`bg-none border-none cursor-pointer flex flex-col items-center gap-1 py-1 px-1.5 transition-colors ${on ? "text-gold" : "text-muted"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24">{icons[it.id]}</svg>
            <span className="font-sans text-[8px] font-medium tracking-[0.06em] uppercase">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SideMenu({ onClose, onGo, cartCount, seller, hasSubscription, customer }: { onClose: () => void; onGo: (id: string) => void; cartCount: number; seller: Seller | null; hasSubscription: boolean; customer: Customer | null }) {
  const isSeller = !!seller;
  const sections = [
    { id: "home", label: "Inicio" },
    { id: "shop", label: "Cafés" },
    { id: "farms", label: "Fincas" },
    { id: "curators", label: "Tostadores" },
    { id: "profile", label: isSeller ? (seller.role === "curador" ? "Panel tostador" : "Panel productor") : "Tú" },
  ];
  const actions = [
    { id: "cart", label: "Mi carrito", badge: cartCount > 0 ? cartCount : null },
    { id: "subscription", label: hasSubscription ? "Mi suscripción" : "Caja del mes", badge: null },
  ];
  return (
    <div onClick={onClose} className="anim-fade-in absolute inset-0 bg-black/60 z-[80] flex">
      <nav onClick={e => e.stopPropagation()} aria-label="Menú principal" className="anim-slide-in-left w-[82%] max-w-[340px] bg-page border-r border-line flex flex-col overflow-y-auto">
        <div className="pt-[22px] px-[22px] pb-[18px] border-b border-line">
          <div className="flex justify-between items-start">
            <img src="/logo-paqarina.png" alt="Paqarina Coffee" className="h-7 w-auto select-none" draggable={false}/>
            <button onClick={onClose} aria-label="Cerrar menú" className="bg-none border-none text-muted cursor-pointer p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </div>
          {customer?.name
            ? <div className="mt-4 font-serif text-lg text-ink font-medium">Hola, {customer.name.split(" ")[0]}</div>
            : <div className="mt-4 font-serif text-lg text-ink font-medium italic">Bienvenido</div>}
        </div>

        <div className="py-3.5 flex-1">
          <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold pt-1.5 px-[22px] pb-2.5">NAVEGACIÓN</div>
          {sections.map(s => (
            <button key={s.id} onClick={() => onGo(s.id)} className="flex items-center justify-between w-full py-3.5 px-[22px] bg-transparent border-none text-ink font-serif text-lg cursor-pointer text-left">
              <span>{s.label}</span>
              <span className="text-dim font-sans text-xs">→</span>
            </button>
          ))}

          <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold pt-6 px-[22px] pb-2.5">ACCIONES</div>
          {actions.map(a => (
            <button key={a.id} onClick={() => onGo(a.id)} className="flex items-center justify-between w-full py-3.5 px-[22px] bg-transparent border-none text-ink font-serif text-lg cursor-pointer text-left">
              <span className="flex items-center gap-2.5">
                {a.label}
                {a.badge && <span className="bg-gold text-page text-[10px] font-sans font-bold min-w-5 h-5 rounded-[10px] inline-flex items-center justify-center px-1.5">{a.badge}</span>}
              </span>
              <span className="text-dim font-sans text-xs">→</span>
            </button>
          ))}
        </div>

        <div className="py-[18px] px-[22px] border-t border-line">
          <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold mb-1.5">PAQARINA COFFEE</div>
          <div className="font-serif text-[13px] italic text-muted">Café de especialidad</div>
        </div>
      </nav>
    </div>
  );
}

export function SearchBar({ value, onChange, onClose }: { value: string; onChange: (q: string) => void; onClose: () => void }) {
  return (
    <div className="px-[18px] py-2.5 bg-page border-b border-line flex items-center gap-2.5 shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted shrink-0"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      <input autoFocus type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Buscar por nombre, finca, región, notas..." aria-label="Buscar café" className="flex-1 bg-transparent border-none outline-none text-ink font-sans text-[13px]"/>
      <button onClick={onClose} aria-label="Cerrar búsqueda" className="bg-none border-none text-muted cursor-pointer p-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

export function FiltersPanel({ initial, onApply, onClose, onClear }: { initial: Filters; onApply: (f: Filters) => void; onClose: () => void; onClear: () => void }) {
  const [f, setF] = useState(initial);
  const set = (k: keyof Filters, v: unknown) => setF(p => ({ ...p, [k]: v }));
  const toggleRoast = (r: string) => setF(p => ({ ...p, roasts: p.roasts.includes(r) ? p.roasts.filter(x => x !== r) : [...p.roasts, r] }));
  return (
    <div onClick={onClose} className="anim-fade-in absolute inset-0 bg-black/60 z-[62] flex flex-col justify-end">
      <div onClick={e => e.stopPropagation()} className="anim-sheet-up bg-page border-t border-line pt-[18px] px-[22px] pb-[22px] max-h-[82%] overflow-y-auto">
        <div className="flex items-center justify-between mb-3.5">
          <div className="font-serif text-[22px] text-ink font-medium">Filtros</div>
          <button onClick={onClose} aria-label="Cerrar filtros" className="bg-none border-none text-muted cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio mínimo (COP)"><Input type="number" min="0" value={f.priceMin || ""} onChange={e => set("priceMin", Number(e.target.value) || 0)} placeholder="0"/></Field>
          <Field label="Precio máximo (COP)"><Input type="number" min="0" value={f.priceMax || ""} onChange={e => set("priceMax", Number(e.target.value) || 0)} placeholder="Sin límite"/></Field>
        </div>
        <Field label="Puntaje SCA mínimo"><Input type="number" min="0" max="100" value={f.scoreMin || ""} onChange={e => set("scoreMin", Number(e.target.value) || 0)} placeholder="Cualquiera"/></Field>
        <Field label="Tueste"><PillSelect options={ROASTS} value={f.roasts} onChange={toggleRoast} multi/></Field>
        <div className="flex gap-[18px] mt-1.5">
          <label className="flex items-center gap-2 font-sans text-xs text-ink cursor-pointer">
            <input type="checkbox" checked={f.onlyMicro} onChange={e => set("onlyMicro", e.target.checked)}/> Solo microlotes
          </label>
          <label className="flex items-center gap-2 font-sans text-xs text-ink cursor-pointer">
            <input type="checkbox" checked={f.onlyFairtrade} onChange={e => set("onlyFairtrade", e.target.checked)}/> Solo comercio justo
          </label>
        </div>
        <div className="flex gap-2.5 mt-5">
          <button onClick={() => { onClear(); setF(DEFAULT_FILTERS); }} className="flex-none bg-transparent text-ink border border-line py-3.5 px-[18px] font-sans text-[11px] font-semibold tracking-[0.16em] cursor-pointer">LIMPIAR</button>
          <button onClick={() => onApply(f)} className="flex-1 bg-gold text-page border-none p-3.5 font-sans text-[11px] font-semibold tracking-[0.18em] cursor-pointer">APLICAR</button>
        </div>
      </div>
    </div>
  );
}
