import { BackgroundBeamsWithCollision } from "@/components/custom/backgrounds/background-with-beams";

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
