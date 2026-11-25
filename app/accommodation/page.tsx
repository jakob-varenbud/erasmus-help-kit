"use client";

import { useState } from "react";
import { useReviews } from "@/lib/reviews";
import { Rating, ReviewSection } from "@/components/Reviews";
import { LisbonMap } from "@/components/Maps";
import { Badge, Button, Callout, Chevron, Chip, ChipGroup, Empty, ExternalLink, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { commonScams, contractChecklist, lisbonAreas, trustedWebsites } from "@/lib/mockData";
import type { Accommodation } from "@/lib/types";

const areaName = (id: string) => lisbonAreas.find((a) => a.id === id)?.label ?? id;
const emptyFilter = { maxPrice: "", area: "", verified: false, contract: false, maxMinutes: "" };
const MAX_COMPARE = 3;

export default function AccommodationPage() {
  const { data: offers, loading } = useApi(api.getAccommodations);
  const [area, setArea] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState(emptyFilter);
  const [sort, setSort] = useState<"price" | "rating" | "commute">("price");
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const reviews = useReviews();

  const results = (offers ?? [])
    .filter(
      (o) =>
        (!filter.maxPrice || o.price <= Number(filter.maxPrice)) &&
        (!filter.area || o.area === filter.area) &&
        (!filter.verified || o.verifiedLandlord) &&
        (!filter.contract || o.legalContract) &&
        (!filter.maxMinutes || o.minutesToCampus <= Number(filter.maxMinutes)),
    )
    .sort((a, b) =>
      sort === "rating" ? reviews.average(b.id) - reviews.average(a.id) : sort === "commute" ? a.minutesToCampus - b.minutesToCampus : a.price - b.price,
    );

  const selectedArea = lisbonAreas.find((a) => a.id === area);
  const hasFilter = JSON.stringify(filter) !== JSON.stringify(emptyFilter);
  const compared = (offers ?? []).filter((o) => compare.includes(o.id));

  function pickArea(id: string) {
    const same = filter.area === id;
    setArea(same ? null : id);
    setFilter((f) => ({ ...f, area: same ? "" : id }));
  }

  function toggleCompare(id: string) {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= MAX_COMPARE ? c : [...c, id]));
  }

  return (
    <>
      <PageTitle eyebrow="Before you arrive" subtitle="Safe areas, trusted offers and real experiences from previous Erasmus students.">
        Accommodation
      </PageTitle>
      <MapLayout
        map={
          <>
            <LisbonMap points={lisbonAreas} selectedId={area} onSelect={pickArea} caption="Click an area to see information and show only offers there." />
            {selectedArea && (
              <Panel
                title={selectedArea.label}
                action={
                  <Button variant="ghost" onClick={() => pickArea(selectedArea.id)}>
                    Show all areas
                  </Button>
                }
              >
                <p>{selectedArea.info}</p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <dt className="font-semibold">Safety</dt>
                  <dd>{selectedArea.safety}</dd>
                  <dt className="font-semibold">Price level</dt>
                  <dd>{selectedArea.priceLevel}</dd>
                  <dt className="font-semibold">To Nova FCT</dt>
                  <dd>{selectedArea.commute}</dd>
                </dl>
              </Panel>
            )}
          </>
        }
      >
        <Panel title="Before you search">
          <div className="space-y-2">
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200" open>
              <summary className="cursor-pointer font-semibold text-slate-800">✅ Trusted housing websites</summary>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {trustedWebsites.map((w) => (
                  <li key={w.name}>
                    <ExternalLink href={w.url}>{w.name}</ExternalLink>
                  </li>
                ))}
              </ul>
            </details>
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">⚠️ Common scams – warning signs</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {commonScams.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </details>
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">📝 What a legally binding contract must contain</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {contractChecklist.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </details>
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">📍 Areas close to campus</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {lisbonAreas.map((a) => (
                  <li key={a.id}>
                    <button className="font-semibold text-indigo-700 underline decoration-indigo-400 decoration-2 underline-offset-4" onClick={() => pickArea(a.id)}>
                      {a.label}
                    </button>{" "}
                    – {a.safety}, {a.priceLevel}, {a.commute}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </Panel>

        <Panel title="Accommodation offers">
          <div className="mb-5 space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Max. rent per month (€)">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={10}
                  className={inputClass}
                  value={filter.maxPrice}
                  onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                  placeholder="e.g. 450"
                />
              </Field>
              <Field label="Area">
                <select
                  className={inputClass}
                  value={filter.area}
                  onChange={(e) => {
                    setFilter({ ...filter, area: e.target.value });
                    setArea(e.target.value || null);
                  }}
                >
                  <option value="">All areas</option>
                  {lisbonAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sort by">
                <select className={inputClass} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                  <option value="price">Lowest price</option>
                  <option value="commute">Closest to campus</option>
                  <option value="rating">Happiest tenants</option>
                </select>
              </Field>
            </div>
            <ChipGroup label="Only show">
              <Chip active={filter.verified} onClick={() => setFilter({ ...filter, verified: !filter.verified })}>
                Verified landlord
              </Chip>
              <Chip active={filter.contract} onClick={() => setFilter({ ...filter, contract: !filter.contract })}>
                Legal contract
              </Chip>
              <Chip active={filter.maxMinutes === "30"} onClick={() => setFilter({ ...filter, maxMinutes: filter.maxMinutes === "30" ? "" : "30" })}>
                ≤ 30 min to campus
              </Chip>
            </ChipGroup>
            {hasFilter && (
              <Button
                variant="ghost"
                onClick={() => {
                  setFilter(emptyFilter);
                  setArea(null);
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>

          <p className="mb-2 text-sm text-slate-600" aria-live="polite">
            {loading ? "Loading offers…" : `${results.length} offer${results.length === 1 ? "" : "s"} found`} · Tick “Compare” on up to {MAX_COMPARE} offers to
            compare them side by side.
          </p>

          {loading ? (
            <Loading />
          ) : results.length === 0 ? (
            <Empty>No accommodation found. Try a higher budget or another area.</Empty>
          ) : (
            <ul className="space-y-3">
              {results.map((o) => (
                <OfferCard
                  key={o.id}
                  o={o}
                  open={openId === o.id}
                  onToggle={() => {
                    setOpenId(openId === o.id ? null : o.id);
                    setArea(o.area);
                  }}
                  comparing={compare.includes(o.id)}
                  compareDisabled={!compare.includes(o.id) && compare.length >= MAX_COMPARE}
                  onCompare={() => toggleCompare(o.id)}
                  reviews={reviews}
                />
              ))}
            </ul>
          )}

          {showCompare && compared.length > 0 && <CompareTable items={compared} reviews={reviews} onRemove={toggleCompare} />}
        </Panel>
      </MapLayout>

      {/* Sticky compare bar */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="font-medium">
              {compare.length} of {MAX_COMPARE} selected for comparison
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setCompare([]); setShowCompare(false); }}>
                Clear
              </Button>
              <Button
                disabled={compare.length < 2}
                onClick={() => {
                  setShowCompare(true);
                  setTimeout(() => document.getElementById("compare")?.scrollIntoView({ block: "start" }), 50);
                }}
              >
                {compare.length < 2 ? "Select at least 2" : "Compare now"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {compare.length > 0 && <div className="h-20" aria-hidden />}
    </>
  );
}

function Happiness({ happy, total }: { happy: number; total: number }) {
  if (total === 0) return <span className="text-sm text-slate-600">No tenant reviews yet</span>;
  const pct = Math.round((happy / total) * 100);
  const tone = pct >= 75 ? "green" : pct >= 40 ? "amber" : "red";
  const face = pct >= 75 ? "😊" : pct >= 40 ? "😐" : "😟";
  return (
    <Badge tone={tone}>
      <span aria-hidden>{face}</span> {happy} of {total} previous tenants happy
    </Badge>
  );
}

function OfferCard({
  o,
  open,
  onToggle,
  comparing,
  compareDisabled,
  onCompare,
  reviews,
}: {
  o: Accommodation;
  open: boolean;
  onToggle: () => void;
  comparing: boolean;
  compareDisabled: boolean;
  onCompare: () => void;
  reviews: ReturnType<typeof useReviews>;
}) {
  const h = reviews.happiness(o.id);
  const risky = !o.verifiedLandlord || !o.legalContract;
  return (
    <li className={`rounded-xl bg-white p-4 transition ${comparing ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">{o.title}</h3>
          <p className="text-slate-700">
            📍 {areaName(o.area)} · {o.type} · 🚋 {o.minutesToCampus} min to campus
          </p>
        </div>
        <p className="text-xl font-bold text-slate-900">
          {o.price} €<span className="text-sm font-normal text-slate-600"> / month</span>
        </p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {o.verifiedLandlord ? <Badge tone="green">✓ Verified landlord</Badge> : <Badge tone="red">✕ Landlord not verified</Badge>}
        {o.legalContract ? <Badge tone="green">✓ Legal contract</Badge> : <Badge tone="red">✕ No legal contract</Badge>}
        <Happiness {...h} />
      </div>
      {risky && (
        <p className="mt-2 text-sm text-rose-800">
          <span aria-hidden>⚠️</span> Be careful – check the scam warning signs before you pay anything.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:decoration-indigo-700"
        >
          {open ? "Hide details" : "Details & reviews"} <Chevron open={open} />
        </button>
        <label className={`ml-auto flex items-center gap-2 text-sm font-medium ${compareDisabled ? "text-slate-400" : "text-slate-700"}`}>
          <input type="checkbox" className="h-5 w-5 accent-indigo-600" checked={comparing} disabled={compareDisabled} onChange={onCompare} />
          Compare
        </label>
      </div>
      {open && (
        <div className="mt-3 rounded-xl bg-slate-50 p-4">
          <p>{o.description}</p>
          <p className="mt-1">
            <strong>Listed on:</strong> {o.source}
          </p>
          <div className="mt-3">
            <Button onClick={() => alert("Prototype: a message to the landlord would be sent here.")}>Contact landlord</Button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Rating value={reviews.average(o.id)} count={h.total} />
          </div>
          <ReviewSection targetId={o.id} reviews={reviews.forTarget(o.id)} onAdd={reviews.add} />
        </div>
      )}
    </li>
  );
}

function CompareTable({ items, reviews, onRemove }: { items: Accommodation[]; reviews: ReturnType<typeof useReviews>; onRemove: (id: string) => void }) {
  const best = (vals: number[], low = true) => (low ? Math.min(...vals) : Math.max(...vals));
  const minPrice = best(items.map((i) => i.price));
  const minCommute = best(items.map((i) => i.minutesToCampus));
  const maxRating = best(items.map((i) => reviews.average(i.id)), false);
  const hi = (on: boolean) => (on ? "bg-emerald-50 font-semibold text-emerald-900" : "");

  return (
    <section id="compare" className="mt-6 scroll-mt-24" aria-labelledby="compare-title">
      <h3 id="compare-title" className="mb-1 text-lg font-semibold">
        Comparison
      </h3>
      <p className="mb-3 text-sm text-slate-600">The best value in each row is highlighted in green.</p>
      <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
        <table className="w-full min-w-[32rem] border-collapse bg-white text-left">
          <thead>
            <tr className="bg-slate-50">
              <th scope="col" className="w-40 p-3 text-sm font-medium text-slate-600">
                &nbsp;
              </th>
              {items.map((o) => (
                <th key={o.id} scope="col" className="p-3 align-top">
                  <span className="block font-semibold">{o.title}</span>
                  <button className="text-sm font-medium text-indigo-700 underline underline-offset-4" onClick={() => onRemove(o.id)}>
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">Rent / month</th>
              {items.map((o) => (
                <td key={o.id} className={`p-3 ${hi(o.price === minPrice)}`}>{o.price} €</td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">Tenant happiness</th>
              {items.map((o) => {
                const h = reviews.happiness(o.id);
                return (
                  <td key={o.id} className={`p-3 ${hi(h.total > 0 && reviews.average(o.id) === maxRating)}`}>
                    <Rating value={reviews.average(o.id)} count={h.total} />
                    <span className="block text-sm">{h.total ? `${h.happy} of ${h.total} happy` : ""}</span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">Latest review</th>
              {items.map((o) => {
                const r = reviews.forTarget(o.id)[0];
                return (
                  <td key={o.id} className="p-3 text-sm italic text-slate-700">
                    {r ? `“${r.text}” – ${r.author}` : "–"}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">To campus</th>
              {items.map((o) => (
                <td key={o.id} className={`p-3 ${hi(o.minutesToCampus === minCommute)}`}>{o.minutesToCampus} min</td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">Area</th>
              {items.map((o) => (
                <td key={o.id} className="p-3">{areaName(o.area)}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">Verified landlord</th>
              {items.map((o) => (
                <td key={o.id} className="p-3">{o.verifiedLandlord ? <Badge tone="green">✓ Yes</Badge> : <Badge tone="red">✕ No</Badge>}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="p-3 text-sm font-medium text-slate-600">Legal contract</th>
              {items.map((o) => (
                <td key={o.id} className="p-3">{o.legalContract ? <Badge tone="green">✓ Yes</Badge> : <Badge tone="red">✕ No</Badge>}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Callout tone="blue">
          Found a good one? Contact the landlord only through one of the trusted websites above and never pay before you have seen the room.
        </Callout>
      </div>
    </section>
  );
}
