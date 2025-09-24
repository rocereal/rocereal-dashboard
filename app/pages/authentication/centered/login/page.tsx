/**
 * Centered Login Page Component
 * Authentication page for user login with centered layout and form
 * Provides login form with email/password inputs, remember me option, and social login
 * Includes links to forgot password and registration pages
 * Uses centered authentication layout with backdrop blur effects
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
   * Renders login form with logo, card layout, and authentication handlers
   * Manages loading state during login process and provides user feedback
   * @returns JSX element representing the login page interface
   */
  return (
    <div className="space-y-8 max-w-md w-full">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Login Form */}
      <Card className="backdrop-blur-sm">
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
            forgotPasswordHref="/authentication/centered/forgot-password"
            signUpHref="/authentication/centered/register"
            inputClassName="bg-white/50 dark:bg-slate-700/50"
            socialLoginProps={{
              separatorText: "Or continue with",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
