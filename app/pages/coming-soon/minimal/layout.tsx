/**
 * Minimal Coming Soon Layout Component
 * Root layout for minimal coming soon pages providing clean, simple styling
 * Wraps coming soon pages with subtle background pattern and centered content
 * Provides minimal layout for coming soon pages with focused user experience
 * @param children - The coming soon page content to be rendered within the layout
 * @returns The complete layout structure for minimal coming soon pages
 */

/**
 * MinimalLayout component for coming soon pages
 * Provides a clean, minimal layout with subtle background pattern
 * Centers content in a constrained width container for focused user experience
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the minimal coming soon layout
 */
export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Minimal Footer */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-muted-foreground">
          © 2025 Your Company. All rights reserved.
        </p>
      </div> */}
    </div>
  );
}
