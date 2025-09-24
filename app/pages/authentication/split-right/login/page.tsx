/**
 * Split Right Login Page Component
 * Authentication page for user login with split-screen layout (form on right, carousel on left)
 * Provides login form with email/password inputs, remember me option, and social login
 * Includes links to forgot password and registration pages
 * Uses split-right authentication layout with carousel on the left side
 */

"use client";

import { LoginForm } from "@/components/forms/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles user login attempt with form data
   * Simulates API call and manages loading state
   * @param email - User's email address
   * @param password - User's password
   * @param rememberMe - Whether to remember the user session
   */
  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Login attempt:", { email, password, rememberMe });
  };

  /**
   * LoginPage component for user authentication
   * Renders login form with logo, transparent card layout, and authentication handlers
   * Manages loading state during login process and provides user feedback
   * @returns JSX element representing the split-right login page interface
   */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="hidden lg:flex text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Login Form */}
      <Card className="border-none shadow-none !bg-transparent">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            forgotPasswordHref="/authentication/split-right/forgot-password"
            signUpHref="/authentication/split-right/register"
          />
        </CardContent>
      </Card>
    </div>
  );
}
