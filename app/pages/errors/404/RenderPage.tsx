/**
 * 404 Not Found Render Page Component
 * Main render component for the 404 error page displaying error message and navigation
 * Shows 404 icon, error title, and helpful messaging for missing pages
 * Provides user guidance when pages cannot be found
 */

"use client";

import Header from "@/app/pages/contact/(components)/ContactHeader";
import { Fourfour } from "@/components/svg/Icons";

/**
 * NotFoundPage component for rendering the 404 error interface
 * Displays 404 icon, error message, and helpful information
 * Provides clear communication when users encounter broken links
 * @returns JSX element representing the 404 error page layout
 */
export default function NotFoundPage() {
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
