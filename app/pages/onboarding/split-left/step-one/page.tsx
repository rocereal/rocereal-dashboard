/**
 * Split Left Step One Onboarding Page Component
 * First step of the split-screen onboarding flow with content on left side
 * Displays welcome/setup step with form for initial user information
 * Includes progress indicator and navigation to next step
 * Part of the multi-step onboarding process for new users
 */

"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { StepOne } from "@/components/onboarding/StepOne";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

/**
 * StepOnePage component for the first step of split-left onboarding
 * Renders onboarding wizard sidebar and step one form content
 * Manages loading state during form submission and navigation
 * @returns JSX element representing the first onboarding step
 */
export default function StepOnePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForm = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <OnboardingWizard currentStep={1} />

      <div className="p-8 space-y-8 w-full lg:w-2/3 justify-center items-center">
        <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
          <p className="text-sm text-primary font-semibold">
            Step 1 of {onboardingSteps.length}
          </p>
          <p className="text-base lg:text-3xl font-semibold">
            {onboardingSteps[0]?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {onboardingSteps[0]?.subtitle}
          </p>

          <StepOne
            onSubmit={handleForm}
            isLoading={isLoading}
            onboardingHref="/onboarding/split-left/step-two"
            skipHref="/onboarding/split-left/step-two"
          />
        </div>
      </div>
    </div>
  );
}
