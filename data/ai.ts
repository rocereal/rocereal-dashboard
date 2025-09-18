export interface AITab {
  id: string;
  label: string;
  iconName: string;
  description?: string;
}

export const aiTabs: AITab[] = [
  {
    id: "user",
    label: "User",
    iconName: "User",
    description: "User management and personalization",
  },
  {
    id: "model",
    label: "Model",
    iconName: "Cpu",
    description: "AI model training and deployment",
  },
  {
    id: "engage",
    label: "Engage",
    iconName: "MessageSquare",
    description: "User engagement and interactions",
  },
  {
    id: "business",
    label: "Business",
    iconName: "Building2",
    description: "Business intelligence and analytics",
  },
];

// Sample metrics for each tab
export const userMetrics = [
  {
    id: "active-users",
    title: "Active Users",
    value: "12,847",
    change: "+15.3% from last month",
    changeType: "positive" as const,
    icon: "Users",
  },
  {
    id: "user-engagement",
    title: "User Engagement",
    value: "78.5%",
    change: "+5.2% from last week",
    changeType: "positive" as const,
    icon: "Activity",
  },
  {
    id: "retention-rate",
    title: "Retention Rate",
    value: "68.2%",
    change: "+2.1% from last month",
    changeType: "positive" as const,
    icon: "TrendingUp",
  },
];

export const modelMetrics = [
  {
    id: "response-accuracy",
    title: "Response Accuracy",
    value: "87.3%",
    change: "-2.1% from last month",
    changeType: "negative" as const,
    icon: "Target",
  },
  {
    id: "completion-success-rate",
    title: "Completion Success Rate",
    value: "92.8%",
    change: "+1.5% from last week",
    changeType: "positive" as const,
    icon: "CheckCircle",
  },
  {
    id: "latency",
    title: "Average Latency",
    value: "1.2s",
    change: "+8.7% from last month",
    changeType: "negative" as const,
    icon: "Clock",
  },
  {
    id: "token-usage",
    title: "Token Usage Ratio",
    value: "2.1:1",
    change: "-3.2% efficiency",
    changeType: "negative" as const,
    icon: "Zap",
  },
];

export const engageMetrics = [
  {
    id: "most-used-features",
    title: "Most Used Features",
    value: "Code Gen (32%)",
    change: "+12.5% code generation",
    changeType: "positive" as const,
    icon: "Code",
  },
  {
    id: "popular-queries",
    title: "Popular Queries",
    value: "Debug Help",
    change: "Emerging trend",
    changeType: "neutral" as const,
    icon: "Search",
  },
  {
    id: "user-feedback",
    title: "User Feedback Rating",
    value: "3.8/5",
    change: "-0.3 from last month",
    changeType: "negative" as const,
    icon: "Star",
  },
  {
    id: "repeat-usage-rate",
    title: "Repeat Usage Rate",
    value: "45.2%",
    change: "-8.7% from last week",
    changeType: "negative" as const,
    icon: "RotateCcw",
  },
];

export const businessMetrics = [
  {
    id: "monetization-stats",
    title: "Credits Used",
    value: "856K",
    change: "+12.3% from last month",
    changeType: "positive" as const,
    icon: "CreditCard",
  },
  {
    id: "cost-tracking",
    title: "Compute Cost per Request",
    value: "$0.045",
    change: "+15.2% from last quarter",
    changeType: "negative" as const,
    icon: "DollarSign",
  },
  {
    id: "roi-indicators",
    title: "Value vs Cost Ratio",
    value: "8.2x",
    change: "-1.8x from last month",
    changeType: "negative" as const,
    icon: "TrendingDown",
  },
  {
    id: "prompt-effectiveness",
    title: "Prompt Success Rate",
    value: "73.1%",
    change: "-4.2% from last week",
    changeType: "negative" as const,
    icon: "Target",
  },
];
