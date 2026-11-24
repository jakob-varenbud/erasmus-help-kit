"use client";

import { campusBuildings } from "@/lib/mockData";
import type { MapPoint } from "@/lib/types";

/** Schematic map of the Nova FCT campus. Highlighted buildings are shown in blue. */
export function CampusMap({ highlighted = [] as string[] }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <svg viewBox="0 0 100 100" className="h-auto w-full" role="img" aria-label="Campus map of Nova FCT">
        <rect x="1" y="1" width="98" height="98" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.4" />
        {campusBuildings.map((b) => {
          const on = highlighted.includes(b.id);
          return (
            <g key={b.id}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="1.2" fill={on ? "#4f46e5" : "#fff"} stroke={on ? "#4338ca" : "#94a3b8"} strokeWidth="0.4" />
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 1} textAnchor="middle" fontSize="3" fill={on ? "#fff" : "#222"}>
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-sm text-slate-600">Campus Nova FCT – buildings of your courses are highlighted.</figcaption>
    </figure>
  );
}

/** Schematic map of Lisbon with pins. */
export function LisbonMap({
  points,
  selectedId,
  onSelect,
  caption,
}: {
  points: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  caption?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <svg viewBox="0 0 100 100" className="h-auto w-full" role="img" aria-label="Map of Lisbon">
        {/* land */}
        <rect x="0" y="0" width="100" height="100" fill="#f1f5f9" />
        {/* ocean (west) + river Tejo */}
        <path d="M0 0 L8 0 L8 100 L0 100 Z" fill="#bae6fd" />
        <path d="M0 44 C 30 40, 50 50, 70 42 C 85 36, 95 40, 100 38 L100 58 C 85 58, 70 54, 55 54 C 35 54, 20 52, 0 52 Z" fill="#bae6fd" />
        {/* bridge 25 de Abril */}
        <line x1="34" y1="38" x2="36" y2="58" stroke="#c026d3" strokeWidth="1.6" />
        <text x="30" y="48" fontSize="2.6" fill="#555" textAnchor="end">
          Ponte 25 de Abril
        </text>
        <text x="70" y="49" fontSize="3" fill="#0369a1" fontStyle="italic">
          Tejo
        </text>
        <text x="62" y="10" fontSize="3.2" fill="#555">
          LISBOA
        </text>
        <text x="60" y="78" fontSize="3.2" fill="#555">
          ALMADA
        </text>
        {/* campus marker */}
        <rect x="18" y="86" width="12" height="5" fill="#fff" stroke="#555" strokeWidth="0.3" />
        <text x="24" y="89.6" fontSize="2.6" textAnchor="middle">
          Nova FCT
        </text>

        {points.map((p) => {
          const on = p.id === selectedId;
          return (
            <g
              key={p.id}
              onClick={() => onSelect?.(p.id)}
              style={{ cursor: onSelect ? "pointer" : "default" }}
              role={onSelect ? "button" : undefined}
              aria-label={p.label}
            >
              <circle cx={p.x} cy={p.y} r={on ? 2.6 : 1.8} fill={on ? "#e11d48" : "#4f46e5"} stroke="#fff" strokeWidth="0.5" />
              <text x={p.x + 3} y={p.y + 1} fontSize={on ? 3.2 : 2.6} fontWeight={on ? "bold" : "normal"} fill="#0f172a" stroke="#fff" strokeWidth="0.8" paintOrder="stroke">
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && <figcaption className="mt-1 text-sm text-slate-600">{caption}</figcaption>}
    </figure>
  );
}
