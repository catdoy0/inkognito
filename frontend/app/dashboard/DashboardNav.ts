import { CreditCardPlus, LayoutDashboard, Settings, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Role } from "@/types/auth";
import { DASHBOARD_ROUTES } from "./routes";

export interface DashboardSidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardSidebarSection {
  label: string;
  items: DashboardSidebarItem[];
}

const overview = { label: "Overview", href: DASHBOARD_ROUTES.ROOT, icon: LayoutDashboard };
const profile = { label: "Profile", href: DASHBOARD_ROUTES.PROFILE, icon: UserRound };
const topUp = { label: "Top-up", href: DASHBOARD_ROUTES.TOP_UP, icon: CreditCardPlus };
const settings = { label: "Settings", href: DASHBOARD_ROUTES.SETTINGS, icon: Settings };

const userSections: DashboardSidebarSection[] = [
  { label: "Workspace", items: [overview] },
  { label: "Account", items: [topUp, settings] },
];

const administratorSections: DashboardSidebarSection[] = [
  { label: "Workspace", items: [overview] },
  { label: "Manage", items: [profile, topUp, settings] },
];

export const dashboardSectionsByRole: Record<Role, DashboardSidebarSection[]> = {
  ADMIN: administratorSections,
  USER: userSections,
  GUEST: userSections,
};

export function getNavLabel(role: Role, pathname: string): string {
  for (const section of dashboardSectionsByRole[role]) {
    const item = section.items.find((entry) => entry.href === pathname);
    if (item) return item.label;
  }

  return "Dashboard";
}
