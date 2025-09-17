"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setCanResend(false);
    setCountdown(60);
  };

  const handleVerificationCheck = async () => {
    setIsLoading(true);

    // Simulate verification check
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate successful verification (in real app, this would check with backend)
    setIsLoading(false);
    setIsVerified(true);

    // Redirect after successful verification
    setTimeout(() => {
      router.push("/login?verified=true");
    }, 3000);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Success Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Email verified!
            </h1>
            <p className="text-muted-foreground mt-2">
              Your email has been successfully verified
            </p>
          </div>

          {/* Success Message */}
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Welcome to our platform! You will be redirected to the sign-in
                  page shortly.
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/login">Continue to sign in</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground mt-2">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">
              {email || "your email"}
            </span>
          </p>
        </div>

        {/* Verification Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Verify your email
            </CardTitle>
            <CardDescription className="text-center">
              Click the link in your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Instructions */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Didn't receive the email?</strong> Check your spam
                folder or click the button below to resend.
              </p>
              <p>
                The verification link will expire in 24 hours for security
                reasons.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleVerificationCheck}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking verification...
                  </>
                ) : (
                  "I've verified my email"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleResendEmail}
                className="w-full"
                disabled={!canResend || isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : canResend ? (
                  "Resend verification email"
                ) : (
                  `Resend in ${countdown}s`
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Wrong email?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up again
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
