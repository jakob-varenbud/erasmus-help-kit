"use client";

import { useMemo, useState } from "react";
import { LisbonMap } from "@/components/Maps";
import { Term } from "@/components/Glossary";
import { Badge, Callout, ExternalLink, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi, useStoredState } from "@/lib/api";
import { lisbonAreas, naveganteOffices } from "@/lib/mockData";
import { useReviews } from "@/lib/reviews";
import { Rating, ReviewSection } from "@/components/Reviews";

type Origin = "eu" | "noneu";

/** Distance in km between two coordinates (haversine, straight line). */
function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

const documents: { id: string; label: React.ReactNode; hint: string; only?: Origin }[] = [
  { id: "passport", label: "Passport or national ID card", hint: "The original, not a copy." },
  { id: "address", label: <Term k="proof-of-address" />, hint: "Rental contract or a letter from Nova FCT." },
  {
    id: "rep",
    label: <Term k="fiscal-representative" />,
    hint: "Only if you don't have a Portuguese address yet. Signed form from the representative.",
    only: "noneu",
  },
];

const usedFor = [
  { icon: "🏦", text: "Open a bank account" },
  { icon: "🏠", text: "Sign a rental contract" },
  { icon: "📱", text: "Get a phone contract" },
  { icon: "🚇", text: "Get the Navegante pass" },
];

export default function NifPage() {
  const { data: offices, loading } = useApi(api.getOffices);
  const [origin, setOrigin] = useStoredState<Origin>("ehk-nif-origin", "eu");
  const [checked, setChecked] = useStoredState<string[]>("ehk-nif-docs", []);
  const [home, setHome] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const reviews = useReviews();

  const homeArea = lisbonAreas.find((a) => a.id === home);
  const myDocs = documents.filter((d) => !d.only || d.only === origin);
  const readyCount = myDocs.filter((d) => checked.includes(d.id)).length;

  const recommended = useMemo(() => {
    const list = (offices ?? []).filter((o) => o.walkIn);
    if (!homeArea) return list.map((o) => ({ ...o, distance: null as number | null }));
    return list
      .map((o) => ({ ...o, distance: Math.round(km(o, homeArea) * 10) / 10 }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [offices, homeArea]);

  const avoid = (offices ?? []).filter((o) => !o.walkIn);
  const nearestId = homeArea ? recommended[0]?.id : null;
  const activeId = selected ?? nearestId;
  const activeOffice = (offices ?? []).find((o) => o.id === activeId);

  const mapPoints = [
    ...(offices ?? []).map((o) => ({ id: o.id, label: o.name.replace("Finanças ", "") + (o.walkIn ? "" : " ✕"), lat: o.lat, lng: o.lng, labelDir: o.labelDir })),
    ...(homeArea ? [{ id: "home", label: "🏠 You", lat: homeArea.lat, lng: homeArea.lng }] : []),
  ];

  const toggleDoc = (id: string) => setChecked(checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id]);

  return (
    <>
      <PageTitle eyebrow="After you arrive" subtitle={<>How to get your Portuguese tax number – in 3 steps.</>}>
        NIF & other
      </PageTitle>

      {/* At a glance – the most important facts first, so users don't have to read everything. */}
      <section aria-labelledby="glance" className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
        <h2 id="glance" className="text-xl font-bold">
          At a glance
        </h2>
        <ul className="mt-3 grid gap-3 text-lg sm:grid-cols-2">
          <li className="flex gap-2">
            <span aria-hidden>🪪</span>
            <span>
              The <strong>NIF</strong> is your Portuguese tax number.
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>⏱️</span>
            <span>Takes about 1 hour at the office – go early (before 9:00).</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>📄</span>
            <span>Bring your passport/ID and proof of address.</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>💶</span>
            <span>It is free if you do it yourself.</span>
          </li>
        </ul>
        <nav aria-label="Steps on this page" className="mt-6 flex flex-wrap gap-2">
          {[
            ["#documents", "1 · Documents"],
            ["#where", "2 · Where to go"],
            ["#navegante", "3 · Navegante pass"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full bg-white px-4 py-2 font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
              {label}
            </a>
          ))}
        </nav>
      </section>

      <MapLayout
        map={
          <>
            <LisbonMap
              points={mapPoints}
              selectedId={activeId}
              onSelect={(id) => id !== "home" && setSelected(id)}
              caption="Finanças offices (✕ = better avoid). Choose where you live to find the nearest one."
            />
            {activeOffice && (
              <Panel title={activeOffice.name}>
                <p className="text-slate-700">{activeOffice.address}</p>
                <p className="mt-1">
                  {activeOffice.walkIn ? <Badge tone="green">✓ No appointment needed</Badge> : <Badge tone="red">✕ Better avoid</Badge>}
                </p>
                <ReviewSection targetId={activeOffice.id} reviews={reviews.forTarget(activeOffice.id)} onAdd={reviews.add} />
              </Panel>
            )}
          </>
        }
      >
        <Panel title="What is the NIF?">
          <div className="readable">
            <p>
              The <Term k="nif" /> (Número de Identificação Fiscal) is your personal tax number in Portugal. You get it once and keep it for life.
            </p>
            <p className="mt-3 font-semibold">You need it to:</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {usedFor.map((u) => (
                <li key={u.text} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  <span aria-hidden className="text-2xl">
                    {u.icon}
                  </span>
                  {u.text}
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel id="documents" step={1} title="Prepare your documents">
          <div className="readable">
            <fieldset>
              <legend className="mb-2 font-semibold">I am a citizen of…</legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["eu", "🇪🇺 an EU country"],
                    ["noneu", "🌍 a non-EU country"],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-center font-semibold transition ${
                      origin === value ? "bg-indigo-600 text-white shadow-sm" : "bg-white ring-1 ring-slate-300 hover:ring-slate-400"
                    }`}
                  >
                    <input type="radio" name="origin" className="sr-only" checked={origin === value} onChange={() => setOrigin(value)} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-5 font-semibold" aria-live="polite">
              Your checklist · {readyCount} of {myDocs.length} ready {readyCount === myDocs.length && <Badge tone="green">✓ All set</Badge>}
            </p>
            <ul className="mt-2 space-y-2">
              {myDocs.map((d) => (
                <li key={d.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 transition ${
                      checked.includes(d.id) ? "bg-emerald-50 ring-emerald-300" : "bg-white ring-slate-200 hover:ring-slate-300"
                    }`}
                  >
                    <input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-emerald-600" checked={checked.includes(d.id)} onChange={() => toggleDoc(d.id)} />
                    <span>
                      <span className="block font-medium">
                        {d.label} {d.only === "noneu" && <Badge tone="amber">non-EU only</Badge>}
                      </span>
                      <span className="block text-base text-slate-600">{d.hint}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel id="where" step={2} title="Get your NIF">
          <div className="readable space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Callout tone="green" title="Option A · In person (recommended)">
                Go to a <Term k="financas" /> office. Some offices work <strong>without appointment</strong> if you come early.
              </Callout>
              <Callout tone="blue" title="Option B · Online">
                Apply on the <ExternalLink href="https://www.portaldasfinancas.gov.pt">Portal das Finanças</ExternalLink>. Since 2025 most offices need an
                appointment, which you can book there too.
              </Callout>
            </div>

            <Field label="Where do you live? (we show the nearest office)">
              <select
                className={inputClass}
                value={home}
                onChange={(e) => {
                  setHome(e.target.value);
                  setSelected(null);
                }}
              >
                <option value="">Choose your area</option>
                {lisbonAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>

            <div>
              <h3 className="font-semibold">✓ Offices without appointment</h3>
              {loading ? (
                <Loading />
              ) : (
                <ul className="mt-2 space-y-2">
                  {recommended.map((o, i) => (
                    <li key={o.id}>
                      <button
                        onClick={() => setSelected(o.id)}
                        aria-pressed={activeId === o.id}
                        className={`w-full rounded-xl p-4 text-left transition ${
                          activeId === o.id ? "bg-indigo-50 ring-2 ring-indigo-500" : "bg-white ring-1 ring-slate-200 hover:ring-slate-300"
                        }`}
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{o.name}</span>
                          {homeArea && i === 0 && <Badge tone="green">📍 Nearest to you</Badge>}
                        </span>
                        <span className="block text-base text-slate-700">
                          {o.address}
                          {o.distance !== null && ` · approx. ${o.distance} km away`}
                        </span>
                        <Rating value={reviews.average(o.id)} count={reviews.forTarget(o.id).length} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-semibold">✕ Better avoid</h3>
              <ul className="mt-2 space-y-2">
                {avoid.map((o) => (
                  <li key={o.id}>
                    <button
                      onClick={() => setSelected(o.id)}
                      aria-pressed={activeId === o.id}
                      className={`w-full rounded-xl p-4 text-left transition ${
                        activeId === o.id ? "bg-rose-50 ring-2 ring-rose-400" : "bg-rose-50/50 ring-1 ring-rose-200 hover:ring-rose-300"
                      }`}
                    >
                      <span className="font-semibold">{o.name}</span>
                      <span className="block text-base text-rose-900">{o.avoid}</span>
                      <Rating value={reviews.average(o.id)} count={reviews.forTarget(o.id).length} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Callout tone="amber" title="Tip from other students">
              Arrive before 9:00, take a ticket at the entrance and say <em>“Quero pedir um NIF”</em> (I want to request a NIF).
            </Callout>
          </div>
        </Panel>

        <Panel id="navegante" step={3} title="Navegante – public transport pass">
          <div className="readable">
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span aria-hidden>🎓</span>
                <span>
                  <Term k="navegante" /> is <strong>free for students up to 23</strong> (until the month you turn 24).
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>🪪</span>
                <span>
                  You need your <strong>NIF</strong> to apply.
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden>📍</span>
                <span>Apply at one of these offices:</span>
              </li>
            </ul>
            <ul className="mt-2 space-y-1 pl-8">
              {naveganteOffices.map((n) => (
                <li key={n.id} className="font-medium">
                  {n.label}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              More info: <ExternalLink href="https://www.navegante.pt">navegante.pt</ExternalLink>
            </p>
          </div>
        </Panel>
      </MapLayout>
    </>
  );
}
