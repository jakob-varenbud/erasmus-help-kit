import Link from "next/link";

const sections = [
  { href: "/university", icon: "🎓", title: "University", text: "Find courses taught in English and build your Learning Agreement." },
  { href: "/accommodation", icon: "🏠", title: "Accommodation", text: "Safe areas, trusted websites, scam warnings and contract tips." },
  { href: "/nif", icon: "📄", title: "NIF & other", text: "How to get your NIF, which documents you need and where to go." },
  { href: "/events", icon: "🎉", title: "Events", text: "Events from Nova FCT, ESN and others – meet new people." },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-12 text-white shadow-lg sm:px-10 sm:py-16">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10" aria-hidden />
        <p className="relative text-sm font-semibold uppercase tracking-wider text-indigo-100">Nova FCT · Lisbon</p>
        <h1 className="relative mt-2 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Welcome to the Erasmus Help Kit</h1>
        <p className="relative mt-4 max-w-2xl text-lg text-indigo-50">
          All the information you need before and after arriving in Lisbon for your exchange semester – in one place.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link href="/university" className="rounded-full bg-white px-5 py-2.5 font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
            Get started
          </Link>
          <Link href="/events" className="rounded-full px-5 py-2.5 font-semibold text-white ring-1 ring-white/60 hover:bg-white/10">
            See events
          </Link>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-300"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-2xl" aria-hidden>
              {s.icon}
            </span>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">{s.title}</h2>
            <p className="mt-1 text-slate-600">{s.text}</p>
            <p className="mt-4 text-sm font-semibold text-indigo-700">
              Open <span className="inline-block transition group-hover:translate-x-1">→</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
