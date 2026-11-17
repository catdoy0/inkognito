"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "@/reduxStore/hooks";

export default function RedirectSignedInUser({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const session = useAppSelector((state) => state.auth.session);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);
  const shouldRedirect = sessionChecked && session !== null;

  useEffect(() => {
    if (shouldRedirect) router.replace("/dashboard");
  }, [router, shouldRedirect]);

  useEffect(() => setMounted(true), []);

  if (!mounted || !sessionChecked || shouldRedirect) return <LoadingScreen />;

  return children;
}
