import { Code, Search, Star, RotateCcw } from "lucide-react";

export interface EngagementMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description: string;
  icon: any;
}

export const engagementMetricsData: EngagementMetric[] = [
  {
    id: "most-used-features",
    title: "Most Used Features",
    value: "Code Gen (32%)",
    change: "+12.5% code generation",
    changeType: "positive",
    description: "Chat, summarization, code generation, recommendations, etc.",
    icon: Code,
  },
  {
    id: "popular-queries",
    title: "Popular Queries",
    value: "Debug Help",
    change: "Emerging trend",
    changeType: "neutral",
    description: "What users ask most frequently",
    icon: Search,
  },
  {
    id: "user-feedback",
    title: "User Feedback Rating",
    value: "3.8/5",
    change: "-0.3 from last month",
    changeType: "negative",
    description: "Thumbs up/down, star ratings, qualitative feedback",
    icon: Star,
  },
  {
    id: "repeat-usage-rate",
    title: "Repeat Usage Rate",
    value: "45.2%",
    change: "-8.7% from last week",
    changeType: "negative",
    description: "How often users come back to use the AI",
    icon: RotateCcw,
  },
];
