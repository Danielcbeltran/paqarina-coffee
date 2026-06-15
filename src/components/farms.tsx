import type { CartItem, Coffee, FincaEntity } from "../types";
import { SectionHeader, VerifiedBadge } from "./atoms";
import { CoffeeList } from "./coffee";

function farmCover(finca: FincaEntity) {
  const firstWithImg = finca.coffees.find(c => c.imageUrl);
  return firstWithImg ? `url(${firstWithImg.imageUrl}) center/cover` : (finca.coffees[0]?.img || "linear-gradient(135deg,#9A6B43,#4A2D1A)");
}

export function FarmCard({ finca, onOpen }: { finca: FincaEntity; onOpen: () => void }) {
  const isCurador = finca.kind === "curador";
  return (
    <div onClick={onOpen} className="bg-surface border border-line-soft cursor-pointer overflow-hidden">
      <div className="h-24 relative flex items-end p-3" style={{ background: farmCover(finca) }}>
        {finca.isSeller && <div className="absolute top-2.5 right-2.5 bg-gold text-page px-2 py-[3px] text-[8px] font-sans font-bold tracking-[0.14em]">{isCurador ? "TU MARCA" : "TU FINCA"}</div>}
      </div>
      <div className="pt-3 px-3.5 pb-3.5">
        <div className="font-sans text-[9px] tracking-[0.18em] text-dim uppercase">{finca.region}</div>
        <h3 className="font-serif text-xl font-medium text-ink mt-0.5 mb-0 leading-[1.1] flex items-center gap-1.5">
          {finca.name}
          {finca.verified && <VerifiedBadge size={14}/>}
        </h3>
        <div className="font-sans text-[11px] text-muted mt-[3px] italic">{isCurador ? "Tostado por " : ""}{finca.farmer}</div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-sans text-[10px] text-gold tracking-[0.08em]">{finca.coffees.length} café(s)</span>
          <span className="font-sans text-[11px] text-muted">Ver perfil →</span>
        </div>
      </div>
    </div>
  );
}

export function FarmsScreen({ fincas, onOpenFarm, kicker = "ORIGEN", title }: { fincas: FincaEntity[]; onOpenFarm: (name: string) => void; kicker?: string; title?: string }) {
  return (
    <div className="pt-[22px] px-[18px] pb-7">
      <SectionHeader kicker={kicker} title={title || `${fincas.length} fincas`}/>
      <div className="flex flex-col gap-3.5">
        {fincas.map(f => <FarmCard key={f.name} finca={f} onOpen={() => onOpenFarm(f.name)}/>)}
      </div>
    </div>
  );
}

export function FarmProfile({ finca, onBack, onAdd, onOpenCoffee, favorites, onToggleFav }: {
  finca: FincaEntity; onBack: () => void; onAdd: (c: Coffee | CartItem) => void;
  onOpenCoffee: (c: Coffee) => void; favorites: string[]; onToggleFav: (id: string) => void;
}) {
  const isCurador = finca.kind === "curador";
  const story = finca.story || (isCurador
    ? "Seleccionamos y tostamos café de especialidad bajo nuestra marca, cuidando cada perfil de taza."
    : "Cultivamos café de especialidad con prácticas sostenibles, cuidando cada etapa desde la semilla hasta la taza.");
  return (
    <div className="anim-slide-up absolute inset-0 bg-page z-[55] flex flex-col overflow-hidden">
      <div className="py-3 px-[18px] flex items-center justify-between border-b border-line shrink-0 bg-page">
        <button onClick={onBack} className="bg-none border-none text-ink cursor-pointer p-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <div className="font-serif text-base text-ink font-medium">{isCurador ? "Perfil de tostador" : "Perfil de finca"}</div>
        <div className="w-[34px]"/>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="h-[170px] relative flex items-end p-[18px]" style={{ background: farmCover(finca) }}>
          {finca.isSeller && <div className="absolute top-3.5 right-3.5 bg-gold text-page px-2.5 py-1 text-[9px] font-sans font-bold tracking-[0.14em]">{isCurador ? "TU MARCA" : "TU FINCA"}</div>}
          {finca.logoUrl && (
            <div className="w-[68px] h-[68px] rounded-xl bg-page border border-line flex items-center justify-center p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src={finca.logoUrl} alt={`Logo ${finca.name}`} className="max-w-full max-h-full object-contain"/>
            </div>
          )}
        </div>
        <div className="pt-[22px] px-[22px] pb-[110px]">
          <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-2">{finca.region}</div>
          <h1 className="font-serif text-[34px] font-medium text-ink m-0 leading-none flex items-center gap-2.5 flex-wrap">
            {finca.name}
            {finca.verified && <VerifiedBadge size={20}/>}
          </h1>
          <div className="font-serif text-[15px] italic text-muted mt-1.5">{isCurador ? "Tostado por " : ""}{finca.farmer}</div>
          {(finca.certifications && finca.certifications.length > 0) && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {finca.certifications.map(c => <span key={c} className="font-sans text-[10px] px-2.5 py-1 border border-gold text-gold rounded-full">{c}</span>)}
            </div>
          )}
          <div className="mt-5 py-[18px] border-t border-b border-line flex gap-6">
            {finca.altitude && <div><div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-1">{isCurador ? "Credencial" : "Altitud"}</div><div className="font-serif text-base text-ink">{finca.altitude}</div></div>}
            <div><div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-1">Cafés</div><div className="font-serif text-base text-ink">{finca.coffees.length}</div></div>
            {finca.joined && <div><div className="font-sans text-[9px] tracking-[0.16em] text-dim uppercase mb-1">Miembro desde</div><div className="font-serif text-base text-ink">{new Date(finca.joined).getFullYear()}</div></div>}
          </div>
          <p className="font-serif text-base leading-[1.55] text-ink mt-5 mb-0 italic">"{story}"</p>
          <div className="mt-7">
            <div className="font-sans text-[9px] tracking-[0.28em] text-dim font-semibold mb-3.5">{isCurador ? "CAFÉS DE ESTA MARCA" : "CAFÉS DE ESTA FINCA"}</div>
            {finca.coffees.length === 0
              ? <div className="font-sans text-[13px] text-muted">{isCurador ? "Esta marca aún no tiene cafés publicados." : "Esta finca aún no tiene cafés publicados."}</div>
              : <CoffeeList coffees={finca.coffees} onAdd={onAdd} onOpen={onOpenCoffee} favorites={favorites} onToggleFav={onToggleFav}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
