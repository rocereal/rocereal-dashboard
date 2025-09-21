import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Zap, Building } from "lucide-react";
import { PricingTier } from "@/data/pricing/design2/pricing-design2";

interface PricingTierCardProps {
  tier: PricingTier;
  billingCycle: "monthly" | "yearly";
  onSelectTier: (tierId: string) => void;
}

const iconMap = {
  Sparkles,
  Zap,
  Building,
};

export function PricingTierCard({
  tier,
  billingCycle,
  onSelectTier,
}: PricingTierCardProps) {
  const IconComponent = iconMap[tier.icon as keyof typeof iconMap];
  const price = tier.price[billingCycle];
  const savings =
    billingCycle === "yearly" && price > 0
      ? Math.round(
          ((tier.price.monthly * 12 - price) / (tier.price.monthly * 12)) * 100
        )
      : 0;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
        tier.popular
          ? "ring-2 ring-primary shadow-lg scale-105"
          : "hover:scale-102"
      }`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-50`}
      />

      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="relative z-10 text-center pb-4">
        {/* Icon */}
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
        </div>

        {/* Title and Tagline */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{tier.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">
            {tier.tagline}
          </p>
        </div>

        {/* Price */}
        <div className="mt-6">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold">${price}</span>
            {price > 0 && (
              <span className="text-muted-foreground ml-2">
                /{billingCycle === "monthly" ? "mo" : "yr"}
              </span>
            )}
          </div>

          {billingCycle === "yearly" && savings > 0 && (
            <div className="mt-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Save {savings}%
              </Badge>
            </div>
          )}

          {price === 0 && (
            <p className="text-sm text-muted-foreground mt-2">Free forever</p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-4 max-w-xs mx-auto">
          {tier.description}
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Limits */}
        {tier.limits && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Users</p>
              <p className="text-sm font-semibold">{tier.limits.users}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="text-sm font-semibold">{tier.limits.storage}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="text-sm font-semibold">{tier.limits.projects}</p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3">
          {tier.features.included.map((feature, index) => {
            const isHighlighted = tier.features.highlighted?.includes(feature);

            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  isHighlighted
                    ? "bg-white/20 backdrop-blur-sm p-3 rounded-lg"
                    : ""
                }`}
              >
                <Check
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    isHighlighted ? "text-primary" : "text-green-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isHighlighted
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {feature}
                </span>
                {isHighlighted && (
                  <Badge variant="secondary" className="text-xs ml-auto">
                    Popular
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <Button
          className={`w-full mt-6 ${
            tier.cta.variant === "primary"
              ? "bg-primary hover:bg-primary/90"
              : tier.cta.variant === "secondary"
              ? "bg-secondary hover:bg-secondary/90"
              : "border-white/20 hover:bg-white/10"
          }`}
          variant={tier.cta.variant === "outline" ? "outline" : "default"}
          onClick={() => onSelectTier(tier.id)}
        >
          {tier.cta.text}
        </Button>
      </CardContent>
    </Card>
  );
}
