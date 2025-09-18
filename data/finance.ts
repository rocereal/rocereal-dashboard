import { MetricData } from "./analytics";

export const financeMetrics: MetricData[] = [
  {
    id: "portfolio-value",
    title: "Portfolio Value",
    value: "$1,247,583.92",
    change: "+$23,456.78 (+1.9%)",
    changeType: "positive",
    icon: "TrendingUp",
  },
  {
    id: "monthly-profit",
    title: "Monthly Profit",
    value: "$89,432.15",
    change: "+12.3% from last month",
    changeType: "positive",
    icon: "DollarSign",
  },
  {
    id: "expenses",
    title: "Total Expenses",
    value: "$45,678.90",
    change: "-5.2% from last month",
    changeType: "positive",
    icon: "CreditCard",
  },
  {
    id: "investments",
    title: "Active Investments",
    value: "24",
    change: "+3 new this month",
    changeType: "positive",
    icon: "Briefcase",
  },
  {
    id: "roi",
    title: "Average ROI",
    value: "8.7%",
    change: "+0.3% from last quarter",
    changeType: "positive",
    icon: "Percent",
  },
  {
    id: "cash-flow",
    title: "Cash Flow",
    value: "$156,789.23",
    change: "+$12,345.67 this month",
    changeType: "positive",
    icon: "ArrowUpDown",
  },
];

export const financeCharts = {
  assetAllocation: [
    { name: "Stocks", value: 45, color: "#0088FE" },
    { name: "Bonds", value: 25, color: "#00C49F" },
    { name: "Real Estate", value: 15, color: "#FFBB28" },
    { name: "Crypto", value: 10, color: "#FF8042" },
    { name: "Cash", value: 5, color: "#8884D8" },
  ],
  monthlyPerformance: [
    { name: "Jan", portfolio: 1150000, benchmark: 1100000 },
    { name: "Feb", portfolio: 1180000, benchmark: 1120000 },
    { name: "Mar", portfolio: 1210000, benchmark: 1140000 },
    { name: "Apr", portfolio: 1190000, benchmark: 1160000 },
    { name: "May", portfolio: 1220000, benchmark: 1180000 },
    { name: "Jun", portfolio: 1247583, benchmark: 1200000 },
  ],
  expenseBreakdown: [
    { name: "Operations", value: 35 },
    { name: "Marketing", value: 25 },
    { name: "Technology", value: 20 },
    { name: "Personnel", value: 15 },
    { name: "Other", value: 5 },
  ],
};
