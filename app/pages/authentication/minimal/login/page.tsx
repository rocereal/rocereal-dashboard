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

  return (
    <div className="space-y-8 max-w-md w-full">
      {/* Header */}
      <div className="text-center">
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
            forgotPasswordHref="/authentication/minimal/forgot-password"
            signUpHref="/authentication/minimal/register"
            inputClassName="bg-white/50 dark:bg-slate-900/50"
            socialLoginProps={{
              separatorText: "Or continue with",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
