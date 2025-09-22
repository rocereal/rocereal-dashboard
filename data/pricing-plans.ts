export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  currency: string;
  popular?: boolean;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  limitations?: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses and freelancers",
    price: {
      monthly: 29,
      yearly: 290,
    },
    currency: "USD",
    features: [
      "Up to 5 team members",
      "10GB storage",
      "Basic analytics",
      "Email support",
      "Mobile app access",
      "Basic integrations",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: {
      monthly: 79,
      yearly: 790,
    },
    currency: "USD",
    popular: true,
    features: [
      "Up to 25 team members",
      "100GB storage",
      "Advanced analytics",
      "Priority email support",
      "Mobile app access",
      "Advanced integrations",
      "Custom branding",
      "API access",
      "Advanced security",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "default",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: {
      monthly: 199,
      yearly: 1990,
    },
    currency: "USD",
    features: [
      "Unlimited team members",
      "Unlimited storage",
      "Enterprise analytics",
      "24/7 phone support",
      "Mobile app access",
      "Enterprise integrations",
      "Custom branding",
      "API access",
      "Advanced security",
      "Dedicated account manager",
      "Custom development",
      "SLA guarantee",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
  },
];

export interface PricingFAQ {
  question: string;
  answer: string;
}

export const pricingFAQs: PricingFAQ[] = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial for all plans. No credit card required to get started.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer:
      "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for details.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee.",
  },
];

export interface PricingFeature {
  title: string;
  description: string;
  icon: string;
}

export const pricingFeatures: PricingFeature[] = [
  {
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee",
    icon: "Shield",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support from our expert team",
    icon: "Headphones",
  },
  {
    title: "Easy Integration",
    description: "Connect with your favorite tools and platforms seamlessly",
    icon: "Zap",
  },
  {
    title: "Scalable Solutions",
    description: "Grow your business with plans that scale with your needs",
    icon: "TrendingUp",
  },
  {
    title: "Mobile First",
    description: "Access your data anywhere with our mobile-optimized platform",
    icon: "Smartphone",
  },
  {
    title: "Regular Updates",
    description: "Continuous improvements and new features added regularly",
    icon: "RefreshCw",
  },
];
