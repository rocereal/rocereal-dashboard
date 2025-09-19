"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8"
      >
        {state === "expanded" ? (
          <Menu className="h-4 w-4" />
        ) : (
          <X className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <Separator orientation="vertical" className="h-6" />
    </>
  );
}
