"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  languages,
  notificationOptions,
  onboardingSteps,
  timezones,
} from "@/data/onboarding";
import Link from "next/link";
import { useState } from "react";

interface StepTwoData {
  language: string;
  timezone: string;
  notifications: string[];
}

interface StepTwoProps {
  onSubmit: (data: StepTwoData) => void;
  isLoading?: boolean;
  onboardingHref: string;
  skipHref: string;
  className?: string;
  inputClassName?: string;
}

export function StepTwo({
  onSubmit,
  isLoading = false,
  className = "",
  inputClassName = "",
  onboardingHref,
  skipHref,
}: StepTwoProps) {
  const [formData, setFormData] = useState<StepTwoData>({
    language: "",
    timezone: "",
    notifications: [],
  });

  const handleInputChange = (
    field: keyof StepTwoData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (
    notificationId: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      notifications: checked
        ? [...prev.notifications, notificationId]
        : prev.notifications.filter((id) => id !== notificationId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className={`space-y-4 ${className} w-full`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Language Combobox */}
        <div className="space-y-2">
          <Label htmlFor="language" className="block">
            Language
          </Label>
          <Combobox
            options={languages}
            value={formData.language}
            onValueChange={(value) => handleInputChange("language", value)}
            placeholder="Select your language"
          />
        </div>

        {/* Timezone Combobox */}
        <div className="space-y-2">
          <Label htmlFor="timezone" className="block">
            Timezone
          </Label>
          <Combobox
            options={timezones}
            value={formData.timezone}
            onValueChange={(value) => handleInputChange("timezone", value)}
            placeholder="Select your timezone"
          />
        </div>

        <Separator />

        {/* Notifications */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Notification Preferences
          </Label>

          {notificationOptions.map((category) => (
            <div key={category.category} className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                {category.category}
              </h4>
              <div className="space-y-4">
                {category.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.notifications.includes(option.id)}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(option.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {onboardingSteps[1]?.guidance?.map((item, index: number) => (
            <div
              key={index}
              className="flex-col flex items-start space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-4"
            >
              <div className="flex flex-row space-x-2">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{item.title}</span>
              </div>
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
            <Link href={skipHref} className="flex flex-row items-center ">
              {isLoading ? "Skip" : "Skip"}
            </Link>
          </Button>

          {/* Submit Button */}
          <Button type="submit" className="w-fit" disabled={isLoading}>
            <Link href={onboardingHref} className="flex flex-row items-center ">
              {isLoading ? "Saving" : "Save and Continue"}
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
