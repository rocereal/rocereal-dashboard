"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { menudata } from "@/data/menu";
import { useSession } from "next-auth/react";
import { LogoTop } from "./LogoTop";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name ?? "Utilizator",
    email: session?.user?.email ?? "",
    avatar: session?.user?.image ?? "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoTop />
      </SidebarHeader>
      <SidebarContent
        className={
          state === "collapsed"
            ? "!overflow-y-auto max-h-[calc(100vh-10rem)]"
            : ""
        }
      >
        <NavMain items={menudata.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
