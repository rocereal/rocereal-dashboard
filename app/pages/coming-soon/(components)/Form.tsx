"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SubscribeProps {
  onSubmit?: (email: string) => void;
  placeholder?: string;
  buttonText?: string;
}

const Subscribe = ({
  onSubmit,
  placeholder = "Enter your email",
  buttonText = "Subscribe",
}: SubscribeProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onSubmit?.(email);
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="block">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : buttonText}
        </Button>
      </form>
    </div>
  );
};

export default Subscribe;
