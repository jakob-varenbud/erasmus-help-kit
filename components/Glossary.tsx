"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { glossary, type GlossaryKey } from "@/lib/glossary";

/**
 * A term with a dotted underline. Click / Enter shows a short explanation.
 * Added after the user test: participants did not know what an "Online Learning Agreement" is.
 */
export function Term({ k, children }: { k: GlossaryKey; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();
  const entry = glossary[k];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="cursor-help font-medium underline decoration-indigo-400 decoration-dotted decoration-2 underline-offset-4 hover:decoration-indigo-700"
      >
        {children ?? entry.term}
        <span aria-hidden className="ml-0.5 align-super text-[0.65em] text-indigo-600">?</span>
      </button>
      {open && (
        <span
          id={id}
          role="note"
          className="absolute left-0 top-full z-30 mt-2 block w-[min(20rem,80vw)] rounded-xl bg-slate-900 p-3 text-left text-sm font-normal leading-relaxed text-white shadow-xl"
        >
          <strong className="block text-indigo-200">{entry.term}</strong>
          {entry.text}
        </span>
      )}
    </span>
  );
}

/** Full list of all terms (used on the home page). */
export function GlossaryList() {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {Object.values(glossary).map((g) => (
        <div key={g.term}>
          <dt className="font-semibold text-slate-900">{g.term}</dt>
          <dd className="text-slate-700">{g.text}</dd>
        </div>
      ))}
    </dl>
  );
}
