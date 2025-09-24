/**
 * Split Right Register Page Component
 * Authentication page for user registration with split-screen layout (form on right, carousel on left)
 * Provides registration form with user details, password setup, and social login
 * Includes link to login page for existing users
 * Uses split-right authentication layout with carousel on the left side
 */

"use client";

import { RegisterForm } from "@/components/forms/auth/RegisterForm";
import { Logo } from "@/components/shared/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles user registration attempt
   * Simulates API call and manages loading state
   */
  const handleRegister = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
  };

  /**
   * RegisterPage component for user registration
   * Renders registration form with logo, transparent card layout, and registration handlers
   * Manages loading state during registration process and provides user feedback
   * @returns JSX element representing the split-right registration page interface
   */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="hidden lg:flex text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Registration Form */}
      <Card className="border-none shadow-none !bg-transparent">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            signInHref="/authentication/split-right/login"
          />
        </CardContent>
      </Card>
    </div>
  );
}
