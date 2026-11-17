"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DarkModeButton from "@/components/widgets/button/DarkModeButton";
import { useAppSelector } from "@/reduxStore/hooks";
import type { Role } from "@/types/auth";
import SidebarLayout from "./SidebarLayout";
import { getNavLabel } from "./DashboardNav";

const defaultRole: Role = "ADMIN";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const session = useAppSelector((state) => state.auth.session);
  const pathname = usePathname();
  const role = session?.user.role ?? defaultRole;
  const pageTitle = getNavLabel(role, pathname);
  const credits = session?.user.credits_centavos;

  return (
    <SidebarProvider>
      <SidebarLayout />

      <SidebarInset className="min-h-svh min-w-0">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 dark:bg-[#171717]">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <ChevronRight className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeButton />
            {credits !== undefined && <span>₱{(credits / 100).toFixed(2)}</span>}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 dark:bg-zinc-900">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
