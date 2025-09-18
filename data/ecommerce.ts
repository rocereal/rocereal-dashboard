import {
  DollarSign,
  ShoppingCart,
  Receipt,
  RotateCcw,
  Star,
  Package,
} from "lucide-react";

export interface EcommerceMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  description?: string;
}

export const ecommerceMetrics: EcommerceMetric[] = [
  {
    id: "total-sales",
    title: "Total Sales",
    value: "$1.2M",
    change: "↑ 14% vs last month",
    changeType: "positive",
    icon: DollarSign,
    description: "Total sales revenue for the period",
  },
  {
    id: "orders-today",
    title: "Orders Today",
    value: "842",
    change: "↑ 5% vs yesterday",
    changeType: "positive",
    icon: ShoppingCart,
    description: "Number of orders placed today",
  },
  {
    id: "avg-order-value",
    title: "Avg Order Value",
    value: "$142",
    change: "",
    changeType: "neutral",
    icon: Receipt,
    description: "Average value per order",
  },
  {
    id: "customer-retention",
    title: "Customer Retention",
    value: "67%",
    change: "",
    changeType: "neutral",
    icon: RotateCcw,
    description: "Percentage of returning customers",
  },
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    value: "4.7/5",
    change: "+0.1 from last month",
    changeType: "positive",
    icon: Star,
    description: "Average customer satisfaction rating",
  },
  {
    id: "inventory-turnover",
    title: "Inventory Turnover",
    value: "8.2x",
    change: "+0.5x from last quarter",
    changeType: "positive",
    icon: Package,
    description: "How often inventory is sold and replaced",
  },
];

export interface RevenueData {
  date: string;
  revenue: number;
}

export const revenueData: RevenueData[] = [
  {
    date: "2025-08-01",
    revenue: 85000,
  },
  {
    date: "2025-08-02",
    revenue: 92000,
  },
  {
    date: "2025-08-03",
    revenue: 78000,
  },
  {
    date: "2025-08-04",
    revenue: 105000,
  },
  {
    date: "2025-08-05",
    revenue: 88000,
  },
  {
    date: "2025-08-06",
    revenue: 112000,
  },
  {
    date: "2025-08-07",
    revenue: 125000,
  },
  {
    date: "2025-08-08",
    revenue: 95000,
  },
  {
    date: "2025-08-09",
    revenue: 135000,
  },
  {
    date: "2025-08-10",
    revenue: 98000,
  },
  {
    date: "2025-08-11",
    revenue: 142000,
  },
  {
    date: "2025-08-12",
    revenue: 158000,
  },
  {
    date: "2025-08-13",
    revenue: 115000,
  },
  {
    date: "2025-08-14",
    revenue: 168000,
  },
  {
    date: "2025-08-15",
    revenue: 145000,
  },
  {
    date: "2025-08-16",
    revenue: 175000,
  },
  {
    date: "2025-08-17",
    revenue: 152000,
  },
  {
    date: "2025-08-18",
    revenue: 120000,
  },
];

export interface FunnelData {
  stage: string;
  users: number;
  percentage: number;
  color?: string;
}

export const conversionFunnelData: FunnelData[] = [
  {
    stage: "Visitors",
    users: 10000,
    percentage: 100,
    color: "#3b82f6",
  },
  {
    stage: "Add to Cart",
    users: 3200,
    percentage: 32,
    color: "#10b981",
  },
  {
    stage: "Checkout",
    users: 1800,
    percentage: 18,
    color: "#f59e0b",
  },
  {
    stage: "Purchase",
    users: 1200,
    percentage: 12,
    color: "#ef4444",
  },
];

export interface OrderData {
  id: string;
  customer: string;
  products: string[];
  orderValue: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export const ordersData: OrderData[] = [
  {
    id: "ORD-001",
    customer: "John Smith",
    products: ["Wireless Headphones", "Phone Case"],
    orderValue: 89.98,
    status: "delivered",
    date: "2025-08-18",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    products: ["Laptop Stand", "USB Cable"],
    orderValue: 45.5,
    status: "shipped",
    date: "2025-08-17",
  },
  {
    id: "ORD-003",
    customer: "Mike Davis",
    products: ["Smart Watch", "Screen Protector"],
    orderValue: 199.99,
    status: "processing",
    date: "2025-08-16",
  },
  {
    id: "ORD-004",
    customer: "Emily Chen",
    products: ["Bluetooth Speaker"],
    orderValue: 79.99,
    status: "pending",
    date: "2025-08-15",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    products: ["Gaming Mouse", "Keyboard", "Mouse Pad"],
    orderValue: 124.97,
    status: "delivered",
    date: "2025-08-14",
  },
  {
    id: "ORD-006",
    customer: "Lisa Brown",
    products: ["Tablet Cover", "Stylus Pen"],
    orderValue: 34.98,
    status: "shipped",
    date: "2025-08-13",
  },
  {
    id: "ORD-007",
    customer: "Tom Anderson",
    products: ["External Hard Drive"],
    orderValue: 89.99,
    status: "cancelled",
    date: "2025-08-12",
  },
  {
    id: "ORD-008",
    customer: "Anna Martinez",
    products: ["Wireless Earbuds", "Charging Case"],
    orderValue: 149.98,
    status: "processing",
    date: "2025-08-11",
  },
];

export const ecommerceCharts = {
  salesByCategory: [
    { name: "Electronics", value: 35, color: "#0088FE" },
    { name: "Clothing", value: 25, color: "#00C49F" },
    { name: "Home & Garden", value: 20, color: "#FFBB28" },
    { name: "Books", value: 12, color: "#FF8042" },
    { name: "Sports", value: 8, color: "#8884D8" },
  ],
  ordersByRegion: [
    { name: "North America", value: 45 },
    { name: "Europe", value: 30 },
    { name: "Asia", value: 15 },
    { name: "Other", value: 10 },
  ],
  trafficSources: [
    { name: "Organic Search", value: 40 },
    { name: "Direct", value: 25 },
    { name: "Social Media", value: 20 },
    { name: "Email", value: 10 },
    { name: "Paid Ads", value: 5 },
  ],
};
