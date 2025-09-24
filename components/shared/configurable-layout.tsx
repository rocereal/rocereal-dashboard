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

  // On mobile, always show sidebar. On desktop, hide sidebar only in header-nav mode
  // During hydration, be conservative and don't show sidebar to avoid flash
  const shouldShowSidebar = isHydrated ? isMobile || !isHeaderNav : false;

  if (shouldShowSidebar && sidebar) {
    // When sidebar is shown, use SidebarProvider structure
    return (
      <SidebarProvider>
        {sidebar}
        <SidebarInset>
          <div
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSizeClasses[config.fontSize],
              className
            )}
          >
            {/* Header */}
            {config.headerVisible && header && (
              <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div
                  className={cn(
                    "mx-auto px-4 sm:px-6 lg:px-8",
                    maxWidthClasses[config.maxWidth]
                  )}
                >
                  {header}
                </div>
              </header>
            )}

            {/* Main Content */}
            <main className="flex-1">
              <div
                className={cn(
                  "mx-auto px-4 py-8 sm:px-6 lg:px-8",
                  maxWidthClasses[config.maxWidth]
                )}
              >
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
          "min-h-screen bg-background font-sans antialiased",
          fontSizeClasses[config.fontSize],
          className
        )}
      >
        {/* Header */}
        {config.headerVisible && header && (
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div
              className={cn(
                "mx-auto px-4 sm:px-6 lg:px-8",
                maxWidthClasses[config.maxWidth]
              )}
            >
              {header}
            </div>
          </header>
        )}

        {/* Main Content - full width when no sidebar */}
        <main className="flex-1">
          <div
            className={cn(
              "mx-auto px-4 py-8 sm:px-6 lg:px-8",
              maxWidthClasses[config.maxWidth]
            )}
          >
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
