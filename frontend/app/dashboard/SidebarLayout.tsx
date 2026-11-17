"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { EllipsisVertical, LogOut, Settings, UserRound } from "lucide-react";
import { Popover } from "@base-ui/react/popover";

import { logout } from "@/api/auth-api";
import AreYouSureModal from "@/components/common/modals/AreYouSureModal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/reduxStore/hooks";
import { setSession } from "@/reduxStore/authSlice";
import type { Role } from "@/types/auth";
import { dashboardSectionsByRole } from "./DashboardNav";
import { DASHBOARD_ROUTES } from "./routes";

const defaultRole: Role = "ADMIN";

export default function SidebarLayout() {
  const session = useAppSelector((state) => state.auth.session);
  const pathname = usePathname();
  const role = session?.user.role ?? defaultRole;
  const userName = session ? `${session.user.email}`.trim() : "template@email.com";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 shrink-0 flex-row items-center border-b p-3">
        <div className="flex items-center gap-2 font-semibold">
          <SidebarTrigger />
          <span className="group-data-[collapsible=icon]:hidden">./init-Dashboard.sh</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {dashboardSectionsByRole[role].map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={pathname === item.href}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <ProfilePopover userName={userName} role={role} />
      </SidebarFooter>
    </Sidebar>
  );
}

interface ProfilePopoverProps {
  userName: string;
  role: Role;
}

function ProfilePopover({ userName, role }: ProfilePopoverProps) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Clear the local session even if the server cannot be reached.
    }
    dispatch(setSession(null));
    router.replace("/auth/signin");
  }

  return (
    <>
      <AreYouSureModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        variant="danger"
      />

      <Popover.Root open={profilePopoverOpen} onOpenChange={setProfilePopoverOpen}>
        <Popover.Trigger className="flex w-full items-center gap-3 rounded-md px-2 py-1 text-left outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium transition-all group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:-translate-x-1">
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-medium">{userName}</span>
            <span className="block text-xs text-muted-foreground">{role.replaceAll("_", " ")}</span>
          </span>
          <EllipsisVertical size={18} className="group-data-[collapsible=icon]:hidden" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="right" align="end" sideOffset={8} className="z-50 outline-none">
            <Popover.Popup className="min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[opacity,transform] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
              <Link
                href={DASHBOARD_ROUTES.PROFILE}
                onClick={() => setProfilePopoverOpen(false)}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <UserRound className="size-4" /> Profile
              </Link>
              <Link
                href={DASHBOARD_ROUTES.SETTINGS}
                onClick={() => setProfilePopoverOpen(false)}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="size-4" /> Settings
              </Link>
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  setProfilePopoverOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="size-4" /> Log out
              </button>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
