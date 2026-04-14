"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const handleLogin = async (
    email: string,
    password: string,
    _rememberMe: boolean
  ) => {
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Email sau parolă incorectă.");
      return;
    }

    router.push("/finance");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="space-y-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
            <Logo />
          </div>
        </div>

        <Card className="backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Autentificare</CardTitle>
            <CardDescription className="text-center">
              Introdu datele tale pentru a accesa dashboard-ul
            </CardDescription>
          </CardHeader>
          <CardContent>
            {justRegistered && (
              <div className="mb-4 p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm text-center">
                Cont creat cu succes! Te poți autentifica acum.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              forgotPasswordHref="/login"
              signUpHref="/register"
              showSocialLogin={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
