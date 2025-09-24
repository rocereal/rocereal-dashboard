/**
 * Centered Coming Soon Layout Component
 * Root layout for centered coming soon pages providing consistent styling and background
 * Wraps coming soon pages with gradient background and beam collision effects
 * Provides centered layout for coming soon pages with visual appeal
 * @param children - The coming soon page content to be rendered within the layout
 * @returns The complete layout structure for centered coming soon pages
 */

import { BackgroundBeamsWithCollision } from "@/components/backgrounds/background-with-beams";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.page(
  "Coming Soon",
  "Coming soon page for Fisio dashboard template. Stay updated with our latest features and releases.",
  ["coming soon", "launch", "updates", "features"]
);

/**
 * CenteredLayout component for coming soon pages
 * Provides a centered layout with gradient background and beam effects
 * Wraps coming soon pages with consistent styling and visual elements
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the centered coming soon layout
 */
export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Content */}
      <BackgroundBeamsWithCollision>{children}</BackgroundBeamsWithCollision>
    </div>
  );
}
