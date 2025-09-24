/**
 * Pricing Card Component
 * Individual pricing plan card displaying plan details, pricing, and features
 * Shows plan name, description, price based on billing cycle, and feature list
 * Includes popular plan badge, savings calculation, and limitations display
 * Used in pricing pages to showcase different subscription tiers
 * @param plan - Pricing plan object containing all plan details and features
 * @param billingCycle - Current billing cycle (monthly or yearly) for pricing display
 * @param onSelectPlan - Callback function called when plan is selected
 * @returns JSX element representing the pricing plan card
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { PricingPlan } from "@/data/pricing-plans";

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: "monthly" | "yearly";
  onSelectPlan: (planId: string) => void;
}

/**
 * PricingCard component for displaying individual pricing plan information
 * Renders comprehensive plan card with pricing, features, and selection button
 * Calculates and displays savings for yearly billing and handles popular plan highlighting
 * Manages plan selection through parent component callbacks
 * @param plan - The pricing plan data to display
 * @param billingCycle - Current billing cycle for price calculation
 * @param onSelectPlan - Function called when plan selection button is clicked
 * @returns JSX element representing the pricing plan card
 */
export function PricingCard({
  plan,
  billingCycle,
  onSelectPlan,
}: PricingCardProps) {
  const price = plan.price[billingCycle];
  const savings =
    billingCycle === "yearly" ? plan.price.monthly * 12 - price : 0;

  return (
    <Card
      className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <p className="text-muted-foreground text-sm">{plan.description}</p>

        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-muted-foreground ml-1">
              /{billingCycle === "monthly" ? "month" : "year"}
            </span>
          </div>

          {billingCycle === "yearly" && savings > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Save ${savings} per year
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.limitations && plan.limitations.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
            <ul className="space-y-1">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {limitation}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          className="w-full mt-6"
          variant={plan.buttonVariant}
          onClick={() => onSelectPlan(plan.id)}
        >
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
