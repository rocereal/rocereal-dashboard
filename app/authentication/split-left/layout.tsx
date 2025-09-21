import AuthCarousel from "@/components/forms/auth/AuthCarousel";
import { sliders } from "@/data/sliders";

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
