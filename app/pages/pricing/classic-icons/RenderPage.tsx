/**
 * Classic Icons Pricing Render Page Component
 * Main render component for the classic icons pricing page with comprehensive layout
 * Displays hero section, pricing tiers, testimonials, comparison table, FAQ, and CTA
 * Provides interactive billing toggle and plan selection functionality
 * Features alternative design approach with enhanced visual elements
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  pricingTiers,
  pricingComparison,
  testimonials,
} from "@/data/pricing-design2";
import {
  PricingTierCard,
  ComparisonTable,
  TestimonialsSection,
} from "./components";
import { BillingToggle } from "../components/BillingToggle";

/**
 * RenderPage component for classic icons pricing page
 * Renders comprehensive pricing page with all sections and interactive elements
 * Manages billing cycle state and handles plan selection navigation
 * Provides complete pricing experience with testimonials and comparisons
 * @returns JSX element representing the full classic icons pricing page
 */
export default function RenderPage() {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              ✨ Alternative Design
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Choose Your Perfect Plan
            </h1>

            <p className="text-xl text-gray-900 dark:text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
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
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4  w-full">
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
      <div className="py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 dark:text-muted-foreground text-lg">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-500 dark:text-muted-foreground ">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-500 dark:text-muted-foreground ">
                Absolutely! Start with our 14-day free trial on any paid plan.
                No credit card required.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-500 dark:text-muted-foreground ">
                We accept all major credit cards, PayPal, and bank transfers for
                annual subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r bg-secondary ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 text-gray-500 dark:text-muted-foreground">
            Join thousands of teams already using our platform to boost
            productivity
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectTier("pro")}
              className="bg-white border text-primary px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors "
            >
              Start Your Free Trial
            </button>
            <button className="border  px-8 py-4 rounded-lg font-semibold transition-colors">
              Contact Sales
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-muted-foreground mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
