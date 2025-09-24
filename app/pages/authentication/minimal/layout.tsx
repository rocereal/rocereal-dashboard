/**
 * Minimal Authentication Layout Component
 * Root layout for minimal authentication pages providing clean, simple styling
 * Wraps authentication pages with subtle background pattern and centered content
 * Provides minimal layout for login, register, and password recovery pages
 * @param children - The authentication page content to be rendered within the layout
 * @returns The complete layout structure for minimal authentication pages
 */

/**
 * MinimalLayout component for authentication pages
 * Provides a clean, minimal layout with subtle background pattern
 * Centers content in a constrained width container for focused user experience
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the minimal authentication layout
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
