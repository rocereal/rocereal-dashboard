/**
 * Fisio Landing Page Layout Component
 * Root layout for Fisio landing page providing full-width, engaging design
 * Wraps landing page content with modern styling and optimal user experience
 * Provides Fisio layout for dashboard promotion and feature showcase
 * @param children - The landing page content to be rendered within the layout
 * @returns The complete layout structure for Fisio landing page
 */

/**
 * FisioLayout component for landing page
 * Provides a modern, full-width layout for the dashboard landing page
 * Optimized for promotional content, hero sections, and feature showcases
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the Fisio landing page layout
 */
export default function FisioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30 min-h-screen">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,1) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      {/* Content - Full width for landing page */}
      <div className="relative">{children}</div>
    </div>
  );
}
