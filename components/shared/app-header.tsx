"use client";

import {
  SidebarToggle,
  SearchBar,
  ThemeToggle,
  Notifications,
  FullscreenToggle,
  UserAccount,
} from "./header";

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 ${className}`}
    >
      {/* Left Section */}
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
