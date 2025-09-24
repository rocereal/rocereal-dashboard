/**
 * Centered Authentication Layout Component
 * Root layout for centered authentication pages providing consistent styling and background
 * Wraps authentication pages with gradient background and beam collision effects
 * Provides centered layout for login, register, and password recovery pages
 * @param children - The authentication page content to be rendered within the layout
 * @returns The complete layout structure for centered authentication pages
 */

import { BackgroundBeamsWithCollision } from "@/components/custom/backgrounds/background-with-beams";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.page(
  "Authentication",
  "Secure authentication pages for Fisio dashboard template. Login, register, and manage your account securely.",
  ["authentication", "login", "register", "security"]
);

/**
 * CenteredLayout component for authentication pages
 * Provides a centered layout with gradient background and beam effects
 * Wraps all centered authentication pages with consistent styling
 * @param children - The page content to be rendered within the layout
 * @returns JSX element representing the centered authentication layout
 */
export default function CenteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Content */}
      <BackgroundBeamsWithCollision>{children}</BackgroundBeamsWithCollision>
    </div>
  );
}
