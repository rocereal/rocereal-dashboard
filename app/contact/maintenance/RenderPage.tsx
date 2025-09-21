"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Clock, Mail } from "lucide-react";
import ContactForm from "../(components)/ContactForm";
import { Maintenance } from "@/components/svg/Icons";
import Header from "../(components)/ContactHeader";
import CountdownTimer from "@/app/coming-soon/(components)/CountdownTimer";

export default function MaintenancePage() {
  const handleFormSubmit = (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    console.log("Maintenance contact form submitted:", data);
    alert(
      `Thank you ${data.name}! We'll notify you when we're back online at ${data.email}.`
    );
  };

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
