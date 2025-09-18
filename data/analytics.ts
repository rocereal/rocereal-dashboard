export interface MetricData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  [key: string]: any;
}

export const analyticsMetrics: MetricData[] = [
  {
    id: "total-revenue",
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    changeType: "positive",
    icon: "DollarSign",
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1% from last month",
    changeType: "positive",
    icon: "Users",
  },
  {
    id: "sales",
    title: "Sales",
    value: "+12,234",
    change: "+19% from last month",
    changeType: "positive",
    icon: "ShoppingCart",
  },
  {
    id: "active-users",
    title: "Active Now",
    value: "+573",
    change: "+201 since last hour",
    changeType: "positive",
    icon: "Activity",
  },
  {
    id: "conversion-rate",
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5% from last week",
    changeType: "positive",
    icon: "TrendingUp",
  },
  {
    id: "bounce-rate",
    title: "Bounce Rate",
    value: "24.5%",
    change: "-2.1% from last month",
    changeType: "positive",
    icon: "TrendingDown",
  },
];

export const analyticsCharts = {
  revenueBySource: [
    { name: "Direct", value: 35, color: "#0088FE" },
    { name: "Social", value: 25, color: "#00C49F" },
    { name: "Email", value: 20, color: "#FFBB28" },
    { name: "Referral", value: 15, color: "#FF8042" },
    { name: "Organic", value: 5, color: "#8884D8" },
  ],
  userAcquisition: [
    { name: "Jan", newUsers: 1200, returningUsers: 800 },
    { name: "Feb", newUsers: 1400, returningUsers: 950 },
    { name: "Mar", newUsers: 1600, returningUsers: 1100 },
    { name: "Apr", newUsers: 1800, returningUsers: 1250 },
    { name: "May", newUsers: 2000, returningUsers: 1400 },
    { name: "Jun", newUsers: 2200, returningUsers: 1550 },
  ],
  trafficSources: [
    { name: "Desktop", value: 65 },
    { name: "Mobile", value: 30 },
    { name: "Tablet", value: 5 },
  ],
};
