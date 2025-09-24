/**
 * Centered Reset Password Page Component
 * Authentication page for password reset completion with centered layout
 * Provides new password input form and success confirmation
 * Includes navigation back to login page
 * Uses centered authentication layout with backdrop blur effects
 */

"use client";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
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

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handles password reset submission with new password
   * Simulates API call and manages loading state
   * Transitions to success state upon completion
   */
  const handleResetPassword = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  /**
   * ResetPasswordPage component for password reset completion
   * Renders form for new password input and success confirmation with different UI states
   * Manages loading state during submission and provides user feedback
   * @returns JSX element representing the reset password page interface
   */
  if (isSubmitted) {
    return (
      <div className="space-y-8 max-w-md w-full">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Password updated
          </h1>
          <p className="text-muted-foreground mt-2">
            Your password has been successfully reset
          </p>
        </div>

        {/* Success Message */}
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your password has been successfully updated. You can now sign in
                with your new password.
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <Button className="w-full">
                <Link href="/authentication/centered/login">
                  Sign in with new password
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-md w-full z-40">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Reset Password Form */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset password</CardTitle>
          <CardDescription className="text-center">
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            isLoading={isLoading}
            inputClassName="bg-white/50 dark:bg-slate-700/50"
          />
        </CardContent>
      </Card>

      {/* Back to Login */}
      <div className="text-start">
        <Button variant="ghost">
          <Link
            href="/authentication/centered/login"
            className="flex flex-row items-center "
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
