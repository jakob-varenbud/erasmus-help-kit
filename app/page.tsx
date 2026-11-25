import Link from "next/link";
import { GlossaryList } from "@/components/Glossary";

const phases = [
  {
    title: "Before you arrive",
    sections: [
      { href: "/university", icon: "🎓", title: "University", text: "Find courses taught in English and build your 30 ECTS Learning Agreement." },
      { href: "/accommodation", icon: "🏠", title: "Accommodation", text: "Safe areas, trusted websites, scam warnings and what previous tenants say." },
    ],
  },
  {
    title: "After you arrive",
    sections: [
      { href: "/nif", icon: "📄", title: "NIF & other", text: "Get your tax number in 3 steps: documents, nearest office, transport pass." },
      { href: "/events", icon: "🎉", title: "Events", text: "Events from Nova FCT, ESN and others – meet new people this weekend." },
    ],
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-12 text-white shadow-lg sm:px-10 sm:py-16">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10" aria-hidden />
        <p className="relative text-sm font-semibold uppercase tracking-wider text-indigo-100">Nova FCT · Lisbon</p>
        <h1 className="relative mt-2 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Welcome to the Erasmus Help Kit</h1>
        <p className="relative mt-4 max-w-2xl text-lg text-indigo-50">
          All the information you need before and after arriving in Lisbon for your exchange semester – in one place.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link href="/university" className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-2.5 font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
            Start with your courses →
          </Link>
          <Link href="/events" className="inline-flex min-h-11 items-center rounded-full px-5 py-2.5 font-semibold text-white ring-1 ring-white/70 hover:bg-white/10">
            See events
          </Link>
        </div>
      </section>

      {phases.map((phase, pi) => (
        <section key={phase.title} aria-labelledby={`phase-${pi}`}>
          <h2 id={`phase-${pi}`} className="mb-4 flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-base text-white" aria-hidden>
              {pi + 1}
            </span>
            {phase.title}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {phase.sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-300"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-2xl" aria-hidden>
                  {s.icon}
                </span>
                <span className="block">
                  <span className="block text-xl font-semibold text-slate-900">{s.title}</span>
                  <span className="mt-1 block text-slate-700">{s.text}</span>
                  <span className="mt-3 block text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 group-hover:decoration-indigo-700">
                    Open {s.title} <span className="inline-block transition group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="glossary" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h2 id="glossary" className="text-2xl font-bold tracking-tight text-slate-900">
          Erasmus words explained
        </h2>
        <p className="mb-6 mt-1 text-slate-700">
          New to all this? Here are the terms you will see on this website. Words with a dotted underline can also be clicked anywhere on the site.
        </p>
        <GlossaryList />
      </section>
    </div>
  );
}
