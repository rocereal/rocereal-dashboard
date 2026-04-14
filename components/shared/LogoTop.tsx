"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { X } from "lucide-react";

export function LogoTop() {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="group h-auto py-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center!"
          onClick={toggleSidebar}
        >
          <Logo className="!w-8 !h-8 group-data-[collapsible=icon]:mx-auto" />

          <div className="group-data-[state=collapsed]:hidden grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
              RO CEREAL
            </span>
            <span className="truncate text-xs text-neutral-800 dark:text-neutral-200">
              Dashboard
            </span>
          </div>

          {/* Sidebar Trigger Icon */}
          <X className="h-4 w-4 flex lg:hidden ml-auto" />
          <span className="sr-only">Toggle sidebar</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
