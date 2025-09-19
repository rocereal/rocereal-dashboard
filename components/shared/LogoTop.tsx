"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

export function LogoTop() {
  const { toggleSidebar, state } = useSidebar();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

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
              Best Dashboard Template
            </span>
          </div>

          {/* Sidebar Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
