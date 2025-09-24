"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useLayoutConfig } from "@/lib/layout-config";
import { useEffect, useState } from "react";

// Custom hook to safely use sidebar
function useSafeSidebar() {
  try {
    return { data: useSidebar(), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export function SidebarToggle() {
  const { config } = useLayoutConfig();
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: sidebarState } = useSafeSidebar();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During hydration, don't render to avoid mismatches
  if (!isHydrated) {
    return null;
  }

  // Only render if we're in sidebar mode and sidebar is available
  if (config.layoutType !== "sidebar" || !sidebarState) {
    return null;
  }

  const { toggleSidebar, state } = sidebarState;

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
