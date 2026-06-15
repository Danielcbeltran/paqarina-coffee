import { useEffect } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { Toast as ToastData } from "../types";

/* La Q serif de Paqarina: bowl con contraste de trazo (lados gruesos), diamante
   central y cola caligráfica que barre a la derecha (guiño al grano de café).
   Misma geometría que el favicon/avatar y la Q del wordmark oficial. */
export function PaqarinaMark({ size = 24, color = "var(--color-gold)", style = {} }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 92 82" style={style} aria-hidden="true" fill={color}>
      <path fillRule="evenodd" d="M11,40 a29,29 0 1,0 58,0 a29,29 0 1,0 -58,0 Z M20.5,38.5 a21,23 0 1,0 42,0 a21,23 0 1,0 -42,0 Z"/>
      <path d="M40 34 L44 39 L40 44 L36 39 Z"/>
      <path d="M40 67 C 54 69 67 68 80 61 C 69 68 54 73 40 71 Z"/>
    </svg>
  );
}

/* El wordmark "PAQARINA COFFEE" se renderiza con el PNG oficial
   (public/logo-paqarina.png / logo-paqarina-full.png), no con vector. */

/* ---------- Form fields ---------- */
const inputCls = "w-full bg-surface border border-line text-ink px-3 py-[10px] font-sans text-[13px] outline-none rounded-[2px]";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls}/>;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-y`}/>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="font-sans text-[9px] tracking-[0.2em] text-dim uppercase font-semibold block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function VerifiedBadge({ size = 14, title = "Verificado por Paqarina" }: { size?: number; title?: string }) {
  return (
    <span title={title} aria-label={title} className="inline-flex items-center justify-center rounded-full bg-gold text-page shrink-0" style={{ width: size, height: size }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
}

export function PillSelect({ options, value, onChange, multi = false }: { options: string[]; value: string | string[]; onChange: (option: string) => void; multi?: boolean }) {
  const isActive = (o: string) => multi ? (value as string[]).includes(o) : value === o;
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)} className={`font-sans text-[11px] px-3 py-[7px] rounded-full cursor-pointer border ${isActive(o) ? "bg-gold text-page border-gold" : "bg-transparent text-ink border-line"}`}>{o}</button>
      ))}
    </div>
  );
}

/* ---------- Toast ---------- */
export function Toast({ toast, onDone }: { toast: ToastData; onDone: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDone, 2200);
    return () => clearTimeout(id);
  }, [toast, onDone]);
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" className="anim-toast-in absolute top-16 left-1/2 -translate-x-1/2 bg-surface text-ink border border-gold px-4 py-2.5 font-sans text-xs font-medium tracking-[0.04em] z-[200] shadow-[0_12px_30px_rgba(0,0,0,0.45)] max-w-[82%] text-center rounded-[2px]">
      {toast.text}
    </div>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({ title, message, ctaLabel, onCta }: { title: string; message?: string; ctaLabel?: string; onCta?: () => void }) {
  return (
    <div className="text-center px-6 py-12">
      <PaqarinaMark size={42} style={{ margin: "0 auto 16px", display: "block" }}/>
      <div className="font-serif text-[22px] text-ink font-medium">{title}</div>
      {message && <p className="font-sans text-[13px] text-muted mt-2 leading-[1.5]">{message}</p>}
      {ctaLabel && onCta && (
        <button onClick={onCta} className="mt-[18px] bg-gold text-page border-none px-[22px] py-3 font-sans text-[11px] font-semibold tracking-[0.18em] cursor-pointer hover:opacity-90 transition-opacity">{ctaLabel}</button>
      )}
    </div>
  );
}

export function SectionHeader({ kicker, title, right }: { kicker: string; title: string; right?: ReactNode }) {
  return (
    <div className="flex justify-between items-baseline mb-4">
      <div>
        <div className="font-sans text-[9px] tracking-[0.28em] text-gold font-semibold mb-1">{kicker}</div>
        <h2 className="font-serif text-[26px] font-medium text-ink m-0 leading-none">{title}</h2>
      </div>
      {right}
    </div>
  );
}

/* ---------- Stars (lectura + selección) ---------- */
export function Stars({ value, size = 14, onChange }: { value: number; size?: number; onChange?: (n: number) => void }) {
  const interactive = typeof onChange === "function";
  return (
    <span role={interactive ? "radiogroup" : "img"} aria-label={`${value} de 5 estrellas`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => {
        const filled = value >= n;
        const star = (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "var(--color-gold)" : "none"} aria-hidden="true">
            <path d="M12 3l2.6 5.5 6 .7-4.4 4.2 1.1 5.9L12 16.6 6.7 19.3l1.1-5.9L3.4 9.2l6-.7L12 3z" stroke={filled ? "var(--color-gold)" : "var(--color-line)"} strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        );
        return interactive
          ? <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} estrella${n > 1 ? "s" : ""}`} className="bg-none border-none p-0 cursor-pointer leading-none">{star}</button>
          : <span key={n}>{star}</span>;
      })}
    </span>
  );
}
