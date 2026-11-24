"use client";

import { useState } from "react";
import { useReviews } from "@/lib/reviews";
import { Rating, ReviewSection } from "@/components/Reviews";
import { LisbonMap } from "@/components/Maps";
import { Badge, Button, Empty, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { commonScams, contractChecklist, lisbonAreas, trustedWebsites } from "@/lib/mockData";

const areaName = (id: string) => lisbonAreas.find((a) => a.id === id)?.label ?? id;
const emptyFilter = { maxPrice: "", area: "", verified: false, contract: false };

export default function AccommodationPage() {
  const { data: offers, loading } = useApi(api.getAccommodations);
  const [area, setArea] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState(emptyFilter);
  const [sort, setSort] = useState<"price" | "rating">("price");
  const reviews = useReviews();

  const results = (offers ?? [])
    .filter(
      (o) =>
        (!filter.maxPrice || o.price <= Number(filter.maxPrice)) &&
        (!filter.area || o.area === filter.area) &&
        (!filter.verified || o.verifiedLandlord) &&
        (!filter.contract || o.legalContract),
    )
    .sort((a, b) => (sort === "rating" ? reviews.average(b.id) - reviews.average(a.id) : a.price - b.price));

  const selectedArea = lisbonAreas.find((a) => a.id === area);
  const activeFilters = [filter.maxPrice, filter.area, filter.verified, filter.contract].filter(Boolean).length;

  function pickArea(id: string) {
    setArea(id);
    setFilter((f) => ({ ...f, area: id }));
  }

  return (
    <>
      <PageTitle subtitle="Safe areas, trusted offers and real experiences from previous students.">Accommodation</PageTitle>
      <MapLayout
        map={
          <div className="space-y-3">
            <LisbonMap points={lisbonAreas} selectedId={area} onSelect={pickArea} caption="Click an area to see information about it." />
            {selectedArea && (
              <Panel title={selectedArea.label}>
                <p>{selectedArea.info}</p>
                <ul className="mt-2 space-y-1">
                  <li><strong>Safety:</strong> {selectedArea.safety}</li>
                  <li><strong>Price level:</strong> {selectedArea.priceLevel}</li>
                  <li><strong>Commute to Nova FCT:</strong> {selectedArea.commute}</li>
                </ul>
              </Panel>
            )}
          </div>
        }
      >
        <Panel title="Before you search">
          <div className="space-y-2">
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">Areas close to campus</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {lisbonAreas.map((a) => (
                  <li key={a.id}>
                    <button className="font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:decoration-indigo-700" onClick={() => pickArea(a.id)}>{a.label}</button> – {a.safety}, {a.priceLevel}, {a.commute}
                  </li>
                ))}
              </ul>
            </details>
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">Common scams – warning signs</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {commonScams.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </details>
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">What a legally binding contract must contain</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {contractChecklist.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </details>
            <details className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-semibold text-slate-800">Trusted housing websites</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {trustedWebsites.map((w) => (
                  <li key={w.name}>
                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:decoration-indigo-700">{w.name}</a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </Panel>

        <Panel
          title="Accommodation offers"
          action={
            <Button variant="secondary" onClick={() => setShowFilter(!showFilter)}>
              Filter{activeFilters ? ` (${activeFilters})` : ""}
            </Button>
          }
        >
          {showFilter && (
            <div className="mb-5 grid gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-2">
              <Field label="Max. price per month (€)">
                <input type="number" min={0} step={10} className={inputClass} value={filter.maxPrice} onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })} placeholder="e.g. 450" />
              </Field>
              <Field label="Area">
                <select className={inputClass} value={filter.area} onChange={(e) => { setFilter({ ...filter, area: e.target.value }); setArea(e.target.value || null); }}>
                  <option value="">All areas</option>
                  {lisbonAreas.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </Field>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5 accent-indigo-600" checked={filter.verified} onChange={(e) => setFilter({ ...filter, verified: e.target.checked })} />
                Verified landlord only
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5 accent-indigo-600" checked={filter.contract} onChange={(e) => setFilter({ ...filter, contract: e.target.checked })} />
                Legal contract only
              </label>
              <Field label="Sort by">
                <select className={inputClass} value={sort} onChange={(e) => setSort(e.target.value as "price" | "rating")}>
                  <option value="price">Lowest price</option>
                  <option value="rating">Best rated by students</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Button variant="secondary" onClick={() => { setFilter(emptyFilter); setArea(null); }}>Clear filters</Button>
              </div>
            </div>
          )}

          {loading ? (
            <Loading />
          ) : results.length === 0 ? (
            <Empty>No accommodation found. Try a higher budget or another area.</Empty>
          ) : (
            <ul className="space-y-3">
              {results.map((o) => (
                <li key={o.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{o.title}</h3>
                      <p className="text-slate-700">{areaName(o.area)} · {o.type} · {o.minutesToCampus} min to campus</p>
                    </div>
                    <p className="text-lg font-bold">{o.price} €<span className="text-sm font-normal">/month</span></p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {o.verifiedLandlord ? <Badge tone="green">✓ Verified landlord</Badge> : <Badge tone="red">! Landlord not verified</Badge>}
                    {o.legalContract ? <Badge tone="green">✓ Legal contract</Badge> : <Badge tone="red">! No legal contract</Badge>}
                  </div>
                  <div className="mt-1">
                    <Rating value={reviews.average(o.id)} count={reviews.forTarget(o.id).length} />
                  </div>
                  <div className="mt-2">
                    <Button variant="secondary" onClick={() => { setOpenId(openId === o.id ? null : o.id); setArea(o.area); }}>
                      {openId === o.id ? "Hide details" : "Show details"}
                    </Button>
                  </div>
                  {openId === o.id && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
                      <p>{o.description}</p>
                      <p className="mt-1"><strong>Listed on:</strong> {o.source}</p>
                      <div className="mt-2">
                        <Button onClick={() => alert("Prototype: a message to the landlord would be sent here.")}>Contact landlord</Button>
                      </div>
                      <ReviewSection targetId={o.id} reviews={reviews.forTarget(o.id)} onAdd={reviews.add} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </MapLayout>
    </>
  );
}
