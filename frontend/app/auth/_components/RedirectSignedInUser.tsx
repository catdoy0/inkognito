"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/reduxStore/hooks";

export default function RedirectSignedInUser({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useAppSelector((state) => state.auth.session);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);
  const shouldRedirect = sessionChecked && session !== null && session.user.role !== "GUEST";

  useEffect(() => {
    if (shouldRedirect) router.replace("/dashboard");
  }, [router, shouldRedirect]);

  return children;
}
