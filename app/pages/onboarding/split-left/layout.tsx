/**
 * Split Left Onboarding Layout Component
 * Root layout for split-screen onboarding pages with content on left side
 * Wraps onboarding step pages with consistent layout and metadata
 * Provides full-screen container for onboarding flow with left-aligned content
 * @param children - The onboarding step content to be rendered within the layout
 * @returns The complete layout structure for split-left onboarding pages
 */

import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.onboarding();

/**
 * SplitLeftLayout component for onboarding pages with left-aligned content
 * Provides full-screen container for onboarding steps
 * Wraps all split-left onboarding pages with consistent layout structure
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the split-left onboarding layout
 */
export default function SplitLeftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen w-full">{children}</div>;
}
