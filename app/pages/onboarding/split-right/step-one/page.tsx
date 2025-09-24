/**
 * Split Right Step One Onboarding Page Component
 * First step of the split-screen onboarding flow with content on right side and image on left
 * Displays welcome/setup step with form for initial user information and visual background
 * Includes progress indicator and navigation to next step
 * Part of the multi-step onboarding process for new users with enhanced visual design
 */

"use client";

import backgroundFive from "@/app/assets/images/background_five.jpg";
import { OnboardingWizardSplit } from "@/components/onboarding/OnboardingWizardSplit";
import { StepOne } from "@/components/onboarding/StepOne";
import { Logo } from "@/components/shared/Logo";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

/**
 * StepOnePage component for the first step of split-right onboarding
 * Renders split-screen layout with form on right and background image on left
 * Manages loading state during form submission and navigation
 * @returns JSX element representing the first onboarding step with visual design
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
    <div className="min-h-screen flex flex-col-reverse lg:flex-row w-full">
      <div className="p-8 space-y-8 w-full lg:w-1/2 justify-center items-center">
        <div className="text-center hidden lg:flex">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
            <Logo />
          </div>
        </div>
        <div className="flex flex-col space-y-4 max-w-xl mx-auto">
          <div className="flex flex-row space-x-4">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-full ${
                  index === 0
                    ? "w-4 bg-primary rounded-sm"
                    : "w-6 h-1 bg-primary/20 rounded-full"
                }`}
              />
            ))}
          </div>

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
            onboardingHref="/onboarding/split-right/step-two"
            skipHref="/onboarding/split-right/step-two"
          />
        </div>
      </div>
      <OnboardingWizardSplit
        image={backgroundFive}
        subtitle={onboardingSteps[0]?.subtitle}
        title={onboardingSteps[0]?.title}
      />
    </div>
  );
}
