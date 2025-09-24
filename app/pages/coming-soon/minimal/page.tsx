/**
 * Minimal Coming Soon Page Component
 * Coming soon page with minimal layout displaying countdown timer and subscription form
 * Combines countdown timer, social proof, and email subscription components
 * Uses minimal layout with subtle background pattern for clean appearance
 * Builds anticipation for product launch with focused UI elements
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
 * ComingSoonPage component for displaying launch countdown and subscription
 * Renders countdown timer, social proof indicators, and email subscription form
 * Provides clean, minimal user experience to build anticipation for product launch
 * @returns JSX element representing the minimal coming soon page
 */
export default function ComingSoonPage() {
  return (
    <div className="space-y-8 max-w-md w-full">
      {/* Form */}

      <Card className="backdrop-blur-sm shadow-xs border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Something Exciting is on the Way
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;re working behind the scenes to bring you a fresh
            experience. Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CountdownTimer className={"!justify-center"} />
          <SocialProof className="items-center justify-center text-center" />
          <Subscribe />
        </CardContent>
      </Card>
    </div>
  );
}
