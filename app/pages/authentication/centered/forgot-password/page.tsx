/**
 * Centered Forgot Password Page Component
 * Authentication page for password reset request with centered layout
 * Provides email input form for password reset and success confirmation
 * Includes navigation back to login page
 * Uses centered authentication layout with backdrop blur effects
 */

"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Logo } from "@/components/shared/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handles forgot password request submission
   * Simulates API call and manages loading state
   * Transitions to success state upon completion
   */
  const handleForgotPassword = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  /**
   * ForgotPasswordPage component for password reset requests
   * Renders form for email input and success confirmation with different UI states
   * Manages loading state during submission and provides user feedback
   * @returns JSX element representing the forgot password page interface
   */
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md space-y-8 z-40">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground mt-2">
            We&apos;ve sent you a password reset link
          </p>
        </div>

        {/* Success Message */}
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                If an account with that email exists, we&apos;ve sent you a
                password reset link. Please check your email and follow the
                instructions.
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <Button className="w-full">
                <Link href="/authentication/centered/login">
                  Back to sign in
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 z-40">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Forgot Password Form */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset password</CardTitle>
          <CardDescription className="text-center">
            We&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            isLoading={isLoading}
            inputClassName="bg-white/50 dark:bg-slate-700/50"
          />
        </CardContent>
      </Card>

      {/* Back to Login */}
      <div className="text-center">
        {/* Submit Button */}

        <Button variant="ghost" className="flex flex-row items-center">
          <Link
            href="/authentication/centered/login"
            className="flex items-center flex-row"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
