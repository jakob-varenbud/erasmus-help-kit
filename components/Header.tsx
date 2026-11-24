"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/university", label: "University" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/nif", label: "NIF & other" },
  { href: "/events", label: "Events" },
];

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(localStorage.getItem("ehk-user"));
    } catch {}
    setMenuOpen(false);
  }, [pathname]);

  function signOut() {
    try {
      localStorage.removeItem("ehk-user");
    } catch {}
    setUser(null);
  }

  const account = user ? (
    <button onClick={signOut} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50">
      {user} · Sign out
    </button>
  ) : (
    <Link href="/signin" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
      Sign in
    </Link>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm text-white">EH</span>
          Erasmus Help Kit
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <span className="ml-2">{account}</span>
        </nav>

        <button
          className="rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-slate-300 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2">{account}</div>
          </div>
        </nav>
      )}
    </header>
  );
}

function linkClass(active: boolean) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}
