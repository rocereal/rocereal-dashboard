/**
 * Split Left Step Three Onboarding Page Component
 * Third step of the split-screen onboarding flow with content on left side
 * Displays configuration/setup step with form for advanced user settings
 * Includes progress indicator and navigation to next/previous steps
 * Part of the multi-step onboarding process for new users
 */

"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { StepThree } from "@/components/onboarding/StepThree";
import { Separator } from "@/components/ui/separator";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

/**
 * StepThreePage component for the third step of split-left onboarding
 * Renders onboarding wizard sidebar and step three form content
 * Manages loading state during form submission and navigation
 * @returns JSX element representing the third onboarding step
 */
export default function StepThreePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForm = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <OnboardingWizard currentStep={3} />

      <Separator orientation="vertical" className="hidden lg:block mx-8" />
      <Separator orientation="horizontal" className="block lg:hidden my-8" />

      <div className="p-8 space-y-8 w-full lg:w-2/3 justify-center items-center">
        <div className="flex flex-col space-y-2 max-w-2xl mx-auto">
          <p className="text-sm text-primary font-semibold">
            Step 3 of {onboardingSteps.length}
          </p>
          <p className="text-base lg:text-3xl font-semibold">
            {onboardingSteps[2]?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {onboardingSteps[2]?.subtitle}
          </p>

          <StepThree
            onSubmit={handleForm}
            isLoading={isLoading}
            onboardingHref="/onboarding/split-left/step-four"
            skipHref="/onboarding/split-left/step-three"
          />
        </div>
      </div>
    </div>
  );
}
