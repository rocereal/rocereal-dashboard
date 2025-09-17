"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { onboardingSteps } from "@/data/onboarding";

interface StepOneData {
  firstName: string;
  lastName: string;
  email: string;
  agreeToTerms: boolean;
}

interface StepOneProps {
  onSubmit: (data: StepOneData) => void;
  isLoading?: boolean;
  signInHref?: string;
  termsHref?: string;
  privacyHref?: string;
  className?: string;
  inputClassName?: string;
}

export function StepOne({
  onSubmit,
  isLoading = false,
  termsHref = "/terms",
  privacyHref = "/privacy",
  className = "",
  inputClassName = "",
}: StepOneProps) {
  const [formData, setFormData] = useState<StepOneData>({
    firstName: "",
    lastName: "",
    email: "",
    agreeToTerms: false,
  });

  const handleInputChange = (
    field: keyof StepOneData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className={`space-y-4 ${className} w-full`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Fields */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="block">
            First name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`pl-10 ${inputClassName}`}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="block">
            Last name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`pl-10 ${inputClassName}`}
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="block">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`pl-10 ${inputClassName}`}
              required
            />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              handleInputChange("agreeToTerms", checked === true)
            }
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm leading-relaxed">
            I agree to the{" "}
            <Link href={termsHref} className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href={privacyHref} className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {onboardingSteps[0]?.guidance?.map((item, index: number) => (
            <div
              key={index}
              className="flex-col flex justify-between items-start space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-4"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{item.title}</span>
              <span className="text-xs opacity-90">{item.subtitle}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-between">
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-fit"
            disabled={isLoading}
            variant={"secondary"}
          >
            {isLoading ? "Skip" : "Skip"}
          </Button>

          {/* Submit Button */}
          <Button type="submit" className="w-fit" disabled={isLoading}>
            {isLoading ? "Saving" : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
