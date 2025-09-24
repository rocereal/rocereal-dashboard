"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useLayoutConfig } from "@/lib/layout-config";
import { useEffect, useState } from "react";

export function SidebarToggle() {
  const { config } = useLayoutConfig();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During hydration, don't render to avoid mismatches
  if (!isHydrated) {
    return null;
  }

  // Only render if we're in sidebar mode
  if (config.layoutType !== "sidebar") {
    return null;
  }

  try {
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
  } catch (error) {
    // If useSidebar fails (no SidebarProvider), don't render anything
    return null;
  }
}
