import { Button } from "@/components/ui/button";

interface BillingToggleProps {
  billingCycle: "monthly" | "yearly";
  onToggle: (cycle: "monthly" | "yearly") => void;
}

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
