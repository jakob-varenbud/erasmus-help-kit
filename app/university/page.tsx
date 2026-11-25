"use client";

import { useState, type DragEvent } from "react";
import { CampusMap } from "@/components/Maps";
import { Term } from "@/components/Glossary";
import { Badge, Button, Chevron, Chip, ChipGroup, Empty, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi, useStoredState } from "@/lib/api";
import type { Course } from "@/lib/types";
import { useReviews } from "@/lib/reviews";
import { Rating, ReviewSection } from "@/components/Reviews";

const TARGET_ECTS = 30;
const emptyFilter = { search: "", englishOnly: false, level: "", semester: "" };
const DRAG_TYPE = "text/x-course-id";

export default function UniversityPage() {
  const { data: courses, loading } = useApi(api.getCourses);
  const [myIds, setMyIds] = useStoredState<string[]>("ehk-my-courses", []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState(emptyFilter);
  const [sort, setSort] = useState<"name" | "rating">("name");
  const [dragging, setDragging] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const reviews = useReviews();

  const myCourses = (courses ?? []).filter((c) => myIds.includes(c.id));
  const totalEcts = myCourses.reduce((sum, c) => sum + c.ects, 0);
  const remaining = Math.max(0, TARGET_ECTS - totalEcts);

  const available = (courses ?? [])
    .filter(
      (c) =>
        !myIds.includes(c.id) &&
        (!filter.search || `${c.name} ${c.code} ${c.department}`.toLowerCase().includes(filter.search.toLowerCase())) &&
        (!filter.englishOnly || c.language === "English") &&
        (!filter.level || c.level === filter.level) &&
        (!filter.semester || c.semester === filter.semester),
    )
    .sort((a, b) => (sort === "rating" ? reviews.average(b.id) - reviews.average(a.id) : a.name.localeCompare(b.name)));

  const hasFilter = JSON.stringify(filter) !== JSON.stringify(emptyFilter);
  const highlighted = [
    ...myCourses.map((c) => c.building),
    ...(openId ? [courses?.find((c) => c.id === openId)?.building ?? ""] : []),
  ];

  function add(id: string) {
    if (myIds.includes(id)) return;
    setMyIds([...myIds, id]);
    setJustAdded(id);
    setTimeout(() => setJustAdded(null), 1500);
  }
  const remove = (id: string) => setMyIds(myIds.filter((x) => x !== id));

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const id = e.dataTransfer.getData(DRAG_TYPE);
    if (id) add(id);
    setDropActive(false);
    setDragging(false);
  }

  const myCoursesPanel = (
    <section
      aria-labelledby="my-courses-title"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE)) {
          e.preventDefault();
          setDropActive(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropActive(false);
      }}
      onDrop={onDrop}
      className={`rounded-2xl bg-white p-5 shadow-sm transition sm:p-6 ${
        dropActive ? "ring-4 ring-indigo-500" : dragging ? "ring-2 ring-indigo-300" : "ring-1 ring-slate-200"
      }`}
    >
      <h2 id="my-courses-title" className="text-xl font-semibold tracking-tight text-slate-900">
        My <Term k="learning-agreement" />
      </h2>
      <p className="mt-2" aria-live="polite">
        <strong className="text-2xl">{totalEcts}</strong> <span className="text-slate-700">/ {TARGET_ECTS} <Term k="ects" /></span>{" "}
        {totalEcts >= TARGET_ECTS ? (
          <Badge tone="green">✓ Complete</Badge>
        ) : (
          <span className="text-slate-700">· {remaining} left</span>
        )}
      </p>
      <div
        className="mb-4 mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="ECTS selected"
        aria-valuemin={0}
        aria-valuemax={TARGET_ECTS}
        aria-valuenow={totalEcts}
      >
        <div
          className={`h-full rounded-full transition-all ${totalEcts >= TARGET_ECTS ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"}`}
          style={{ width: `${Math.min(100, (totalEcts / TARGET_ECTS) * 100)}%` }}
        />
      </div>

      {myCourses.length > 0 && (
        <ul className="mb-3 divide-y divide-slate-200">
          {myCourses.map((c) => (
            <li key={c.id} className={`flex items-center justify-between gap-2 py-2 transition ${justAdded === c.id ? "bg-emerald-50" : ""}`}>
              <span>
                <span className="font-medium">{c.name}</span> <span className="text-slate-600">· {c.ects} ECTS</span>
              </span>
              <Button variant="ghost" onClick={() => remove(c.id)} label={`Remove ${c.name}`}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div
        className={`grid place-items-center rounded-xl border-2 border-dashed p-5 text-center transition ${
          dropActive ? "border-indigo-500 bg-indigo-50 text-indigo-800" : dragging ? "border-indigo-400 bg-indigo-50/50 text-indigo-700" : "border-slate-300 text-slate-600"
        }`}
      >
        <span aria-hidden className="hidden text-2xl lg:block">
          {dropActive ? "⬇" : "⠿"}
        </span>
        <p className="hidden font-medium lg:block">{dropActive ? "Drop to add course" : "Drag courses here"}</p>
        <p className="hidden text-sm lg:block">or use the “+ Add” button next to a course</p>
        <p className="font-medium lg:hidden">Tap “+ Add” next to a course to add it here</p>
      </div>

      {totalEcts >= TARGET_ECTS && (
        <p className="mt-4 text-sm text-slate-700">
          Next step: copy these courses into your <Term k="ola">Online Learning Agreement</Term> and send it to your coordinator.
        </p>
      )}
    </section>
  );

  return (
    <>
      <PageTitle eyebrow="Before you arrive" subtitle={<>Find courses taught in English and put together your {TARGET_ECTS} ECTS Learning Agreement.</>}>
        University
      </PageTitle>
      <MapLayout
        map={
          <>
            {myCoursesPanel}
            <CampusMap highlighted={highlighted} />
          </>
        }
      >
        <Panel title="Available courses">
          {/* Quick filters are always visible – in the test, few users opened the hidden filter menu. */}
          <div className="mb-5 space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <Field label="Search courses">
              <input
                type="search"
                className={inputClass}
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                placeholder="e.g. Databases, HCI, Computer Science…"
              />
            </Field>
            <ChipGroup label="Language">
              <Chip active={filter.englishOnly} onClick={() => setFilter({ ...filter, englishOnly: !filter.englishOnly })}>
                Taught in English only
              </Chip>
            </ChipGroup>
            <ChipGroup label="Degree">
              {["Bachelor", "Master"].map((l) => (
                <Chip key={l} active={filter.level === l} onClick={() => setFilter({ ...filter, level: filter.level === l ? "" : l })}>
                  {l}
                </Chip>
              ))}
            </ChipGroup>
            <ChipGroup label="Semester">
              {["Winter", "Summer"].map((s) => (
                <Chip key={s} active={filter.semester === s} onClick={() => setFilter({ ...filter, semester: filter.semester === s ? "" : s })}>
                  {s}
                </Chip>
              ))}
            </ChipGroup>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                Sort by
                <select className={inputClass} value={sort} onChange={(e) => setSort(e.target.value as "name" | "rating")}>
                  <option value="name">Name (A–Z)</option>
                  <option value="rating">Best rated by students</option>
                </select>
              </label>
              {hasFilter && (
                <Button variant="ghost" onClick={() => setFilter(emptyFilter)}>
                  Clear all filters
                </Button>
              )}
            </div>
          </div>

          <p className="mb-2 text-sm text-slate-600" aria-live="polite">
            {loading ? "Loading courses…" : `${available.length} course${available.length === 1 ? "" : "s"} found`}
            <span className="hidden lg:inline"> · Tip: grab a course by the ⠿ handle and drag it into “My Learning Agreement”.</span>
          </p>

          {loading ? (
            <Loading />
          ) : available.length === 0 ? (
            <Empty>
              No courses match your filters.{" "}
              <button className="font-semibold text-indigo-700 underline underline-offset-4" onClick={() => setFilter(emptyFilter)}>
                Clear filters
              </button>
            </Empty>
          ) : (
            <ul className="space-y-3">
              {available.map((c) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  open={openId === c.id}
                  onToggle={() => setOpenId(openId === c.id ? null : c.id)}
                  onAdd={() => add(c.id)}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={() => {
                    setDragging(false);
                    setDropActive(false);
                  }}
                  reviews={reviews}
                />
              ))}
            </ul>
          )}
        </Panel>
      </MapLayout>
    </>
  );
}

function CourseRow({
  course: c,
  open,
  onToggle,
  onAdd,
  onDragStart,
  onDragEnd,
  reviews,
}: {
  course: Course;
  open: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  reviews: ReturnType<typeof useReviews>;
}) {
  const list = reviews.forTarget(c.id);
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, c.id);
        e.dataTransfer.effectAllowed = "copy";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className="drag-handle group flex gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 transition hover:shadow-md hover:ring-indigo-300"
    >
      <span
        aria-hidden
        title="Drag to My Learning Agreement"
        className="hidden select-none self-start rounded-md px-1 text-xl leading-7 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 sm:block"
      >
        ⠿
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900">{c.name}</h3>
            <p className="text-slate-700">{c.description}</p>
          </div>
          <Button onClick={onAdd} label={`Add ${c.name} to my Learning Agreement`} className="shrink-0">
            <span aria-hidden>+</span> Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge tone={c.language === "English" ? "blue" : "amber"}>{c.language === "English" ? "🇬🇧 English" : "🇵🇹 Portuguese"}</Badge>
          <Badge>{c.ects} ECTS</Badge>
          <Badge>{c.level}</Badge>
          <Badge>{c.semester}</Badge>
          <span className="ml-1">
            <Rating value={reviews.average(c.id)} count={list.length} />
          </span>
        </div>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:decoration-indigo-700"
        >
          {open ? "Hide details & reviews" : "Details & student reviews"} <Chevron open={open} />
        </button>
        {open && (
          <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
            <p>
              <strong>Code:</strong> {c.code} · <strong>Department:</strong> {c.department} · <strong>Building:</strong> highlighted on the campus map
            </p>
            <ReviewSection targetId={c.id} reviews={list} onAdd={reviews.add} />
          </div>
        )}
      </div>
    </li>
  );
}
