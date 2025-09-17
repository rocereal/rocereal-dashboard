// "use client";

// import { StepOne } from "@/components/onboarding/StepOne";
// import { Separator } from "@/components/ui/separator";
// import { onboardingSteps } from "@/data/onboarding";
// import { Info, Check } from "lucide-react";
// import { useState } from "react";

// export default function StepOnePage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const currentStep = 1; // You can make this dynamic based on your routing

//   const handleForm = async (data: any) => {
//     setIsLoading(true);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row space-8 w-full">
//       <div className="bg-neutral-100 p-8 space-y-8 rounded-md w-full lg:w-1/3">
//         <div className="flex flex-row space-x-2 items-center max-w-md">
//           <Info className="w-4 h-4" />
//           <p className="text-sm text-muted-foreground">
//             Get started with your free account. No credit card required.
//           </p>
//         </div>

//         <div className="relative">
//           {onboardingSteps?.map((item, index: number) => (
//             <div key={index} className="relative">
//               {/* Connecting line */}
//               {index < onboardingSteps.length - 1 && (
//                 <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
//               )}

//               <div className="flex-row flex justify-between items-center space-x-4 max-w-md relative z-10 mb-8">
//                 <div
//                   className={`rounded-full size-12 items-center place-items-center justify-center flex ${
//                     index + 1 === currentStep
//                       ? "bg-primary text-white"
//                       : index + 1 < currentStep
//                       ? "bg-green-500 text-white"
//                       : "bg-white text-primary"
//                   }`}
//                 >
//                   {index + 1 < currentStep ? (
//                     <Check className="w-4 h-4" />
//                   ) : (
//                     <item.icon className="w-4 h-4" />
//                   )}
//                 </div>
//                 <div className="w-full">
//                   <div className="flex flex-col">
//                     <span
//                       className={`font-semibold text-base ${
//                         index + 1 === currentStep ? "text-primary" : ""
//                       }`}
//                     >
//                       {item.title}
//                     </span>
//                     <span className="text-sm opacity-90">{item.subtitle}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="p-8 space-y-8 w-full lg:w-2/3 justify-center items-center">
//         <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
//           <p className="text-sm text-muted-foreground">
//             Step {currentStep} of {onboardingSteps.length}
//           </p>
//           <p className="text-sm text-muted-foreground">
//             Tell Us About Yourself
//           </p>
//           <p className="text-sm text-muted-foreground">
//             Let's start by getting to know you. Share some basic personal
//             details so we can tailor the platform to your needs.
//           </p>

//           <StepOne
//             onSubmit={handleForm}
//             isLoading={isLoading}
//             signInHref="/split-left/step-two"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

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
      <div className="bg-neutral-100 p-8 space-y-8 rounded-md w-full lg:w-1/3">
        <div className="flex flex-row space-x-2 items-center max-w-md">
          <Info className="w-4 h-4" />
          <p className="text-sm text-muted-foreground">
            Get started with your free account. No credit card required.
          </p>
        </div>

        <div className="relative">
          {onboardingSteps?.map((item, index: number) => (
            <div key={index} className="relative">
              {/* Connecting line */}
              {index < onboardingSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
              )}

              <div className="flex-row flex justify-between items-center space-x-4 max-w-md relative z-10 mb-8">
                <div
                  className={`rounded-full p-2 items-center place-items-center justify-center flex ${
                    index + 1 === currentStep
                      ? "bg-primary text-white"
                      : index + 1 < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-white text-primary"
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="w-full">
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
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 space-y-8 w-full lg:w-2/3 justify-center items-center">
        <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {onboardingSteps.length}
          </p>
          <p className="text-sm text-muted-foreground">
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
  );
}
