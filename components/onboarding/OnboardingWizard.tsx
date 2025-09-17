"use client";

import { onboardingSteps } from "@/data/onboarding";
import { Info, Check } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface OnboardingWizardProps {
  currentStep: number;
}

export function OnboardingWizard({ currentStep }: OnboardingWizardProps) {
  return (
    <div className="bg-neutral-100 dark:bg-slate-900 p-8 space-y-8 rounded-md w-full lg:w-1/3">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>
      <div className="flex flex-row space-x-2 items-center max-w-md">
        <Info className="w-4 h-4" />
        <p className="text-sm text-muted-foreground">
          Get started with your free account. No credit card required.
        </p>
      </div>

      <div className="relative flex flex-row lg:flex-col justify-center lg:justify-start">
        {onboardingSteps?.map((item, index: number) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center lg:justify-between w-full lg:max-w-md relative z-10 lg:mb-8"
          >
            {/* Connecting line */}
            {index < onboardingSteps.length - 1 && (
              <div className="absolute top-4 left-13 w-8 h-0.5 lg:left-4 lg:top-12 lg:w-0.5 lg:h-16 bg-gray-300"></div>
            )}

            <div
              className={`rounded-full p-2 items-center place-items-center justify-center flex ${
                index + 1 === currentStep
                  ? "bg-primary text-white"
                  : index + 1 < currentStep
                  ? "bg-primary text-white"
                  : "bg-white text-primary"
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <item.icon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden lg:block w-full lg:ml-4">
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-base ${
                    index + 1 === currentStep ? "text-primary" : ""
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-sm opacity-90">{item.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
