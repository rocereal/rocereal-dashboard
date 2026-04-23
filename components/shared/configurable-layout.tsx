"use client";

import { useLayoutConfig } from "@/lib/layout-config";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConfigurableLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function ConfigurableLayout({
  children,
  header,
  footer,
  sidebar,
  className,
}: ConfigurableLayoutProps) {
  const { config } = useLayoutConfig();
  const isMobile = useIsMobile();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use the data attribute set by the script as the initial state
  const [initialLayout, setInitialLayout] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInitialLayout(document.documentElement.getAttribute("data-layout"));
    }
  }, []);

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  const isHeaderNav = config.layoutType === "header-nav";

  // Use initial layout from script during hydration, then use actual config
  const effectiveLayoutType = !isHydrated
    ? initialLayout || "sidebar"
    : config.layoutType;
  const effectiveIsHeaderNav = effectiveLayoutType === "header-nav";

  // Always show sidebar until we're certain, unless we know it should be header-nav
  const shouldShowSidebar = isMobile || !effectiveIsHeaderNav;

  // Don't render anything until we have the initial layout info
  if (!isHydrated && initialLayout === null) {
    return null; // or a simple loading state
  }

  if (shouldShowSidebar && sidebar) {
    // When sidebar is shown, use SidebarProvider structure
    return (
      <SidebarProvider>
        {sidebar}
        <SidebarInset>
          <div
            className={cn(
              "flex flex-col min-h-screen bg-background font-sans antialiased overflow-x-hidden",
              fontSizeClasses[config.fontSize],
              className
            )}
          >
            {/* Header — full width, no extra wrapper */}
            {config.headerVisible && header && header}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className={cn("mx-auto px-4 py-8 sm:px-6 lg:px-8", maxWidthClasses[config.maxWidth])}>
                {children}
              </div>
            </main>

            {/* Footer */}
            {config.footerVisible && footer && (
              <footer className="border-t bg-muted/10">
                <div
                  className={cn(
                    "mx-auto px-4 py-8 sm:px-6 lg:px-8",
                    maxWidthClasses[config.maxWidth]
                  )}
                >
                  {footer}
                </div>
              </footer>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  } else {
    // When sidebar is hidden (header-nav mode), render without SidebarProvider
    return (
      <div
        className={cn(
          "flex flex-col min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSizeClasses[config.fontSize],
          className
        )}
      >
        {/* Header — full width, no extra wrapper */}
        {config.headerVisible && header && header}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className={cn("mx-auto px-4 py-8 sm:px-6 lg:px-8", maxWidthClasses[config.maxWidth])}>
            {children}
          </div>
        </main>

        {/* Footer */}
        {config.footerVisible && footer && (
          <footer className="border-t bg-muted/10">
            <div
              className={cn(
                "mx-auto px-4 py-8 sm:px-6 lg:px-8",
                maxWidthClasses[config.maxWidth]
              )}
            >
              {footer}
            </div>
          </footer>
        )}
      </div>
    );
  }
}
