"use client";

import { onboardingSteps } from "@/data/onboarding";
import { usePathname } from "next/navigation";

export function useOnboardingStep() {
  const pathname = usePathname();
  const stepSlug = pathname.split("/").pop(); // e.g. "step-one"

  // Generate slugs based on array index
  const stepsWithSlug = onboardingSteps.map((step, idx) => ({
    ...step,
    slug: `step-${idx + 1}`, // gives "step-1", "step-2" etc
  }));

  const currentIndex = stepsWithSlug.findIndex((s) => s.slug === stepSlug);

  return {
    currentStep: currentIndex >= 0 ? currentIndex + 1 : 1,
    stepData: onboardingSteps[currentIndex >= 0 ? currentIndex : 0],
    stepsWithSlug,
  };
}
