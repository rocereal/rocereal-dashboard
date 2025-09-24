/**
 * Split Left Authentication Layout Component
 * Root layout for split-screen authentication pages with form on left and carousel on right
 * Wraps authentication pages with two-column layout and gradient background
 * Provides split layout for login, register, and password recovery pages
 * @param children - The authentication page content to be rendered in the left column
 * @returns The complete layout structure for split-left authentication pages
 */

import AuthCarousel from "@/components/auth/AuthCarousel";
import { sliders } from "@/data/sliders";

/**
 * SplitLeftLayout component for authentication pages
 * Provides a two-column layout with form on the left and carousel on the right
 * Uses responsive design that stacks on mobile devices
 * @param children - The page content to be rendered in the left column
 * @returns JSX element representing the split-left authentication layout
 */
export default function SplitLeftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20 order-2 lg:order-1">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right Side - Illustration */}
      <div className="flex flex-1 items-center justify-center order-1 lg:order-2">
        <AuthCarousel slides={sliders.slice(0, 4)} type="left" />
      </div>
    </div>
  );
}
