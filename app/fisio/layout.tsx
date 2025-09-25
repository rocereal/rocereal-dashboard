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
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-75 h-[100vh] bg-gradient-to-b from-violet-50 from-0% via-amber-50 via-50% to-fuchsia-50 to-100% dark:bg-gradient-to-b dark:from-stone-900 dark:from-0% dark:via-neutral-900 dark:via-50% dark:to-gray-900 dark:to-100% pointer-events-none"></div>
      {/* Content - Full width for landing page */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
