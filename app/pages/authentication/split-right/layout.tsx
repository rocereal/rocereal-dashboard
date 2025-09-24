/**
 * Split Right Authentication Layout Component
 * Root layout for split-screen authentication pages with carousel on left and form on right
 * Wraps authentication pages with two-column layout and gradient background
 * Provides split layout for login, register, and password recovery pages
 * @param children - The authentication page content to be rendered in the right column
 * @returns The complete layout structure for split-right authentication pages
 */

import AuthCarousel from "@/components/forms/auth/AuthCarousel";
import { sliders } from "@/data/sliders";

/**
 * SplitRightLayout component for authentication pages
 * Provides a two-column layout with carousel on the left and form on the right
 * Uses responsive design that stacks on mobile devices
 * @param children - The page content to be rendered in the right column
 * @returns JSX element representing the split-right authentication layout
 */
export default function SplitRightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row space-4">
      {/* Right Side - Illustration */}
      <div className="flex w-full lg:w-3/5 items-center justify-center">
        <AuthCarousel slides={sliders.slice(4, 8)} type="right" />
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
