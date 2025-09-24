"use client";

import { useLayoutConfig } from "@/lib/layout-config";
import { menudataMobile } from "@/data/menu";
import {
  SidebarToggle,
  SearchBar,
  ThemeToggle,
  Notifications,
  FullscreenToggle,
  UserAccount,
} from "./header";
import { HeaderNav } from "./header-nav";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const { config } = useLayoutConfig();
  const isMobile = useIsMobile();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isHeaderNav = config.layoutType === "header-nav";
  const showHeaderNav = isHeaderNav && !isMobile;

  // During hydration, render a consistent layout to avoid mismatches
  if (!isHydrated) {
    return (
      <header
        className={`sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 ${className}`}
      >
        {/* Left Section - SidebarToggle handles hydration */}
        <SidebarToggle />
        <SearchBar />

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Notifications />
          <FullscreenToggle />
          <UserAccount />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 ${className}`}
    >
      {/* Left Section - SidebarToggle handles its own visibility */}
      <SidebarToggle />
      <SearchBar />

      {/* Navigation - only show header nav when IN header-nav mode and NOT mobile */}
      {showHeaderNav && <HeaderNav items={menudataMobile.navMain} />}

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Notifications />
        <FullscreenToggle />
        <UserAccount />
      </div>
    </header>
  );
}
