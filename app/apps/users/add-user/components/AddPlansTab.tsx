"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormData } from "../AddUserTabs";
import { Check, CreditCard, Crown, Star, TrendingUp, Zap } from "lucide-react";

interface AddPlansTabProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

export function AddPlansTab({ formData, onFormDataChange }: AddPlansTabProps) {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: [
        "Basic dashboard access",
        "Up to 5 projects",
        "Community support",
      ],
    },
    {
      id: "starter",
      name: "Starter",
      price: 9,
      features: [
        "Everything in Free",
        "Up to 25 projects",
        "Email support",
        "Basic analytics",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: 29,
      features: [
        "Everything in Starter",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
      ],
    },
  ];

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <Star className="w-5 h-5 text-gray-600" />;
      case "starter":
        return <Zap className="w-5 h-5 text-blue-600" />;
      case "professional":
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case "enterprise":
        return <Crown className="w-5 h-5 text-yellow-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Select Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Choose a plan for the new user
            </label>
            <Select
              value={formData.plan}
              onValueChange={(value) =>
                onFormDataChange({
                  plan: value as
                    | "free"
                    | "starter"
                    | "professional"
                    | "enterprise",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex items-center space-x-2">
                      {getPlanIcon(plan.id)}
                      <span>{plan.name}</span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">
                          - ${plan.price}/month
                        </span>
                      )}
                      {plan.price === 0 && (
                        <span className="text-muted-foreground">- Free</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Plan Details */}
          {(() => {
            const selectedPlan = plans.find((p) => p.id === formData.plan);
            if (!selectedPlan) return null;

            return (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getPlanIcon(selectedPlan.id)}
                  <h4 className="font-medium">{selectedPlan.name} Plan</h4>
                  {selectedPlan.popular && (
                    <Badge className="bg-purple-600">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedPlan.price === 0
                    ? "Perfect for getting started"
                    : selectedPlan.price < 30
                    ? "Great for small teams"
                    : "Advanced features for growing businesses"}
                </p>
                <ul className="text-sm space-y-1">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Billing Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Billing settings will be configured after account creation. Users
              can update their payment methods and billing preferences in their
              account settings.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">
              Post-Creation Setup
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Payment method collection</li>
              <li>• Billing cycle configuration</li>
              <li>• Invoice generation</li>
              <li>• Subscription management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
