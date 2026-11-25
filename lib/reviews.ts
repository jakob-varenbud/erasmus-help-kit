"use client";

// Mock student reviews for courses, accommodation and NIF offices.
// Reviews added by the user are kept in the browser (localStorage) – no backend.
import { useStoredState } from "./api";

export type Review = {
  id: string;
  targetId: string; // id of a course, accommodation or office
  author: string;
  country: string;
  rating: number; // 1–5
  text: string;
  date: string; // yyyy-mm
};

const r = (targetId: string, author: string, country: string, rating: number, text: string, date: string): Review => ({
  id: `${targetId}-${author}`,
  targetId,
  author,
  country,
  rating,
  text,
  date,
});

export const mockReviews: Review[] = [
  /* ---- Courses ---- */
  r("c1", "Anna", "Poland", 4, "Interesting topics, the professor explains everything in English. Exam is hard.", "2026-02"),
  r("c1", "Jonas", "Germany", 5, "Best course of my exchange. Small group, lots of discussion.", "2025-07"),
  r("c2", "Marie", "France", 5, "Very practical, we built prototypes in groups with Portuguese students.", "2026-02"),
  r("c2", "Luca", "Italy", 4, "Lots of group work, but you learn a lot. Fully in English.", "2025-07"),
  r("c2", "Sara", "Spain", 4, "Nice labs, the final project takes time.", "2025-02"),
  r("c3", "Tom", "Netherlands", 3, "Lectures in English but some slides were only in Portuguese.", "2026-02"),
  r("c3", "Eva", "Slovakia", 4, "Good projects, fair grading.", "2025-07"),
  r("c4", "Mateus", "Brazil", 5, "Great labs with real cameras and datasets.", "2026-02"),
  r("c5", "Ines", "Spain", 3, "OK course, a bit theoretical.", "2025-07"),
  r("c6", "Klara", "Czechia", 4, "Classic databases course, well organised.", "2026-02"),
  r("c6", "Pierre", "France", 4, "Labs were helpful, teacher answers e-mails quickly.", "2025-02"),
  r("c7", "Jakob", "Austria", 5, "Real project with a client. Very useful.", "2026-02"),
  r("c8", "Lena", "Germany", 4, "Heavy on maths, but very good.", "2025-07"),
  r("c9", "Mikkel", "Denmark", 2, "Only in Portuguese – hard to follow without the language.", "2025-02"),
  r("c10", "Elena", "Russia", 2, "Taught in Portuguese, exams too.", "2025-07"),
  r("c11", "Sofie", "Belgium", 4, "Short and easy 3 ECTS, nice excursions.", "2026-02"),
  r("c12", "Paul", "Germany", 5, "Must have! Helps a lot in daily life.", "2026-02"),
  r("c12", "Nora", "Norway", 5, "Fun teacher and you meet other Erasmus students.", "2025-07"),
  r("c13", "Victor", "Romania", 4, "Interesting projects with search engines.", "2025-07"),

  /* ---- Accommodation ---- */
  r("a1", "Julia", "Austria", 5, "Landlord was super helpful, contract registered at Finanças without asking.", "2026-02"),
  r("a1", "Marco", "Italy", 4, "Nice flatmates, tram stop is 3 minutes away.", "2025-07"),
  r("a2", "Hanna", "Finland", 5, "So close to campus, I could sleep longer every day!", "2026-02"),
  r("a2", "Diego", "Spain", 4, "Simple room, but quiet and safe. Not much to do in the evening.", "2025-07"),
  r("a3", "Chloe", "France", 4, "Beautiful studio, but very expensive and long commute.", "2025-07"),
  r("a4", "Peter", "Hungary", 1, "Asked me to pay the deposit before viewing. I lost 300 €. Avoid!", "2026-02"),
  r("a4", "Laura", "Germany", 1, "Same story – fake listing.", "2025-07"),
  r("a5", "Ola", "Poland", 4, "Big student house, always someone to go out with.", "2026-02"),
  r("a6", "Emil", "Sweden", 3, "Nice room, but no official contract, so I couldn't use it for my NIF.", "2025-07"),
  r("a7", "Bea", "Brazil", 4, "Charming area, many stairs though.", "2026-02"),
  r("a8", "Kai", "Germany", 2, "Cheap but the commute was over an hour each way.", "2025-07"),

  /* ---- NIF offices ---- */
  r("o8", "Anna", "Poland", 5, "Came at 8:30 without appointment, done in 40 minutes. Staff speaks English.", "2026-09"),
  r("o8", "Matteo", "Italy", 4, "Some waiting, but worked with just my passport.", "2026-02"),
  r("o6", "Lucas", "Brazil", 4, "Had to bring proof of address, then no problem.", "2026-09"),
  r("o4", "Clara", "Spain", 4, "Central and quite fast in the morning.", "2026-09"),
  r("o4", "Finn", "Ireland", 3, "Long queue after 10 am – go early.", "2026-02"),
  r("oa", "Hanna", "Finland", 5, "Best option if you live in Almada, close to the campus tram.", "2026-09"),
  r("o1", "Paul", "Germany", 1, "Waited 3 hours and was sent home without NIF.", "2026-09"),
  r("o3", "Sofia", "Brazil", 2, "They told me to come back with an appointment.", "2026-02"),
];

export function useReviews() {
  const [own, setOwn] = useStoredState<Review[]>("ehk-reviews", []);
  const all = [...own, ...mockReviews];

  const forTarget = (id: string) => all.filter((x) => x.targetId === id);
  const average = (id: string) => {
    const list = forTarget(id);
    return list.length ? list.reduce((s, x) => s + x.rating, 0) / list.length : 0;
  };
  const add = (review: Omit<Review, "id" | "date">) => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setOwn([{ ...review, id: `own-${now.getTime()}`, date }, ...own]);
  };

  /** How many reviewers were happy (4–5 stars) – used to compare accommodations. */
  const happiness = (id: string) => {
    const list = forTarget(id);
    return { happy: list.filter((x) => x.rating >= 4).length, total: list.length };
  };

  return { forTarget, average, add, happiness };
}
