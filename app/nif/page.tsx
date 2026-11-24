"use client";

import { useMemo, useState } from "react";
import { LisbonMap } from "@/components/Maps";
import { Badge, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { lisbonAreas, naveganteOffices } from "@/lib/mockData";
import { useReviews } from "@/lib/reviews";
import { Rating, ReviewSection } from "@/components/Reviews";

export default function NifPage() {
  const { data: offices, loading } = useApi(api.getOffices);
  const [origin, setOrigin] = useState<"eu" | "noneu">("eu");
  const [home, setHome] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const homeArea = lisbonAreas.find((a) => a.id === home);

  const recommended = useMemo(() => {
    const list = (offices ?? []).filter((o) => o.walkIn);
    if (!homeArea) return list.map((o) => ({ ...o, distance: null as number | null }));
    return list
      .map((o) => ({ ...o, distance: Math.round(Math.hypot(o.x - homeArea.x, o.y - homeArea.y) * 0.25 * 10) / 10 }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [offices, homeArea]);

  const avoid = (offices ?? []).filter((o) => !o.walkIn);
  const nearestId = homeArea ? recommended[0]?.id : null;
  const activeId = selected ?? nearestId;
  const activeOffice = (offices ?? []).find((o) => o.id === activeId);
  const reviews = useReviews();

  const mapPoints = [
    ...(offices ?? []).map((o) => ({ id: o.id, label: o.name.replace("Finanças ", ""), x: o.x, y: o.y })),
    ...(homeArea ? [{ id: "home", label: "Your home", x: homeArea.x, y: homeArea.y }] : []),
  ];

  return (
    <>
      <PageTitle subtitle="Your Portuguese tax number – what you need and where to get it.">NIF & other</PageTitle>
      <MapLayout
        map={<LisbonMap points={mapPoints} selectedId={activeId} onSelect={(id) => id !== "home" && setSelected(id)} caption="Finanças offices. The nearest one to your home is marked in red." />}
      >
        <Panel title="What is the NIF?">
          <p>
            The NIF (Número de Identificação Fiscal) is your Portuguese tax number. You need it to open a bank account,
            sign a rental contract, get a phone contract and to get the discounted <strong>Navegante</strong> public transport pass.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Since 2025 an <strong>appointment is needed</strong> at most offices.</li>
            <li>It can also be done online <a href="https://www.portaldasfinancas.gov.pt" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:decoration-indigo-700">here (Portal das Finanças)</a>.</li>
            <li>Some offices also work <strong>without appointment</strong> – come early in the morning.</li>
          </ul>
        </Panel>

        <Panel title="Which documents do I need?">
          <fieldset className="mb-3">
            <legend className="mb-1 font-medium">I am a citizen of…</legend>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="origin" className="h-5 w-5 accent-indigo-600" checked={origin === "eu"} onChange={() => setOrigin("eu")} /> an EU country
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="origin" className="h-5 w-5 accent-indigo-600" checked={origin === "noneu"} onChange={() => setOrigin("noneu")} /> a non-EU country
              </label>
            </div>
          </fieldset>
          <ul className="list-disc space-y-1 pl-5">
            <li>Passport or national ID card</li>
            <li>Proof of address (rental contract or a letter from your university)</li>
            {origin === "noneu" && (
              <li>
                <strong>Fiscal representative</strong> – a person or company with a Portuguese address, or proof of an address in Portugal{" "}
                <Badge tone="red">required for non-EU</Badge>
              </li>
            )}
          </ul>
        </Panel>

        <Panel title="Where can I get it?">
          <Field label="Where do you live?">
            <select className={inputClass} value={home} onChange={(e) => { setHome(e.target.value); setSelected(null); }}>
              <option value="">Choose your area</option>
              {lisbonAreas.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </Field>

          <h3 className="mt-4 font-semibold">Offices without appointment</h3>
          {loading ? (
            <Loading />
          ) : (
            <ul className="mt-2 space-y-2">
              {recommended.map((o, i) => (
                <li key={o.id}>
                  <button
                    onClick={() => setSelected(o.id)}
                    className={`w-full rounded-xl p-4 text-left transition ${activeId === o.id ? "bg-indigo-50 ring-2 ring-indigo-500" : "bg-white ring-1 ring-slate-200 hover:ring-slate-300"}`}
                  >
                    <span className="font-medium">{o.name}</span>{" "}
                    {homeArea && i === 0 && <Badge tone="green">Nearest to you</Badge>}
                    <br />
                    <span className="text-sm text-slate-700">
                      {o.address}
                      {o.distance !== null && ` · approx. ${o.distance} km`}
                    </span>
                    <br />
                    <Rating value={reviews.average(o.id)} count={reviews.forTarget(o.id).length} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-4 font-semibold">Avoid</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {avoid.map((o) => (
              <li key={o.id}>
                <button onClick={() => setSelected(o.id)} className="text-left">
                  <strong className="font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:decoration-indigo-700">{o.name}</strong> – {o.avoid}{" "}
                  <Rating value={reviews.average(o.id)} count={reviews.forTarget(o.id).length} />
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {activeOffice && (
          <Panel title={`Experiences: ${activeOffice.name}`}>
            <p className="text-slate-700">What other Erasmus students say about this office.</p>
            <ReviewSection targetId={activeOffice.id} reviews={reviews.forTarget(activeOffice.id)} onAdd={reviews.add} />
          </Panel>
        )}

        <Panel title="Navegante (public transport pass)">
          <ul className="list-disc space-y-1 pl-5">
            <li>Free for students <strong>up to 23 years</strong> (until the month you turn 24).</li>
            <li>You need your <strong>NIF</strong> to apply.</li>
            <li>Apply at one of these offices:</li>
          </ul>
          <ul className="mt-1 list-disc pl-10">
            {naveganteOffices.map((n) => <li key={n.id}>{n.label}</li>)}
          </ul>
        </Panel>
      </MapLayout>
    </>
  );
}
