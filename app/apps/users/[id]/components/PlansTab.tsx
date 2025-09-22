"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { User } from "@/data/users-data";
import { Check, CreditCard, Crown, Star, TrendingUp, Zap } from "lucide-react";

interface PlansTabProps {
  user: User;
  formatDate: (dateString: string) => string;
}

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: PlanFeature[];
  isCurrent: boolean;
  isPopular?: boolean;
}

export function PlansTab({ user, formatDate }: PlansTabProps) {
  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      interval: "monthly",
      features: [
        { name: "Basic dashboard access", included: true },
        { name: "Up to 5 projects", included: true },
        { name: "Community support", included: true },
        { name: "Basic analytics", included: false },
        { name: "Advanced integrations", included: false },
        { name: "Priority support", included: false },
      ],
      isCurrent: user.plan === "free",
    },
    {
      id: "starter",
      name: "Starter",
      price: 9,
      interval: "monthly",
      features: [
        { name: "Everything in Free", included: true },
        { name: "Up to 25 projects", included: true },
        { name: "Email support", included: true },
        { name: "Basic analytics", included: true },
        { name: "Standard integrations", included: true },
        { name: "Priority support", included: false },
      ],
      isCurrent: user.plan === "starter",
    },
    {
      id: "professional",
      name: "Professional",
      price: 29,
      interval: "monthly",
      features: [
        { name: "Everything in Starter", included: true },
        { name: "Unlimited projects", included: true },
        { name: "Advanced analytics", included: true },
        { name: "All integrations", included: true },
        { name: "Priority support", included: true },
        { name: "Custom branding", included: true },
      ],
      isCurrent: user.plan === "professional",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      interval: "monthly",
      features: [
        { name: "Everything in Professional", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Custom integrations", included: true },
        { name: "SLA guarantee", included: true },
        { name: "Advanced security", included: true },
        { name: "White-label solution", included: true },
      ],
      isCurrent: user.plan === "enterprise",
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
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Current Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getPlanIcon(user.plan)}
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {user.plan} Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user.plan === "free"
                    ? "Basic features for getting started"
                    : user.plan === "starter"
                    ? "Perfect for small teams"
                    : user.plan === "professional"
                    ? "Advanced features for growing businesses"
                    : "Enterprise-grade solution"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {user.plan === "free"
                  ? "Free"
                  : `$${plans.find((p) => p.id === user.plan)?.price}/${
                      plans.find((p) => p.id === user.plan)?.interval ===
                      "yearly"
                        ? "yr"
                        : "mo"
                    }`}
              </div>
              {user.metadata.billingCycle && (
                <div className="text-sm text-muted-foreground capitalize">
                  {user.metadata.billingCycle} billing
                </div>
              )}
            </div>
          </div>

          {/* Usage Progress */}
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Usage This Month</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Projects Created</span>
                <span>3 / 10</span>
              </div>
              <Progress value={30} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <span>Storage Used</span>
                <span>2.4 GB / 5 GB</span>
              </div>
              <Progress value={48} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <span>API Calls</span>
                <span>1,250 / 10,000</span>
              </div>
              <Progress value={12.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isCurrent ? "ring-2 ring-primary" : ""
              } ${plan.isPopular ? "border-purple-200" : ""}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  {plan.price > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.interval === "yearly" ? "yr" : "mo"}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Check
                        className={`w-4 h-4 flex-shrink-0 ${
                          feature.included ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={
                          feature.included
                            ? ""
                            : "text-muted-foreground line-through"
                        }
                      >
                        {feature.name}
                        {feature.limit && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({feature.limit})
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {plan.isCurrent ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.isPopular ? "default" : "outline"}
                    >
                      {plan.price === 0 ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      {(user.metadata.subscriptionId ||
        user.metadata.billingCycle ||
        user.metadata.paymentMethod) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Billing Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.metadata.subscriptionId && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Subscription ID</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {user.metadata.subscriptionId}
                  </div>
                </div>
              )}

              {user.metadata.billingCycle && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Billing Cycle</Label>
                  <div className="capitalize">{user.metadata.billingCycle}</div>
                </div>
              )}

              {user.metadata.paymentMethod && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <div className="capitalize">
                    {user.metadata.paymentMethod}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
              <Button variant="outline">Update Payment Method</Button>
              <Button variant="outline">View Invoices</Button>
              <Button variant="destructive">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
