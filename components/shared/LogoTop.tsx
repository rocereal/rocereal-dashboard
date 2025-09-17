"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";

export function LogoTop() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Logo className="size-12" />

          <div className="group-data-[state=collapsed]:hidden grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
              Fisio
            </span>
            <span className="truncate text-xs text-neutral-800 dark:text-neutral-200">
              Best Template
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
