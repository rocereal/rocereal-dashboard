/**
 * Billing Toggle Component
 * Interactive toggle switch for switching between monthly and yearly billing cycles
 * Displays current billing cycle with visual indicator and savings badge for yearly plans
 * Provides smooth animation when switching between billing options
 * Used in pricing pages to allow users to compare monthly vs yearly pricing
 * @param billingCycle - Current selected billing cycle (monthly or yearly)
 * @param onToggle - Callback function called when billing cycle is toggled
 * @returns JSX element representing the billing cycle toggle switch
 */

import { Button } from "@/components/ui/button";

interface BillingToggleProps {
  billingCycle: "monthly" | "yearly";
  onToggle: (cycle: "monthly" | "yearly") => void;
}

/**
 * BillingToggle component for switching between monthly and yearly billing
 * Renders toggle switch with labels and savings indicator for yearly plans
 * Manages billing cycle state through parent component callbacks
 * Provides visual feedback for current selection and savings
 * @param billingCycle - Current billing cycle selection
 * @param onToggle - Function called when toggle is clicked
 * @returns JSX element representing the billing toggle interface
 */
export function BillingToggle({ billingCycle, onToggle }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span
        className={`text-sm ${
          billingCycle === "monthly"
            ? "text-foreground"
            : "text-muted-foreground"
        }`}
      >
        Monthly
      </span>

      <Button
        variant="outline"
        size="sm"
        className="relative w-14 h-7 p-2 "
        onClick={() =>
          onToggle(billingCycle === "monthly" ? "yearly" : "monthly")
        }
      >
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-primary rounded-full transition-transform duration-200 ${
            billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </Button>

      <div className="flex items-center space-x-2">
        <span
          className={`text-sm ${
            billingCycle === "yearly"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Yearly
        </span>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
          Save 20%
        </span>
      </div>
    </div>
  );
}
