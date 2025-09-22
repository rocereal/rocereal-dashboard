"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { StepOne } from "@/components/onboarding/StepOne";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

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
