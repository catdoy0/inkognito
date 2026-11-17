"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import DarkModeButton from "@/components/widgets/button/DarkModeButton";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-20 transition-colors dark:bg-[#0b1a2e] lg:w-1/2">
      <Link
        href="/"
        aria-label="Back to home"
        className="absolute left-6 top-6 grid size-9 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ArrowLeft size={17} />
      </Link>
      <DarkModeButton className="absolute right-6 top-6" />
      {children}
    </section>
  );
}
