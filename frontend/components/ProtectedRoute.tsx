"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "@/reduxStore/hooks";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const session = useAppSelector((state) => state.auth.session);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);
  const shouldRedirect = sessionChecked && session === null;

  useEffect(() => {
    if (shouldRedirect) router.replace("/");
  }, [router, shouldRedirect]);

  useEffect(() => setMounted(true), []);

  // Wait until the client has hydrated and the refresh check has completed.
  // ReduxProvider's global overlay covers this route during the same interval.
  if (!mounted || !sessionChecked) return <LoadingScreen />;

  if (session) return children;

  if (shouldRedirect) return <LoadingScreen />;

  return children;
}
