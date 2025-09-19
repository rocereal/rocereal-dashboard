"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { menudata } from "@/data/menu";
import { LogoTop } from "./LogoTop";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoTop />
      </SidebarHeader>
      <SidebarContent
        className={
          state === "collapsed"
            ? "overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
            : ""
        }
      >
        <NavMain items={menudata.navMain} />
        {/* <NavProjects projects={menudata.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={menudata.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
