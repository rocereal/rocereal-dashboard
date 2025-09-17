"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";

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
            forgotPasswordHref="/authentication/split-left/forgot-password"
            signUpHref="/authentication/split-left/register"
          />
        </CardContent>
      </Card>
    </div>
  );
}
