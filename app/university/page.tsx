"use client";

import { useState } from "react";
import { CampusMap } from "@/components/Maps";
import { Badge, Button, Empty, Field, Loading, MapLayout, PageTitle, Panel, inputClass } from "@/components/ui";
import { api, useApi, useStoredState } from "@/lib/api";
import type { Course } from "@/lib/types";
import { useReviews } from "@/lib/reviews";
import { Rating, ReviewSection } from "@/components/Reviews";

const TARGET_ECTS = 30;

export default function UniversityPage() {
  const { data: courses, loading } = useApi(api.getCourses);
  const [myIds, setMyIds] = useStoredState<string[]>("ehk-my-courses", []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({ search: "", language: "", level: "", semester: "" });
  const [sort, setSort] = useState<"name" | "rating">("name");
  const reviews = useReviews();

  const myCourses = (courses ?? []).filter((c) => myIds.includes(c.id));
  const totalEcts = myCourses.reduce((sum, c) => sum + c.ects, 0);

  const available = (courses ?? [])
    .filter(
      (c) =>
        !myIds.includes(c.id) &&
        (!filter.search || c.name.toLowerCase().includes(filter.search.toLowerCase())) &&
        (!filter.language || c.language === filter.language) &&
        (!filter.level || c.level === filter.level) &&
        (!filter.semester || c.semester === filter.semester),
    )
    .sort((a, b) => (sort === "rating" ? reviews.average(b.id) - reviews.average(a.id) : a.name.localeCompare(b.name)));

  const activeFilters = [filter.language, filter.level, filter.semester].filter(Boolean).length;
  const highlighted = [
    ...myCourses.map((c) => c.building),
    ...(openId ? [courses?.find((c) => c.id === openId)?.building ?? ""] : []),
  ];

  const add = (id: string) => setMyIds([...myIds, id]);
  const remove = (id: string) => setMyIds(myIds.filter((x) => x !== id));

  return (
    <>
      <PageTitle subtitle="Find courses taught in English and build your 30 ECTS Learning Agreement.">University</PageTitle>
      <MapLayout map={<CampusMap highlighted={highlighted} />}>
        <Panel title="My courses">
          <p className="mb-2">
            <strong>
              {totalEcts} / {TARGET_ECTS} ECTS
            </strong>{" "}
            {totalEcts >= TARGET_ECTS ? <Badge tone="green">Learning Agreement complete</Badge> : <span className="text-slate-700">selected</span>}
          </p>
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden>
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${Math.min(100, (totalEcts / TARGET_ECTS) * 100)}%` }} />
          </div>
          {myCourses.length === 0 ? (
            <Empty>No courses selected yet.</Empty>
          ) : (
            <ul className="divide-y divide-slate-200">
              {myCourses.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 py-2">
                  <span>
                    {c.name} <span className="text-slate-600">({c.ects} ECTS)</span>
                  </span>
                  <Button variant="secondary" onClick={() => remove(c.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Available courses"
          action={
            <Button variant="secondary" onClick={() => setShowFilter(!showFilter)}>
              Filter{activeFilters ? ` (${activeFilters})` : ""}
            </Button>
          }
        >
          {showFilter && (
            <div className="mb-5 grid gap-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-2">
              <Field label="Search">
                <input className={inputClass} value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} placeholder="Course name" />
              </Field>
              <Field label="Language">
                <select className={inputClass} value={filter.language} onChange={(e) => setFilter({ ...filter, language: e.target.value })}>
                  <option value="">All</option>
                  <option>English</option>
                  <option>Portuguese</option>
                </select>
              </Field>
              <Field label="Degree">
                <select className={inputClass} value={filter.level} onChange={(e) => setFilter({ ...filter, level: e.target.value })}>
                  <option value="">All</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                </select>
              </Field>
              <Field label="Semester">
                <select className={inputClass} value={filter.semester} onChange={(e) => setFilter({ ...filter, semester: e.target.value })}>
                  <option value="">All</option>
                  <option>Winter</option>
                  <option>Summer</option>
                </select>
              </Field>
              <Field label="Sort by">
                <select className={inputClass} value={sort} onChange={(e) => setSort(e.target.value as "name" | "rating")}>
                  <option value="name">Name</option>
                  <option value="rating">Best rated by students</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Button variant="secondary" onClick={() => setFilter({ search: "", language: "", level: "", semester: "" })}>
                  Clear filters
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <Loading />
          ) : available.length === 0 ? (
            <Empty>No courses match your filters.</Empty>
          ) : (
            <ul className="divide-y divide-slate-200">
              {available.map((c) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  open={openId === c.id}
                  onToggle={() => setOpenId(openId === c.id ? null : c.id)}
                  onAdd={() => add(c.id)}
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
  reviews,
}: {
  course: Course;
  open: boolean;
  onToggle: () => void;
  onAdd: () => void;
  reviews: ReturnType<typeof useReviews>;
}) {
  const list = reviews.forTarget(c.id);
  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={onToggle} className="text-left font-semibold text-indigo-700 hover:underline" aria-expanded={open}>
          {c.name}
        </button>
        <Button onClick={onAdd}>Add</Button>
      </div>
      <div className="mt-1 flex flex-wrap gap-1">
        <Badge tone={c.language === "English" ? "blue" : "gray"}>{c.language}</Badge>
        <Badge>{c.level}</Badge>
        <Badge>{c.ects} ECTS</Badge>
        <Badge>{c.semester}</Badge>
      </div>
      <div className="mt-1">
        <Rating value={reviews.average(c.id)} count={list.length} />
      </div>
      {open && (
        <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm">
          <p>{c.description}</p>
          <p className="mt-1">
            <strong>Code:</strong> {c.code} · <strong>Department:</strong> {c.department} · <strong>Building:</strong> see map
          </p>
          <ReviewSection targetId={c.id} reviews={list} onAdd={reviews.add} />
        </div>
      )}
    </li>
  );
}
