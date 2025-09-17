"use client";

import { StepOne } from "@/components/onboarding/StepOne";
import { Separator } from "@/components/ui/separator";
import { onboardingSteps } from "@/data/onboarding";
import { Info, Check } from "lucide-react";
import { useState } from "react";

export default function StepOnePage() {
  const [isLoading, setIsLoading] = useState(false);
  const currentStep = 1; // You can make this dynamic based on your routing

  const handleForm = async (data: any) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row space-8 w-full">
      <div className="mx-auto flex flex- w-full">
        <div className="flex flex-wrap w-full">
          <div className="lg:w-1/3 w-full bg-neutral-100 dark:bg-slate-900 h-full p-8 space-y-4">
            <div className="flex flex-row space-x-2 items-center max-w-md">
              <Info className="w-4 h-4" />
              <p className="text-sm text-muted-foreground">
                Get started with your free account. No credit card required.
              </p>
            </div>
            {onboardingSteps?.map((item, index: number) => (
              <div className="flex relative pb-6" key={index}>
                {index < onboardingSteps.length - 1 && (
                  <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                    <div
                      className={`h-full w-[0.5]  ${
                        index + 1 === currentStep
                          ? "bg-primary"
                          : "bg-neutral-200 dark:bg-neutral-500 text-primary"
                      } pointer-events-none`}
                    />
                  </div>
                )}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full inline-flex items-center justify-center relative z-10 ${
                    index + 1 === currentStep
                      ? "bg-primary text-neutral-200 dark:text-neutral-800 border border-neutral-200 dark:border-neutral-800"
                      : "bg-white text-neutral-800 dark:text-neutral-800 border border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col pl-4 space-y-2">
                  <span className={`font-semibold text-base `}>
                    {item.title}
                  </span>
                  <span className="text-sm opacity-90">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-2/3 w-full flex flex-col space-y-4 py-4 max-w-2xl mx-auto">
            <p className="text-sm text-primary font-semibold">
              Step {currentStep} of {onboardingSteps.length}
            </p>
            <p className="text-base lg:text-3xl font-semibold">
              Tell Us About Yourself
            </p>
            <p className="text-sm text-muted-foreground">
              Let's start by getting to know you. Share some basic personal
              details so we can tailor the platform to your needs.
            </p>

            <StepOne
              onSubmit={handleForm}
              isLoading={isLoading}
              signInHref="/split-left/step-two"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
