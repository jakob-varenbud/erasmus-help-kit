import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Erasmus Help Kit",
  description: "Everything Erasmus students need for a semester at Nova FCT in Lisbon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Suspense>
          <Header />
        </Suspense>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          Erasmus Help Kit · IPM 2026/2027 · Group 9 · Prototype with mock data
        </footer>
      </body>
    </html>
  );
}
