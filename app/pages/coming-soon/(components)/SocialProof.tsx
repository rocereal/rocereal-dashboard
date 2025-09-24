/**
 * Social Proof Component
 * Displays social proof elements to build trust and encourage sign-ups on coming soon pages
 * Shows user avatars and subscriber count to demonstrate popularity
 * Includes gradient avatar placeholders and subscriber statistics
 * Used to increase conversion rates by showing community engagement
 * @param className - Additional CSS classes for styling
 * @returns JSX element representing the social proof display
 */

import { cn } from "@/lib/utils";

interface SocialProofProps {
  className?: string;
}

/**
 * SocialProof component for displaying community engagement metrics
 * Renders avatar placeholders and subscriber count to build trust
 * Shows visual indicators of existing user base and popularity
 * @param className - Additional CSS classes for custom styling
 * @returns JSX element representing the social proof section
 */
export default function SocialProof({ className }: SocialProofProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex -space-x-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-red-500 border"></div>
        <div className="w-10 h-10 rounded-full bg-gray-800 border flex items-center justify-center">
          <span className="text-white text-xs font-semibold">12k+</span>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-muted-foreground">
        <span className="font-semibold">12,000+ people</span> already joined the
        Fisio&apos;s
        <br />
        plan. We&apos;ll let you know when we launch!
      </div>
    </div>
  );
}
