import { BackgroundBeamsWithCollision } from "@/components/custom/backgrounds/background-with-beams";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.page(
  "Authentication",
  "Secure authentication pages for Fisio dashboard template. Login, register, and manage your account securely.",
  ["authentication", "login", "register", "security"]
);

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
