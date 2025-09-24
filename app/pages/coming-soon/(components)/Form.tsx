/**
 * Subscribe Form Component
 * Email subscription form for coming soon pages to collect user email addresses
 * Provides email input field with validation and submit button
 * Handles form submission with loading states and error handling
 * Used to build email lists for product launch notifications
 * @param onSubmit - Optional callback function called with email on form submission
 * @param placeholder - Placeholder text for email input field
 * @param buttonText - Text for submit button
 * @returns JSX element representing the email subscription form
 */

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

/**
 * Subscribe component for email collection on coming soon pages
 * Renders email input form with validation and submit functionality
 * Manages loading state during submission and provides user feedback
 * @param onSubmit - Optional callback function executed on successful submission
 * @param placeholder - Placeholder text for the email input field
 * @param buttonText - Text displayed on the submit button
 * @returns JSX element representing the subscription form
 */
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
