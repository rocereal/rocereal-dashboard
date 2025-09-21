"use client";

import { useLayoutConfig } from "@/lib/layout-config";
import { cn } from "@/lib/utils";

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

      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside
            className={cn(
              "flex-shrink-0 border-r bg-muted/10 transition-all duration-300",
              config.sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            <div className="flex h-full flex-col">{sidebar}</div>
          </aside>
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
      </div>

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
