"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { StepTwo } from "@/components/onboarding/StepTwo";
import { Separator } from "@/components/ui/separator";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

/**
 * RenderPage component for the second step of split-left onboarding
 * Client-side component that renders onboarding wizard sidebar and step two form content
 * Manages loading state during form submission and navigation
 * @returns JSX element representing the second onboarding step
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
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <OnboardingWizard currentStep={2} />

      <Separator orientation="vertical" className="hidden lg:block mx-8" />
      <Separator orientation="horizontal" className="block lg:hidden my-8" />

      <div className="p-8 space-y-8 w-full lg:w-2/3 justify-center items-center">
        <div className="flex flex-col space-y-2 max-w-2xl mx-auto">
          <p className="text-sm text-primary font-semibold">
            Step 2 of {onboardingSteps.length}
          </p>
          <p className="text-base lg:text-3xl font-semibold">
            {onboardingSteps[1]?.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {onboardingSteps[1]?.subtitle}
          </p>

          <StepTwo
            onSubmit={handleForm}
            isLoading={isLoading}
            onboardingHref="/onboarding/split-left/step-three"
            skipHref="/onboarding/split-left/step-three"
          />
        </div>
      </div>
    </div>
  );
}
