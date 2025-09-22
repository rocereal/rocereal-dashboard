import AuthCarousel from "@/components/forms/auth/AuthCarousel";
import { sliders } from "@/data/sliders";

export default function SplitLeftLayout({
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
