import { CreditCard, DollarSign, TrendingUp, Target } from "lucide-react";

export interface BusinessMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description: string;
  icon: any;
}

export const businessMetricsData: BusinessMetric[] = [
  {
    id: "monetization-stats",
    title: "Credits Used",
    value: "856K",
    change: "+12.3% from last month",
    changeType: "positive",
    description: "Credits used, subscription tiers, revenue per user",
    icon: CreditCard,
  },
  {
    id: "cost-tracking",
    title: "Compute Cost per Request",
    value: "$0.045",
    change: "+15.2% from last quarter",
    changeType: "negative",
    description: "Compute cost per request, GPU usage, API billing",
    icon: DollarSign,
  },
  {
    id: "roi-indicators",
    title: "Value vs Cost Ratio",
    value: "8.2x",
    change: "-1.8x from last month",
    changeType: "negative",
    description: "Value delivered vs. infrastructure cost",
    icon: TrendingUp,
  },
  {
    id: "prompt-effectiveness",
    title: "Prompt Success Rate",
    value: "73.1%",
    change: "-4.2% from last week",
    changeType: "negative",
    description: "Success rate of different prompt types",
    icon: Target,
  },
];
