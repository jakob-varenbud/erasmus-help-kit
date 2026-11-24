"use client";

import { useState } from "react";
import { Button, Field, inputClass } from "./ui";
import type { Review } from "@/lib/reviews";

/** Stars + average, e.g. ★★★★☆ 4.3 (3 reviews) */
export function Rating({ value, count, single = false }: { value: number; count: number; single?: boolean }) {
  if (count === 0) return <span className="text-sm text-slate-600">No reviews yet</span>;
  const full = Math.round(value);
  return (
    <span
      className="inline-flex items-center gap-1 text-sm"
      role="img"
      aria-label={single ? `${value} out of 5 stars` : `Rated ${value.toFixed(1)} out of 5 by ${count} students`}
    >
      <span aria-hidden className="text-amber-600">
        {"★".repeat(full)}
        <span className="text-slate-300">{"★".repeat(5 - full)}</span>
      </span>
      {!single && (
        <>
          <strong aria-hidden>{value.toFixed(1)}</strong>
          <span aria-hidden className="text-slate-600">({count} {count === 1 ? "review" : "reviews"})</span>
        </>
      )}
    </span>
  );
}

/** List of reviews + form to add your own. */
export function ReviewSection({
  targetId,
  reviews,
  onAdd,
}: {
  targetId: string;
  reviews: Review[];
  onAdd: (r: Omit<Review, "id" | "date">) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [country, setCountry] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    let author = "You";
    try {
      author = localStorage.getItem("ehk-user") || "You";
    } catch {}
    onAdd({ targetId, author, country: country || "–", rating, text: text.trim() });
    setText("");
    setShowForm(false);
  }

  return (
    <div className="mt-3 border-t border-slate-300 pt-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold">Student reviews</h4>
        {!showForm && (
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Write a review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-4 space-y-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <fieldset>
            <legend className="text-sm font-medium">Your rating</legend>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  aria-pressed={rating === n}
                  className={`text-2xl ${n <= rating ? "text-amber-600" : "text-slate-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>
          <Field label="Your country (optional)">
            <input className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)} />
          </Field>
          <Field label="Your experience">
            <textarea className={inputClass} rows={3} value={text} onChange={(e) => setText(e.target.value)} required />
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Post review</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-slate-600">No reviews yet – be the first!</p>
      ) : (
        <ul className="space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <Rating value={r.rating} count={1} single />
                <span className="text-sm text-slate-700">
                  {r.author}, {r.country} · {r.date}
                </span>
              </div>
              <p className="mt-1">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
