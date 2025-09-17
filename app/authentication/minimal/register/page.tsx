"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: any) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log("Register attempt:", data);
  };

  return (
    <div className="space-y-8 max-w-md w-full">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
          <Logo />
        </div>
      </div>

      {/* Register Form */}
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
            signInHref="/authentication/minimal/login"
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
