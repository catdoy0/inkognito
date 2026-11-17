"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import LoadingScreen from "@/components/LoadingScreen";
import { useAppSelector } from "@/reduxStore/hooks";
import { dashboardSectionsByRole } from "@/app/dashboard/DashboardNav";

export default function RoleGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAppSelector((state) => state.auth.session);
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked);
  const role = session?.user.role ?? "GUEST";

  const allowedPaths = dashboardSectionsByRole[role]
    .flatMap((section) => section.items.map((item) => item.href))
    .filter(Boolean);
  const isAllowed = allowedPaths.includes(pathname);
  const redirectPath = allowedPaths[0] ?? "/auth/signin";

  useEffect(() => {
    if (sessionChecked && session && !isAllowed) router.replace(redirectPath);
  }, [isAllowed, redirectPath, router, session, sessionChecked]);

  if (!sessionChecked || !session || !isAllowed) return <LoadingScreen />;

  return children;
}
