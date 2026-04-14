"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

interface ResetPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => void;
  isLoading?: boolean;
  className?: string;
  inputClassName?: string;
  showPasswordRequirements?: boolean;
  passwordRequirements?: string[];
}

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
  className = "",
  inputClassName = "",
  showPasswordRequirements = true,
  passwordRequirements = [
    "Cel putin 8 caractere",
    "Contine litere mari si mici",
    "Include cel putin un numar",
  ],
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Parola trebuie sa aiba cel putin 8 caractere");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu coincid");
      return;
    }

    onSubmit(formData.password, formData.confirmPassword);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="block">
            Parola noua
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Introdu parola noua"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`pl-10 pr-10 ${inputClassName}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="block">
            Confirma parola noua
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma parola noua"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`pl-10 pr-10 ${inputClassName}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        {showPasswordRequirements && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Cerinte parola:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {passwordRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Se actualizeaza parola..." : "Actualizeaza parola"}
        </Button>
      </form>
    </div>
  );
}
