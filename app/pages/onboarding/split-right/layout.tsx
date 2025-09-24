/**
 * Split Right Onboarding Layout Component
 * Root layout for split-screen onboarding pages with content on right side
 * Wraps onboarding step pages with consistent layout structure
 * Provides full-screen container for onboarding flow with right-aligned content
 * @param children - The onboarding step content to be rendered within the layout
 * @returns The complete layout structure for split-right onboarding pages
 */

/**
 * SplitRightLayout component for onboarding pages with right-aligned content
 * Provides full-screen container for onboarding steps
 * Wraps all split-right onboarding pages with consistent layout structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the split-right onboarding layout
 */
export default function SplitRightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen w-full">{children}</div>;
}
