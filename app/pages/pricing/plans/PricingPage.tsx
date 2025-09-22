"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  pricingPlans,
  pricingFAQs,
  pricingFeatures,
} from "@/data/pricing-plans";
import {
  PricingCard,
  BillingToggle,
  PricingFAQComponent,
  PricingFeatures,
} from "../components";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleSelectPlan = (planId: string) => {
    // In a real app, this would redirect to signup or checkout
    console.log(`Selected plan: ${planId} with ${billingCycle} billing`);

    // For demo purposes, redirect to home
    router.push("/");
  };

  const handleToggleBilling = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business. No hidden fees, no
            surprises. Upgrade or downgrade at any time.
          </p>

          <BillingToggle
            billingCycle={billingCycle}
            onToggle={handleToggleBilling}
          />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <PricingFeatures features={pricingFeatures} />

      {/* FAQ Section */}
      <div className="py-16 px-4">
        <PricingFAQComponent faqs={pricingFAQs} />
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectPlan("professional")}
              className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="border border-primary-foreground/20 text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
