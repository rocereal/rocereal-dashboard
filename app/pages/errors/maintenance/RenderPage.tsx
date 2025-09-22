"use client";

import CountdownTimer from "@/app/pages/coming-soon/(components)/CountdownTimer";
import Header from "@/app/pages/contact/(components)/ContactHeader";
import { Maintenance } from "@/components/svg/Icons";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto justify-center align-center items-center">
        {/* Main Content */}
        <div className="space-y-6 mb-12">
          {/* Maintenance Icon */}
          <Maintenance className="size-32 lg:size-64 mx-auto" />

          <Header
            title="Under Maintenance"
            subtitle="We're currently performing some scheduled maintenance to improve
            your experience. We'll be back online shortly."
          />

          <CountdownTimer className={"!justify-center"} />
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-center text-gray-500">
          <p>For urgent inquiries, please contact our support team directly.</p>
        </div>
      </div>
    </div>
  );
}
