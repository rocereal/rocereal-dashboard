"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButtons";

interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
  isLoading?: boolean;
  forgotPasswordHref?: string;
  signUpHref?: string;
  className?: string;
  inputClassName?: string;
  showRememberMe?: boolean;
  showSocialLogin?: boolean;
  socialLoginProps?: {
    separatorText?: string;
    facebookText?: string;
    googleText?: string;
    onFacebookClick?: () => void;
    onGoogleClick?: () => void;
  };
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  forgotPasswordHref = "/forgot-password",
  signUpHref = "/register",
  className = "",
  inputClassName = "",
  showRememberMe = true,
  showSocialLogin = true,
  socialLoginProps = {},
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, rememberMe);
  };

  const {
    separatorText = "Or continue with",
    facebookText = "Facebook",
    googleText = "Google",
    onFacebookClick,
    onGoogleClick,
  } = socialLoginProps;

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 ${inputClassName}`}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-4">
          <Label htmlFor="password" className="block">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* Remember Me & Forgot Password */}
        {showRememberMe && (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 items-center justify-between">
            <label className="flex items-center space-x-2 text-xs md:text-sm ">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <span>Remember me</span>
            </label>
            <Link
              href={forgotPasswordHref}
              className="text-xs md:text-sm text-primary dark:text-white hover:underline text-end"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Social Login */}
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

      {/* Sign Up Link */}
      {signUpHref && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href={signUpHref}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
