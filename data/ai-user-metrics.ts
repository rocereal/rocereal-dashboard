import { Users, MessageSquare, Clock, TrendingUp } from "lucide-react";

export interface UserMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description: string;
  icon: any;
}

export const userMetrics: UserMetric[] = [
  {
    id: "active-users",
    title: "Active Users",
    value: "12,847",
    change: "-15.3% from last month",
    changeType: "negative",
    description: "Daily, weekly, and monthly active users",
    icon: Users,
  },
  {
    id: "requests-per-user",
    title: "Requests per User",
    value: "24.7",
    change: "+8.2% from last week",
    changeType: "positive",
    description: "Average prompts, queries, and API calls per user",
    icon: MessageSquare,
  },
  {
    id: "session-length",
    title: "Session Length",
    value: "12m 34s",
    change: "+2.1% from last month",
    changeType: "positive",
    description: "Average time spent interacting with AI",
    icon: Clock,
  },
  {
    id: "user-growth-retention",
    title: "User Growth & Retention",
    value: "68.2%",
    change: "+5.7% retention rate",
    changeType: "positive",
    description: "User growth trends and retention metrics",
    icon: TrendingUp,
  },
];
