"use client";

import { useMemo, useState } from "react";
import { LisbonMap } from "@/components/Maps";
import { Badge, Button, Empty, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi, useStoredState } from "@/lib/api";

type When = "" | "this" | "next";

function formatDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export default function EventsPage() {
  const { data: events, loading } = useApi(api.getEvents);
  const [going, setGoing] = useStoredState<string[]>("ehk-going", []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<{ when: When; organizer: string }>({ when: "", organizer: "" });

  const results = useMemo(() => {
    return (events ?? [])
      .filter((e) => !filter.when || e.weekend === filter.when)
      .filter((e) => !filter.organizer || e.organizer === filter.organizer)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, filter]);

  const activeFilters = [filter.when, filter.organizer].filter(Boolean).length;
  const points = results.map((e) => ({ id: e.id, label: e.title, x: e.x, y: e.y }));

  return (
    <>
      <PageTitle subtitle="Meet other students at events from Nova FCT, ESN and more.">Events</PageTitle>
      <MapLayout map={<LisbonMap points={points} selectedId={openId} onSelect={setOpenId} caption="Click a pin to see the event." />}>
        <Panel
          title="Upcoming events"
          action={
            <Button variant="secondary" onClick={() => setShowFilter(!showFilter)}>
              Filter{activeFilters ? ` (${activeFilters})` : ""}
            </Button>
          }
        >
          {showFilter && (
            <div className="mb-5 grid gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-2">
              <Field label="When">
                <select className={inputClass} value={filter.when} onChange={(e) => setFilter({ ...filter, when: e.target.value as When })}>
                  <option value="">Any time</option>
                  <option value="this">This weekend</option>
                  <option value="next">Next weekend</option>
                </select>
              </Field>
              <Field label="Organizer">
                <select className={inputClass} value={filter.organizer} onChange={(e) => setFilter({ ...filter, organizer: e.target.value })}>
                  <option value="">All</option>
                  <option>Nova FCT</option>
                  <option>ESN</option>
                  <option>Other</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Button variant="secondary" onClick={() => setFilter({ when: "", organizer: "" })}>Clear filters</Button>
              </div>
            </div>
          )}

          {loading ? (
            <Loading />
          ) : results.length === 0 ? (
            <Empty>No events for this date. Try another weekend or organizer.</Empty>
          ) : (
            <ul className="space-y-3">
              {results.map((e) => {
                const open = openId === e.id;
                const isGoing = going.includes(e.id);
                return (
                  <li key={e.id} className={`rounded-xl bg-white p-4 transition ${open ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <button onClick={() => setOpenId(open ? null : e.id)} className="text-left font-semibold text-indigo-700 hover:underline" aria-expanded={open}>
                          {e.title}
                        </button>
                        <p className="text-slate-700">{formatDate(e.date)}, {e.time} · {e.place}</p>
                      </div>
                      <div className="flex gap-1">
                        <Badge tone={e.organizer === "Nova FCT" ? "blue" : "gray"}>{e.organizer}</Badge>
                        {isGoing && <Badge tone="green">✓ Going</Badge>}
                      </div>
                    </div>
                    {open && (
                      <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
                        <p>{e.description}</p>
                        <p className="mt-1"><strong>Price:</strong> {e.price}</p>
                        <div className="mt-2">
                          <Button
                            variant={isGoing ? "secondary" : "primary"}
                            onClick={() => setGoing(isGoing ? going.filter((x) => x !== e.id) : [...going, e.id])}
                          >
                            {isGoing ? "Cancel" : "I'm going"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </MapLayout>
    </>
  );
}
