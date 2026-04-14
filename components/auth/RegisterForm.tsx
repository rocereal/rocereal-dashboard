"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButtons";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
  signInHref?: string;
  termsHref?: string;
  privacyHref?: string;
  className?: string;
  inputClassName?: string;
  showSocialLogin?: boolean;
  socialLoginProps?: {
    separatorText?: string;
    facebookText?: string;
    googleText?: string;
    onFacebookClick?: () => void;
    onGoogleClick?: () => void;
  };
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  signInHref = "/login",
  termsHref = "/terms",
  privacyHref = "/privacy",
  className = "",
  inputClassName = "",
  showSocialLogin = true,
  socialLoginProps = {},
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Parolele nu coincid");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Te rugam sa accepti termenii si conditiile");
      return;
    }

    onSubmit(formData);
  };

  const {
    separatorText = "Sau continua cu",
    facebookText = "Facebook",
    googleText = "Google",
    onFacebookClick,
    onGoogleClick,
  } = socialLoginProps;

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="block">
              Prenume
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                type="text"
                placeholder="Ion"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`pl-10 ${inputClassName}`}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="block">
              Nume de familie
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                type="text"
                placeholder="Popescu"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`pl-10 ${inputClassName}`}
                required
              />
            </div>
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
              placeholder="ion@exemplu.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`pl-10 ${inputClassName}`}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="block">
            Parola
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Creeaza o parola puternica"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`pl-10 pr-10 ${inputClassName}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="block">
            Confirma parola
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma parola ta"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`pl-10 pr-10 ${inputClassName}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
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
            Sunt de acord cu{" "}
            <Link href={termsHref} className="text-primary hover:underline">
              Termenii Serviciului
            </Link>{" "}
            si{" "}
            <Link href={privacyHref} className="text-primary hover:underline">
              Politica de Confidentialitate
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Se creeaza contul..." : "Creeaza cont"}
        </Button>
      </form>

      {/* Social Registration */}
      {showSocialLogin && (
        <SocialLoginButtons
          separatorText={separatorText}
          facebookText={facebookText}
          googleText={googleText}
          onFacebookClick={onFacebookClick}
          onGoogleClick={onGoogleClick}
          className={inputClassName}
        />
      )}

      {/* Sign In Link */}
      {signInHref && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Ai deja un cont?{" "}
            <Link
              href={signInHref}
              className="text-primary hover:underline font-medium"
            >
              Autentificare
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
