/**
 * Pricing Features Component
 * Feature showcase section highlighting key platform capabilities and benefits
 * Displays feature cards with icons, titles, and descriptions in a grid layout
 * Provides visual representation of platform value propositions and advantages
 * Used in pricing pages to showcase competitive advantages and build trust
 * @param features - Array of pricing feature objects with icon, title, and description
 * @returns JSX element representing the pricing features showcase section
 */

import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Headphones,
  Zap,
  TrendingUp,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { PricingFeature } from "@/data/pricing-plans";

interface PricingFeaturesProps {
  features: PricingFeature[];
}

const iconMap = {
  Shield,
  Headphones,
  Zap,
  TrendingUp,
  Smartphone,
  RefreshCw,
};

/**
 * PricingFeatures component for displaying key platform features and benefits
 * Renders feature cards in a responsive grid with icons and descriptions
 * Maps feature data to appropriate icons and handles icon rendering
 * Provides visual showcase of platform capabilities and competitive advantages
 * @param features - Array of feature data including icon type, title, and description
 * @returns JSX element representing the features showcase section
 */
export function PricingFeatures({ features }: PricingFeaturesProps) {
  return (
    <div className="py-16 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for modern businesses with enterprise-grade features and
            exceptional support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];

            return (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
