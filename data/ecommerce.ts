import { MetricData } from "./analytics";

export const ecommerceMetrics: MetricData[] = [
  {
    id: "total-orders",
    title: "Total Orders",
    value: "12,847",
    change: "+15.3% from last month",
    changeType: "positive",
    icon: "ShoppingCart",
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "$284,739.50",
    change: "+22.1% from last month",
    changeType: "positive",
    icon: "DollarSign",
  },
  {
    id: "conversion-rate",
    title: "Conversion Rate",
    value: "3.8%",
    change: "+0.4% from last week",
    changeType: "positive",
    icon: "TrendingUp",
  },
  {
    id: "avg-order-value",
    title: "Avg Order Value",
    value: "$89.45",
    change: "+$5.20 from last month",
    changeType: "positive",
    icon: "Receipt",
  },
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    value: "4.7/5",
    change: "+0.1 from last month",
    changeType: "positive",
    icon: "Star",
  },
  {
    id: "inventory-turnover",
    title: "Inventory Turnover",
    value: "8.2x",
    change: "+0.5x from last quarter",
    changeType: "positive",
    icon: "Package",
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
