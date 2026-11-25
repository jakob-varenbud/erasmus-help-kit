"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { CAMPUS, campusBuildings } from "@/lib/mockData";
import type { MapPoint } from "@/lib/types";

/* Open-source map: Leaflet + OpenStreetMap tiles (no API key needed, attribution required). */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const LABEL_OFFSET: Record<NonNullable<MapPoint["labelDir"]>, [number, number]> = { right: [10, 0], left: [-10, 0], top: [0, -10], bottom: [0, 10] };

type Props = {
  points: MapPoint[];
  selectedId?: string | null;
  highlightedIds?: string[];
  onSelect?: (id: string) => void;
  caption?: string;
  /** "all": every pin has a label. "selected": only highlighted pins (others show it on hover). */
  labels?: "all" | "selected";
  showCampus?: boolean;
  /** Zoom used when there is only one point / no points. */
  zoom?: number;
  ariaLabel?: string;
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function OsmMap({
  points,
  selectedId,
  highlightedIds = [],
  onSelect,
  caption,
  labels = "all",
  showCampus = true,
  zoom = 12,
  ariaLabel = "Map",
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const L = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const layer = useRef<Leaflet.LayerGroup | null>(null);
  const lastFit = useRef("");
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  // Create the map once (Leaflet needs `window`, so it is loaded on the client only).
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (cancelled || !el.current || map.current) return;
      const lf = (mod.default ?? mod) as typeof Leaflet;
      L.current = lf;
      const m = lf.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView([CAMPUS.lat, CAMPUS.lng], zoom);
      lf.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m);
      // Enable scroll zoom only after the user clicks into the map, so page scrolling isn't hijacked.
      m.on("click", () => m.scrollWheelZoom.enable());
      m.on("mouseout", () => m.scrollWheelZoom.disable());
      layer.current = lf.layerGroup().addTo(m);
      map.current = m;
      setReady(true);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      lastFit.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw markers when data or selection changes.
  useEffect(() => {
    const lf = L.current;
    const m = map.current;
    const group = layer.current;
    if (!lf || !m || !group) return;
    group.clearLayers();

    const active = new Set([...highlightedIds, ...(selectedId ? [selectedId] : [])]);

    if (showCampus) {
      lf.marker([CAMPUS.lat, CAMPUS.lng], {
        icon: lf.divIcon({ className: "", html: '<span class="ehk-campus" aria-hidden="true">🎓</span>', iconSize: [30, 30], iconAnchor: [15, 15] }),
        keyboard: false,
        interactive: false,
      })
        .bindTooltip("Nova FCT", { permanent: true, direction: "bottom", offset: [0, 12], className: "ehk-label ehk-label-campus" })
        .addTo(group);
    }

    points.forEach((p) => {
      const on = active.has(p.id);
      const marker = lf.marker([p.lat, p.lng], {
        icon: lf.divIcon({
          className: "",
          html: `<span class="ehk-pin${on ? " ehk-pin-on" : ""}"></span>`,
          iconSize: on ? [26, 26] : [18, 18],
          iconAnchor: on ? [13, 13] : [9, 9],
        }),
        title: p.label,
        alt: p.label,
        keyboard: Boolean(onSelectRef.current),
        zIndexOffset: on ? 1000 : 0,
        riseOnHover: true,
      });
      marker.bindTooltip(escapeHtml(p.label), {
        permanent: labels === "all" || on,
        direction: p.labelDir ?? "right",
        offset: LABEL_OFFSET[p.labelDir ?? "right"],
        className: `ehk-label${on ? " ehk-label-on" : ""}`,
      });
      if (onSelectRef.current) marker.on("click", () => onSelectRef.current?.(p.id));
      marker.addTo(group);
    });

    // Fit the view when the set of points changes (not on every selection).
    const key = points.map((p) => p.id).join(",");
    if (key !== lastFit.current) {
      lastFit.current = key;
      const coords: [number, number][] = points.map((p) => [p.lat, p.lng]);
      if (showCampus) coords.push([CAMPUS.lat, CAMPUS.lng]);
      if (coords.length > 1) m.fitBounds(lf.latLngBounds(coords), { padding: [36, 36], maxZoom: 17 });
      else if (coords.length === 1) m.setView(coords[0], zoom);
    } else if (selectedId) {
      const sel = points.find((p) => p.id === selectedId);
      if (sel) m.panInside([sel.lat, sel.lng], { padding: [60, 60] });
    }
  }, [ready, points, selectedId, highlightedIds, labels, showCampus, zoom]);

  return (
    <figure className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div ref={el} role="region" aria-label={ariaLabel} className="relative z-0 h-[20rem] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[26rem]" />
      {caption && <figcaption className="mt-2 text-sm text-slate-600">{caption}</figcaption>}
    </figure>
  );
}

/** Nova FCT campus – buildings of your courses are highlighted. */
export function CampusMap({ highlighted = [] as string[] }) {
  return (
    <OsmMap
      points={campusBuildings}
      highlightedIds={highlighted}
      showCampus={false}
      zoom={17}
      ariaLabel="Map of the Nova FCT campus"
      caption="Campus Nova FCT – buildings of your courses are highlighted in red (positions approximate)."
    />
  );
}

/** Lisbon map with pins. */
export function LisbonMap(props: Omit<Props, "ariaLabel">) {
  return <OsmMap {...props} ariaLabel="Map of Lisbon" />;
}
