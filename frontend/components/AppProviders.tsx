"use client";

import { Suspense, type ReactNode } from "react";

import { ThemeProvider } from "@/context/ThemeContext";
import ReduxProvider from "@/reduxStore/ReduxProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <ReduxProvider>{children}</ReduxProvider>
      </Suspense>
    </ThemeProvider>
  );
}
