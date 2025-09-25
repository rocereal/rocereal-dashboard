"use client";

import backgroundEight from "@/app/assets/images/background_eight.jpg";
import { OnboardingWizardSplit } from "@/components/onboarding/OnboardingWizardSplit";
import { StepFour } from "@/components/onboarding/StepFour";
import { Logo } from "@/components/shared/Logo";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

/**
 * RenderPage component for the final step of split-right onboarding
 * Client-side component that renders split-screen layout with completion form on right and background image on left
 * Manages loading state during final submission and navigation to dashboard
 * @returns JSX element representing the final onboarding step with visual design
 */
export default function RenderPage() {
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
                  index <= 3
                    ? "w-4 bg-primary rounded-sm"
                    : "w-6 h-1 bg-primary/20 rounded-full"
                }`}
              />
            ))}
          </div>

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
            skipHref="/onboarding/split-right/step-three"
          />
        </div>
      </div>
      <OnboardingWizardSplit
        image={backgroundEight}
        subtitle={onboardingSteps[3]?.subtitle}
        title={onboardingSteps[3]?.title}
      />
    </div>
  );
}
