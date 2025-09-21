import { MetricData } from "./analytics";

export const financeMetrics: MetricData[] = [
  {
    id: "total-revenue",
    title: "Total Revenue",
    value: "$12.5M",
    change: "↑ 8% vs last quarter",
    changeType: "positive",
    icon: "DollarSign",
  },
  {
    id: "total-expenses",
    title: "Total Expenses",
    value: "$8.1M",
    change: "↑ 3% vs last quarter",
    changeType: "positive",
    icon: "TrendingDown",
  },
  {
    id: "net-profit-margin",
    title: "Net Profit Margin",
    value: "35%",
    change: "↑ 2%",
    changeType: "positive",
    icon: "BarChart3",
  },
  {
    id: "cash-on-hand",
    title: "Cash on Hand",
    value: "$2.4M",
    change: "",
    changeType: "neutral",
    icon: "Wallet",
  },
];

export interface ProfitLossData {
  date: string;
  profit: number;
  [key: string]: string | number | undefined;
}

export const profitLossData: ProfitLossData[] = [
  {
    date: "2025-07-01",
    profit: 85000,
  },
  {
    date: "2025-07-02",
    profit: 92000,
  },
  {
    date: "2025-07-03",
    profit: -15000,
  },
  {
    date: "2025-07-04",
    profit: 105000,
  },
  {
    date: "2025-07-05",
    profit: 88000,
  },
  {
    date: "2025-07-06",
    profit: 112000,
  },
  {
    date: "2025-07-07",
    profit: 125000,
  },
  {
    date: "2025-07-08",
    profit: -22000,
  },
  {
    date: "2025-07-09",
    profit: 135000,
  },
  {
    date: "2025-07-10",
    profit: 98000,
  },
  {
    date: "2025-07-11",
    profit: 142000,
  },
  {
    date: "2025-07-12",
    profit: 158000,
  },
  {
    date: "2025-07-13",
    profit: -35000,
  },
  {
    date: "2025-07-14",
    profit: 168000,
  },
  {
    date: "2025-07-15",
    profit: 145000,
  },
  {
    date: "2025-07-16",
    profit: 175000,
  },
  {
    date: "2025-07-17",
    profit: 152000,
  },
  {
    date: "2025-07-18",
    profit: 120000,
  },
];

export interface TransactionData {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending" | "failed";
}

export const transactionsData: TransactionData[] = [
  {
    id: "TXN-001",
    date: "2025-08-18",
    description: "Client Payment - ABC Corp",
    category: "Revenue",
    amount: 25000,
    type: "income",
    status: "completed",
  },
  {
    id: "TXN-002",
    date: "2025-08-17",
    description: "Office Supplies Purchase",
    category: "Operations",
    amount: -1250,
    type: "expense",
    status: "completed",
  },
  {
    id: "TXN-003",
    date: "2025-08-16",
    description: "Software Subscription",
    category: "Technology",
    amount: -890,
    type: "expense",
    status: "completed",
  },
  {
    id: "TXN-004",
    date: "2025-08-15",
    description: "Consulting Services",
    category: "Revenue",
    amount: 18500,
    type: "income",
    status: "completed",
  },
  {
    id: "TXN-005",
    date: "2025-08-14",
    description: "Marketing Campaign",
    category: "Marketing",
    amount: -3200,
    type: "expense",
    status: "completed",
  },
  {
    id: "TXN-006",
    date: "2025-08-13",
    description: "Equipment Purchase",
    category: "Operations",
    amount: -8500,
    type: "expense",
    status: "pending",
  },
  {
    id: "TXN-007",
    date: "2025-08-12",
    description: "Freelance Payment",
    category: "Revenue",
    amount: 4200,
    type: "income",
    status: "completed",
  },
  {
    id: "TXN-008",
    date: "2025-08-11",
    description: "Insurance Premium",
    category: "Operations",
    amount: -1200,
    type: "expense",
    status: "completed",
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
