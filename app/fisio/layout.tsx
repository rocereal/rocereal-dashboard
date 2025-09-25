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
      {/* Content - Full width for landing page */}
      <div className="relative">{children}</div>
    </div>
  );
}
