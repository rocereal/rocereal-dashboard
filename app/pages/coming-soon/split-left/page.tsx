/**
 * Split Left Coming Soon Page Component
 * Coming soon page with split-screen layout displaying countdown timer and subscription form on left
 * Combines countdown timer, social proof, and email subscription components
 * Uses split-left layout with carousel on the right side for visual appeal
 * Builds anticipation for product launch with engaging split-screen UI
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountdownTimer from "../(components)/CountdownTimer";
import Subscribe from "../(components)/Form";
import SocialProof from "../(components)/SocialProof";

/**
 * SplitLeftPage component for displaying launch countdown and subscription in split layout
 * Renders countdown timer, social proof indicators, and email subscription form on left side
 * Provides engaging split-screen user experience to build anticipation for product launch
 * @returns JSX element representing the split-left coming soon page
 */
export default function SplitLeftPage() {
  return (
    <div className="space-y-8 max-w-md w-full">
      {/* Form */}

      <Card className="shadow-none !bg-transparent border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-start">
            Something Exciting is on the Way
          </CardTitle>
          <CardDescription className="text-start">
            We&apos;re working behind the scenes to bring you a fresh
            experience. Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CountdownTimer className={"!justify-start"} />
          <SocialProof className="!align-center !justify-center" />
          <Subscribe />
        </CardContent>
      </Card>
    </div>
  );
}
