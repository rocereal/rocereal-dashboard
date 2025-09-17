import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Chrome } from "lucide-react";
import { Facebook, Google } from "@/components/svg/Icons";

interface SocialLoginButtonsProps {
  separatorText?: string;
  facebookText?: string;
  googleText?: string;
  onFacebookClick?: () => void;
  onGoogleClick?: () => void;
  className?: string;
}

export function SocialLoginButtons({
  separatorText = "Or continue with",
  facebookText = "Facebook",
  googleText = "Google",
  onFacebookClick,
  onGoogleClick,
  className = "",
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          {separatorText}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className={`w-full ${className}`}
          onClick={onGoogleClick}
        >
          <Google className="mr-2 h-4 w-4" />
          {googleText}
        </Button>
        <Button
          variant="outline"
          className={`w-full ${className}`}
          onClick={onFacebookClick}
        >
          <Facebook className="mr-2 h-4 w-12" />
          {facebookText}
        </Button>
      </div>
    </div>
  );
}
