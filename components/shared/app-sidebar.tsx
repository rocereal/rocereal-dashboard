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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoTop />
      </SidebarHeader>
      <SidebarContent>
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
