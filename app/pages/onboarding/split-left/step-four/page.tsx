/**
 * Split Left Step Four Onboarding Page Component
 * Final step of the split-screen onboarding flow with content on left side and wizard on right
 * Displays completion/setup step with final form for user completion and dashboard navigation
 * Includes progress indicator and navigation to dashboard or back to previous steps
 * Part of the multi-step onboarding process for new users
 */

"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { StepFour } from "@/components/onboarding/StepFour";
import { Separator } from "@/components/ui/separator";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

/**
 * StepFourPage component for the final step of split-left onboarding
 * Renders split-screen layout with completion form on left and wizard sidebar on right
 * Manages loading state during final submission and navigation to dashboard
 * @returns JSX element representing the final onboarding step
 */
export default function StepFourPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForm = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <OnboardingWizard currentStep={4} />

      <Separator orientation="vertical" className="hidden lg:block mx-8" />
      <Separator orientation="horizontal" className="block lg:hidden my-8" />

      <div className="p-8 space-y-8 w-full lg:w-2/3 justify-center items-center">
        <div className="flex flex-col space-y-2 max-w-2xl mx-auto">
          <p className="text-sm text-primary font-semibold">
            Step 4 of {onboardingSteps.length}
          </p>
          <p className="text-base lg:text-3xl font-semibold">
            {onboardingSteps[3]?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {onboardingSteps[3]?.subtitle}
          </p>

          <StepFour
            onSubmit={handleForm}
            isLoading={isLoading}
            onboardingHref="/dashboard"
            skipHref="/onboarding/split-left/step-three"
          />
        </div>
      </div>
    </div>
  );
}
