"use client";

import { useMemo, useState } from "react";
import { LisbonMap } from "@/components/Maps";
import { Term } from "@/components/Glossary";
import { Badge, Button, Chevron, Chip, ChipGroup, Empty, Loading, MapLayout, PageTitle, Panel } from "@/components/ui";
import { api, useApi, useStoredState } from "@/lib/api";
import type { EventItem } from "@/lib/types";

type When = "" | "this" | "next";
const organizers = ["Nova FCT", "ESN", "Other"] as const;

function formatDay(isoDate: string) {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default function EventsPage() {
  const { data: events, loading } = useApi(api.getEvents);
  const [going, setGoing] = useStoredState<string[]>("ehk-going", []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [when, setWhen] = useState<When>("");
  const [organizer, setOrganizer] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);

  const results = useMemo(() => {
    return (events ?? [])
      .filter((e) => !when || e.weekend === when)
      .filter((e) => !organizer || e.organizer === organizer)
      .filter((e) => !onlyFree || e.price === "Free")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, when, organizer, onlyFree]);

  const byDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    results.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]));
    return [...map.entries()];
  }, [results]);

  const hasFilter = when || organizer || onlyFree;
  const points = results.map((e) => ({ id: e.id, label: e.title, lat: e.lat, lng: e.lng }));

  function selectFromMap(id: string) {
    setOpenId(id);
    document.getElementById(`event-${id}`)?.scrollIntoView({ block: "center" });
  }

  return (
    <>
      <PageTitle
        eyebrow="After you arrive"
        subtitle={
          <>
            Meet other students at events from Nova FCT, <Term k="esn" /> and more.
          </>
        }
      >
        Events
      </PageTitle>
      <MapLayout map={<LisbonMap points={points} selectedId={openId} onSelect={selectFromMap} labels="selected" caption="Click a pin to see the event." />}>
        <Panel title="Upcoming events">
          <div className="mb-5 space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <ChipGroup label="When">
              <Chip active={when === ""} onClick={() => setWhen("")}>
                Any time
              </Chip>
              <Chip active={when === "this"} onClick={() => setWhen(when === "this" ? "" : "this")}>
                This weekend
              </Chip>
              <Chip active={when === "next"} onClick={() => setWhen(when === "next" ? "" : "next")}>
                Next weekend
              </Chip>
            </ChipGroup>
            <ChipGroup label="Organizer">
              {organizers.map((o) => (
                <Chip key={o} active={organizer === o} onClick={() => setOrganizer(organizer === o ? "" : o)}>
                  {o}
                </Chip>
              ))}
            </ChipGroup>
            <ChipGroup label="Price">
              <Chip active={onlyFree} onClick={() => setOnlyFree(!onlyFree)}>
                Free only
              </Chip>
            </ChipGroup>
            {hasFilter && (
              <Button
                variant="ghost"
                onClick={() => {
                  setWhen("");
                  setOrganizer("");
                  setOnlyFree(false);
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>

          <p className="mb-3 text-sm text-slate-600" aria-live="polite">
            {loading ? "Loading events…" : `${results.length} event${results.length === 1 ? "" : "s"} found`}
            {going.length > 0 && ` · You are going to ${going.length}`}
          </p>

          {loading ? (
            <Loading />
          ) : results.length === 0 ? (
            <Empty>No events for this selection. Try another weekend or organizer.</Empty>
          ) : (
            <div className="space-y-6">
              {byDay.map(([day, list]) => (
                <section key={day} aria-label={formatDay(day)}>
                  <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-indigo-500" />
                    {formatDay(day)}
                  </h3>
                  <ul className="space-y-3">
                    {list.map((e) => {
                      const open = openId === e.id;
                      const isGoing = going.includes(e.id);
                      return (
                        <li
                          id={`event-${e.id}`}
                          key={e.id}
                          className={`scroll-mt-24 rounded-xl bg-white p-4 transition ${open ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300"}`}
                        >
                          <div className="flex gap-4">
                            <div className="w-16 shrink-0 self-start rounded-lg bg-indigo-50 px-1 py-1 text-center text-indigo-800" aria-hidden>
                              <span className="block font-bold leading-tight">{e.time}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <h4 className="font-semibold text-slate-900">
                                  <span className="sr-only">{e.time} – </span>
                                  {e.title}
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  <Badge tone={e.organizer === "Nova FCT" ? "blue" : e.organizer === "ESN" ? "amber" : "gray"}>{e.organizer}</Badge>
                                  <Badge tone={e.price === "Free" ? "green" : "gray"}>{e.price}</Badge>
                                  {isGoing && <Badge tone="green">✓ Going</Badge>}
                                </div>
                              </div>
                              <p className="text-slate-700">📍 {e.place}</p>
                              <button
                                onClick={() => setOpenId(open ? null : e.id)}
                                aria-expanded={open}
                                className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:decoration-indigo-700"
                              >
                                {open ? "Hide details" : "Details"} <Chevron open={open} />
                              </button>
                              {open && (
                                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                                  <p>{e.description}</p>
                                  <div className="mt-3">
                                    <Button
                                      variant={isGoing ? "secondary" : "primary"}
                                      onClick={() => setGoing(isGoing ? going.filter((x) => x !== e.id) : [...going, e.id])}
                                    >
                                      {isGoing ? "I can't go anymore" : "✓ I'm going"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </Panel>
      </MapLayout>
    </>
  );
}
