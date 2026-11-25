import type { ReactNode } from "react";

export function PageTitle({ children, subtitle, eyebrow }: { children: ReactNode; subtitle?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-indigo-700">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{children}</h1>
      {subtitle && <p className="mt-2 max-w-3xl text-lg text-slate-700">{subtitle}</p>}
    </div>
  );
}

/** Two columns on desktop (side | content), stacked on mobile. */
export function MapLayout({ map, children }: { map: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-2">{map}</div>
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}

export function Panel({
  title,
  children,
  action,
  id,
  step,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  id?: string;
  step?: number;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-900">
          {step !== undefined && (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-600 text-base font-bold text-white" aria-hidden>
              {step}
            </span>
          )}
          {step !== undefined && <span className="sr-only">Step {step}: </span>}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "red" | "blue" | "amber" }) {
  const tones = {
    gray: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    red: "bg-rose-50 text-rose-800 ring-rose-200",
    blue: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    amber: "bg-amber-50 text-amber-900 ring-amber-200",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  pressed,
  label,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  pressed?: boolean;
  label?: string;
  className?: string;
}) {
  const cls = {
    primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
    secondary: "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50",
    ghost: "text-indigo-700 hover:bg-indigo-50",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={label}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${cls} ${className}`}
    >
      {children}
    </button>
  );
}

/** Toggle chip for quick filters – always visible, so users don't have to open a filter menu. */
export function Chip({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:ring-slate-400"
      }`}
    >
      {active && <span aria-hidden>✓</span>}
      {children}
    </button>
  );
}

export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-slate-600">{label}:</span>
      {children}
    </div>
  );
}

export function Callout({ children, tone = "blue", title }: { children: ReactNode; tone?: "blue" | "amber" | "green" | "red"; title?: string }) {
  const tones = {
    blue: "bg-indigo-50 ring-indigo-200 text-indigo-950",
    amber: "bg-amber-50 ring-amber-200 text-amber-950",
    green: "bg-emerald-50 ring-emerald-200 text-emerald-950",
    red: "bg-rose-50 ring-rose-200 text-rose-950",
  };
  return (
    <div className={`rounded-xl p-4 ring-1 ring-inset ${tones[tone]}`}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </div>
  );
}

export function Loading() {
  return (
    <div className="space-y-3" aria-label="Loading" role="status">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-600">{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-11 rounded-lg border-0 bg-white px-3 py-2 text-base font-normal text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600";

/**
 * Links are always underlined (test users did not recognise plain coloured text as a link).
 * External links get an arrow icon and a hint for screen readers.
 */
export const linkClass =
  "font-semibold text-indigo-700 underline decoration-indigo-400 decoration-2 underline-offset-4 hover:text-indigo-900 hover:decoration-indigo-800";

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      <span className="whitespace-nowrap">
        {children}
        <span aria-hidden className="ml-0.5 inline-block no-underline">↗</span>
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Small chevron for expand / collapse buttons. */
export function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}
