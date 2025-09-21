"use client";

import CountdownTimer from "@/app/coming-soon/(components)/CountdownTimer";
import Header from "@/app/contact/(components)/ContactHeader";
import { Fourfour, Maintenance } from "@/components/svg/Icons";

export default function MaintenancePage() {
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
