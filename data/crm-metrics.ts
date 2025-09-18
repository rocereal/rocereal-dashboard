import { Users, Briefcase, Star, LifeBuoy } from "lucide-react";

export interface CRMMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  description?: string;
}

export const crmMetrics: CRMMetric[] = [
  {
    id: "total-customers",
    title: "Total Customers",
    value: "3,245",
    change: "+5% vs last month",
    changeType: "positive",
    icon: Users,
    description: "Active customer accounts",
  },
  {
    id: "open-deals",
    title: "Open Deals",
    value: 128,
    change: "$2.3M pipeline value",
    changeType: "positive",
    icon: Briefcase,
    description: "Active sales opportunities",
  },
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    value: "89%",
    change: "Avg rating this quarter",
    changeType: "positive",
    icon: Star,
    description: "Based on recent surveys",
  },
  {
    id: "support-tickets",
    title: "Support Tickets Open",
    value: 47,
    change: "Avg resolution: 2.1 hrs",
    changeType: "neutral",
    icon: LifeBuoy,
    description: "Currently active support cases",
  },
];
