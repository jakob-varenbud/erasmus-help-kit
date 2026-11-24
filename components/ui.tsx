import type { ReactNode } from "react";

export function PageTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{children}</h1>
      {subtitle && <p className="mt-1 text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}

/** Two columns on desktop (map | content), stacked on mobile. */
export function MapLayout({ map, children }: { map: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="lg:sticky lg:top-24 lg:self-start">{map}</div>
      <div className="min-w-0 space-y-6">{children}</div>
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "red" | "blue" }) {
  const tones = {
    gray: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    red: "bg-rose-50 text-rose-800 ring-rose-200",
    blue: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const cls =
    variant === "primary"
      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
      : "bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50";
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${cls}`}>
      {children}
    </button>
  );
}

export function Loading() {
  return (
    <div className="space-y-3" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-slate-600">{children}</p>;
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
  "rounded-lg border-0 bg-white px-3 py-2 text-base font-normal text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600";

/** Shared class names used across pages. */
export const card = "rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-slate-300";
export const filterBox = "mb-5 grid gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-2";
export const detailBox = "mt-3 rounded-xl bg-slate-50 p-4 text-sm";
export const linkText = "font-semibold text-indigo-700 hover:text-indigo-900 hover:underline";
