"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { StepFour } from "@/components/onboarding/StepFour";
import { Separator } from "@/components/ui/separator";
import { onboardingSteps } from "@/data/onboarding";
import { useState } from "react";

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
            skipHref="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
