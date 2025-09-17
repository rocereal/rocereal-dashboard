"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";

interface OnboardingWizardSplitProps {
  image: any;
  title: string;
  subtitle: string;
}

export function OnboardingWizardSplit({
  image,
  title,
  subtitle,
}: OnboardingWizardSplitProps) {
  return (
    <div className="bg-neutral-100 dark:bg-slate-900 space-y-8 rounded-md w-full lg:w-1/2">
      <div className="relative overflow-hidden h-[30vh] lg:h-full lg:min-h-screen w-full flex flex-col">
        <ImageComponentOptimized
          unoptimized={true}
          alt={"Onboarding Wizard"}
          src={image}
          placeholder="blur"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent size-full">
          <div className="pt-6 lg:pt-24 px-6 text-white relative z-10 size-full justify-start flex-row">
            <div className="flex flex-col size-full align-items-start place-items-start justify-start text-start">
              <div className={`flex items-center justify-between w-full mb-4`}>
                <div className="flex flex-col">
                  <span className="font-semibold text-base lg:text-2xl">
                    {title}
                  </span>
                  <span className="text-sm opacity-90">{subtitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
