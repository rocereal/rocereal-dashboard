/**
 * Error Page Component
 * Global error boundary page for the Next.js application
 * Displays a user-friendly error message when unexpected errors occur
 * Provides options to reset the error state or navigate back to home
 */

// Mark this as a client component since it uses React hooks and error handling
"use client";

import { Fourfour } from "@/components/svg/Icons";
// Import Next.js components and utilities

// Import React utilities
import { useEffect } from "react"; // React hook for side effects
import Header from "./pages/contact/(components)/ContactHeader";

/**
 * Error Component
 * Next.js error boundary component that catches and displays runtime errors
 * Automatically renders when an error occurs in the application
 * @param error - The error object that was thrown (optional)
 * @param reset - Function to reset the error boundary and retry rendering (optional)
 * @returns JSX element displaying the error message and recovery options
 */
export default function Error({
  error,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  // useEffect hook for potential error logging or analytics
  // Currently empty but can be used to log errors to external services
  useEffect(() => {
    // Log error to console or external error tracking service
    console.error("Error occurred:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto justify-center align-center items-center">
        {/* Main Content */}
        <div className="space-y-6 mb-12">
          {/* Maintenance Icon */}
          <Fourfour className="size-32 lg:size-64 mx-auto" />

          <Header
            title="Error 404"
            subtitle="We're currently experiencing some difficulties. We'll be back online shortly."
          />
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-center text-gray-500">
          <p>For urgent inquiries, please contact our support team directly.</p>
        </div>
      </div>
    </div>
  );
}
