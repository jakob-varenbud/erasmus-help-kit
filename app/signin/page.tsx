"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, PageTitle, inputClass } from "@/components/ui";

// Mock sign in – no real authentication, the name is only stored in the browser.
export default function SignIn() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      localStorage.setItem("ehk-user", name || email || "Student");
    } catch {}
    router.push("/");
  }

  return (
    <div className="max-w-md">
      <PageTitle subtitle="Save your courses, events and reviews.">Sign in</PageTitle>
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Field label="Name">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="University e-mail">
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <input type="password" className={inputClass} />
        </Field>
        <Button type="submit">Sign in</Button>
        <p className="text-sm text-slate-600">Prototype: any input works.</p>
      </form>
    </div>
  );
}
