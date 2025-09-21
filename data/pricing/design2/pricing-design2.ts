export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: {
    monthly: number;
    yearly: number;
  };
  currency: string;
  popular?: boolean;
  description: string;
  features: {
    included: string[];
    highlighted?: string[];
  };
  limits?: {
    users: string;
    storage: string;
    projects: string;
  };
  cta: {
    text: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
  };
  gradient: string;
  icon: string;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get started",
    price: {
      monthly: 0,
      yearly: 0,
    },
    currency: "USD",
    description: "Perfect for trying out our platform with basic features.",
    features: {
      included: [
        "Up to 3 projects",
        "1GB storage",
        "Basic templates",
        "Community support",
        "Mobile app access",
      ],
    },
    limits: {
      users: "1 user",
      storage: "1GB",
      projects: "3 projects",
    },
    cta: {
      text: "Get Started Free",
      href: "/signup",
      variant: "outline",
    },
    gradient: "from-gray-50 to-gray-100",
    icon: "Sparkles",
  },
  {
    id: "pro",
    name: "Professional",
    tagline: "Most popular",
    price: {
      monthly: 29,
      yearly: 290,
    },
    currency: "USD",
    popular: true,
    description:
      "Ideal for growing teams who need advanced features and priority support.",
    features: {
      included: [
        "Unlimited projects",
        "100GB storage",
        "Premium templates",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Team collaboration",
        "API access",
      ],
      highlighted: [
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
      ],
    },
    limits: {
      users: "Up to 10 users",
      storage: "100GB",
      projects: "Unlimited",
    },
    cta: {
      text: "Start Pro Trial",
      href: "/signup?plan=pro",
      variant: "primary",
    },
    gradient: "from-blue-50 to-indigo-100",
    icon: "Zap",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Scale globally",
    price: {
      monthly: 99,
      yearly: 990,
    },
    currency: "USD",
    description:
      "For large organizations requiring enterprise-grade security and dedicated support.",
    features: {
      included: [
        "Everything in Professional",
        "Unlimited storage",
        "Enterprise security",
        "Dedicated account manager",
        "Custom development",
        "SLA guarantee",
        "Advanced compliance",
        "White-label solution",
        "24/7 phone support",
        "Custom training",
      ],
      highlighted: [
        "Dedicated account manager",
        "Custom development",
        "SLA guarantee",
      ],
    },
    limits: {
      users: "Unlimited",
      storage: "Unlimited",
      projects: "Unlimited",
    },
    cta: {
      text: "Contact Sales",
      href: "/contact?plan=enterprise",
      variant: "secondary",
    },
    gradient: "from-purple-50 to-pink-100",
    icon: "Building",
  },
];

export interface PricingComparison {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export const pricingComparison: PricingComparison[] = [
  {
    feature: "Projects",
    free: "3",
    pro: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    feature: "Storage",
    free: "1GB",
    pro: "100GB",
    enterprise: "Unlimited",
  },
  {
    feature: "Users",
    free: "1",
    pro: "10",
    enterprise: "Unlimited",
  },
  {
    feature: "Templates",
    free: "Basic",
    pro: "Premium",
    enterprise: "Custom",
  },
  {
    feature: "Analytics",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "API Access",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "Priority Support",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "Custom Integrations",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "Dedicated Manager",
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    feature: "Custom Development",
    free: false,
    pro: false,
    enterprise: true,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  plan: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechStart Inc.",
    avatar: "/avatars/sarah.jpg",
    content:
      "The Professional plan transformed how our team collaborates. The analytics and integrations are game-changers.",
    plan: "Professional",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "CTO",
    company: "Global Solutions",
    avatar: "/avatars/marcus.jpg",
    content:
      "Enterprise support and custom development helped us scale globally. Worth every penny.",
    plan: "Enterprise",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Freelancer",
    company: "Self-employed",
    avatar: "/avatars/emily.jpg",
    content:
      "Started with Free, upgraded to Pro. The templates and storage made my workflow so much smoother.",
    plan: "Professional",
  },
];
