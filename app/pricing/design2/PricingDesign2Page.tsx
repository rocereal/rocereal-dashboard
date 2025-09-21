"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  pricingTiers,
  pricingComparison,
  testimonials,
} from "@/data/pricing/design2/pricing-design2";
import {
  PricingTierCard,
  ComparisonTable,
  TestimonialsSection,
} from "./components";
import { BillingToggle } from "../components/BillingToggle";

export default function PricingDesign2Page() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const handleSelectTier = (tierId: string) => {
    const tier = pricingTiers.find((t) => t.id === tierId);
    console.log(`Selected tier: ${tier?.name} with ${billingCycle} billing`);

    // In a real app, this would redirect to signup or checkout
    if (tier?.cta.href.startsWith("/")) {
      router.push(tier.cta.href);
    } else {
      // Handle external links or show modal
      console.log(`Navigate to: ${tier?.cta.href}`);
    }
  };

  const handleToggleBilling = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              ✨ Alternative Design
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </h1>

            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Unlock the full potential of our platform with plans designed for
              every stage of your business journey.
            </p>

            <BillingToggle
              billingCycle={billingCycle}
              onToggle={handleToggleBilling}
            />
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
            {pricingTiers.map((tier) => (
              <PricingTierCard
                key={tier.id}
                tier={tier}
                billingCycle={billingCycle}
                onSelectTier={handleSelectTier}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Comparison Table */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <ComparisonTable comparisons={pricingComparison} />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-300 text-lg">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-slate-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-slate-300">
                Absolutely! Start with our 14-day free trial on any paid plan.
                No credit card required.
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-300">
                We accept all major credit cards, PayPal, and bank transfers for
                annual subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of teams already using our platform to boost
            productivity
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectTier("pro")}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Your Free Trial
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </button>
          </div>

          <p className="text-sm text-blue-200 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
