"use client";

import { Suspense, type ReactNode } from "react";

import { ThemeProvider } from "@/context/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen";
import ReduxProvider from "@/reduxStore/ReduxProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingScreen />}>
        <ReduxProvider>{children}</ReduxProvider>
      </Suspense>
    </ThemeProvider>
  );
}
