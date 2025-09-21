"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

interface StepFourData {
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
  acceptPrivacyPolicy: boolean;
}

interface StepFourProps {
  onSubmit: (data: StepFourData) => void;
  isLoading?: boolean;
  onboardingHref: string;
  skipHref: string;
  className?: string;
  inputClassName?: string;
}

export function StepFour({
  onSubmit,
  isLoading = false,
  className = "",
  onboardingHref,
  skipHref,
}: StepFourProps) {
  const [formData, setFormData] = useState<StepFourData>({
    agreeToTerms: false,
    subscribeToNewsletter: false,
    acceptPrivacyPolicy: false,
  });

  const handleInputChange = (field: keyof StepFourData, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required checkboxes
    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    if (!formData.acceptPrivacyPolicy) {
      alert("Please accept the Privacy Policy");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className={`space-y-4 ${className} w-full`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Agree to Terms & Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              handleInputChange("agreeToTerms", checked === true)
            }
            className="mt-1"
            required
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </Link>{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>

        {/* Subscribe to Newsletter */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="subscribeToNewsletter"
            checked={formData.subscribeToNewsletter}
            onCheckedChange={(checked) =>
              handleInputChange("subscribeToNewsletter", checked === true)
            }
            className="mt-1"
          />
          <Label
            htmlFor="subscribeToNewsletter"
            className="text-sm leading-relaxed cursor-pointer"
          >
            Subscribe to our newsletter for updates and tips
          </Label>
        </div>

        {/* Accept Privacy Policy */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptPrivacyPolicy"
            checked={formData.acceptPrivacyPolicy}
            onCheckedChange={(checked) =>
              handleInputChange("acceptPrivacyPolicy", checked === true)
            }
            className="mt-1"
            required
          />
          <Label
            htmlFor="acceptPrivacyPolicy"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I accept the{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>

        <div className="flex flex-row justify-between">
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-fit"
            disabled={isLoading}
            variant={"secondary"}
          >
            <Link href={skipHref} className="flex flex-row items-center ">
              {isLoading ? "Previous" : "Previous"}
            </Link>
          </Button>

          {/* Submit Button */}
          <Button type="submit" className="w-fit" disabled={isLoading}>
            <Link href={onboardingHref} className="flex flex-row items-center ">
              {isLoading ? "Complete Setup" : "Complete Setup"}
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
