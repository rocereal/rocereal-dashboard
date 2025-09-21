"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { countryCodes, onboardingSteps } from "@/data/onboarding";
import { Phone, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StepThreeData {
  countryCode: string;
  phoneNumber: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  profilePicture: File | null;
}

interface StepThreeProps {
  onSubmit: (data: StepThreeData) => void;
  isLoading?: boolean;
  onboardingHref: string;
  skipHref: string;
  className?: string;
  inputClassName?: string;
}

export function StepThree({
  onSubmit,
  isLoading = false,
  className = "",
  inputClassName = "",
  onboardingHref,
  skipHref,
}: StepThreeProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [formData, setFormData] = useState<StepThreeData>({
    countryCode: "+1",
    phoneNumber: "",
    emailVerified: false,
    twoFactorEnabled: false,
    profilePicture: null,
  });

  const handleInputChange = (
    field: keyof StepThreeData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setFileName(file.name);
    }
  };

  //Make sure to clean up the object URL when the component unmounts to avoid memory leaks

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className={`space-y-4 ${className} w-full`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="block">
            Phone Number
          </Label>
          <div className="flex flex-col lg:flex-row gap-2">
            <Combobox
              options={countryCodes}
              value={formData.countryCode}
              onValueChange={(value) => handleInputChange("countryCode", value)}
              placeholder="+1"
              className="w-fit h-10"
            />
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={`pl-10 h-10 ${inputClassName}`}
              />
            </div>
          </div>
        </div>
        {/* Email Verification */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="emailVerified"
            checked={formData.emailVerified}
            onCheckedChange={(checked) =>
              handleInputChange("emailVerified", checked === true)
            }
            className="mt-1"
          />
          <Label
            htmlFor="emailVerified"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I&apos;ve verified my email
          </Label>
        </div>
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between border rounded-md p-8">
          <div className="space-y-2">
            <Label className="text-base">Two-Factor Authentication</Label>
            <div className="block text-sm text-muted-foreground">
              Enable 2FA for enhanced account security
            </div>
          </div>
          <Switch
            checked={formData.twoFactorEnabled}
            onCheckedChange={(checked) =>
              handleInputChange("twoFactorEnabled", checked)
            }
          />
        </div>
        {/* Profile Picture Upload */}
        <div className="space-y-2">
          <label htmlFor="uploadImage" className="block text-sm font-medium">
            Upload new image:
          </label>
          <div className="flex items-center justify-center w-full border border-dashed border-gray-300 rounded-md p-6">
            <label
              htmlFor="uploadImage"
              className="flex flex-col items-center space-y-2 cursor-pointer text-center"
            >
              <Upload className="w-6 h-6 text-gray-500" />
              <span className="text-sm text-gray-600">
                Click or drag and drop to upload your file
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG, PDF, GIF, SVG (Max 5 MB)
              </span>
            </label>
            <input
              id="uploadImage"
              type="file"
              accept="image/png, image/jpeg, application/pdf, image/gif, image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {selectedImage && (
          <div className="relative overflow-hidden aspect-video flex flex-col">
            <ImageComponentOptimized
              unoptimized={true}
              alt="Selected image preview"
              src={selectedImage}
              placeholder="blur"
              fill
              className="object-cover"
            />
          </div>
        )}

        {fileName && (
          <span className="block text-sm text-muted-foreground">
            {fileName}
          </span>
        )}

        <Separator />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {onboardingSteps[2]?.guidance?.map((item, index: number) => (
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
