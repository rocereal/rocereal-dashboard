import BluetoothSpeaker from "@/app/assets/products/Bluetooth Speaker.png";
import CeramicCoffeeMug from "@/app/assets/products/Ceramic Coffee Mug.png";
import LeatherWallet from "@/app/assets/products/Leather Wallet.png";
import LEDDeskLamp from "@/app/assets/products/LED Desk Lamp.png";
import OrganicCottonTShirt from "@/app/assets/products/Organic Cotton T-Shirt.png";
import SmartFitnessWatch from "@/app/assets/products/Smart Fitness Watch.png";
import StainlessSteelWaterBottle from "@/app/assets/products/Stainless Steel Water Bottle.png";
import WirelessBluetoothHeadphones from "@/app/assets/products/Wireless Bluetooth Headphones.png";
import WirelessChargingPad from "@/app/assets/products/Wireless Charging Pad.png";
import YogaMatPremium from "@/app/assets/products/Yoga Mat Premium.png";
import {
  DollarSign,
  Package,
  Receipt,
  RotateCcw,
  ShoppingCart,
  Star,
} from "lucide-react";
import type { StaticImageData } from "next/image";

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

export interface OrderProduct {
  name: string;
  image: string | StaticImageData;
}

export interface OrderData {
  id: string;
  customer: string;
  products: OrderProduct[];
  orderValue: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export const ordersData: OrderData[] = [
  {
    id: "ord-001",
    customer: "John Smith",
    products: [
      {
        name: "Wireless Bluetooth Headphones",
        image: WirelessBluetoothHeadphones,
      },
      { name: "Ceramic Coffee Mug", image: CeramicCoffeeMug },
    ],
    orderValue: 89.98,
    status: "delivered",
    date: "2025-08-18",
  },
  {
    id: "ord-002",
    customer: "Sarah Johnson",
    products: [
      { name: "LED Desk Lamp", image: LEDDeskLamp },
      { name: "Leather Wallet", image: LeatherWallet },
    ],
    orderValue: 145.5,
    status: "shipped",
    date: "2025-08-17",
  },
  {
    id: "ord-003",
    customer: "Mike Davis",
    products: [
      { name: "Smart Fitness Watch", image: SmartFitnessWatch },
      {
        name: "Stainless Steel Water Bottle",
        image: StainlessSteelWaterBottle,
      },
    ],
    orderValue: 199.99,
    status: "processing",
    date: "2025-08-16",
  },
  {
    id: "ord-004",
    customer: "Emily Chen",
    products: [{ name: "Bluetooth Speaker", image: BluetoothSpeaker }],
    orderValue: 79.99,
    status: "pending",
    date: "2025-08-15",
  },
  {
    id: "ord-005",
    customer: "David Wilson",
    products: [
      { name: "Yoga Mat Premium", image: YogaMatPremium },
      { name: "Organic Cotton T-Shirt", image: OrganicCottonTShirt },
    ],
    orderValue: 124.97,
    status: "delivered",
    date: "2025-08-14",
  },
  {
    id: "ord-006",
    customer: "Lisa Brown",
    products: [
      { name: "Leather Wallet", image: LeatherWallet },
      {
        name: "Stainless Steel Water Bottle",
        image: StainlessSteelWaterBottle,
      },
    ],
    orderValue: 134.98,
    status: "shipped",
    date: "2025-08-13",
  },
  {
    id: "ord-007",
    customer: "Tom Anderson",
    products: [{ name: "Wireless Charging Pad", image: WirelessChargingPad }],
    orderValue: 89.99,
    status: "cancelled",
    date: "2025-08-12",
  },
  {
    id: "ord-008",
    customer: "Anna Martinez",
    products: [
      {
        name: "Wireless Bluetooth Headphones",
        image: WirelessBluetoothHeadphones,
      },
      { name: "Organic Cotton T-Shirt", image: OrganicCottonTShirt },
    ],
    orderValue: 149.98,
    status: "processing",
    date: "2025-08-11",
  },
];

export interface ProductPurchase {
  id: string;
  orderId: string;
  customer: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  purchaseDate: string;
  customerEmail?: string;
}

// Sample purchases for each product
export const getProductPurchases = (productId: string): ProductPurchase[] => {
  const purchases: Record<string, ProductPurchase[]> = {
    "prod-001": [
      {
        id: "PUR-001",
        orderId: "ord-001",
        customer: "John Smith",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
        status: "delivered",
        purchaseDate: "2025-08-18",
        customerEmail: "john.smith@email.com",
      },
      {
        id: "PUR-002",
        orderId: "ord-009",
        customer: "Alice Johnson",
        quantity: 2,
        unitPrice: 89.99,
        totalPrice: 179.98,
        status: "shipped",
        purchaseDate: "2025-08-16",
        customerEmail: "alice.j@email.com",
      },
      {
        id: "PUR-003",
        orderId: "ord-015",
        customer: "Bob Wilson",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
        status: "processing",
        purchaseDate: "2025-08-14",
        customerEmail: "bob.wilson@email.com",
      },
    ],
    "prod-002": [
      {
        id: "PUR-004",
        orderId: "ord-003",
        customer: "Mike Davis",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
        status: "processing",
        purchaseDate: "2025-08-16",
        customerEmail: "mike.davis@email.com",
      },
      {
        id: "PUR-005",
        orderId: "ord-010",
        customer: "Sarah Brown",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
        status: "delivered",
        purchaseDate: "2025-08-13",
        customerEmail: "sarah.b@email.com",
      },
    ],
    "prod-004": [
      {
        id: "PUR-006",
        orderId: "ord-011",
        customer: "Emma Davis",
        quantity: 3,
        unitPrice: 12.99,
        totalPrice: 38.97,
        status: "delivered",
        purchaseDate: "2025-08-17",
        customerEmail: "emma.davis@email.com",
      },
      {
        id: "PUR-007",
        orderId: "ord-012",
        customer: "Chris Taylor",
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
        status: "shipped",
        purchaseDate: "2025-08-15",
        customerEmail: "chris.t@email.com",
      },
    ],
    "prod-005": [
      {
        id: "PUR-008",
        orderId: "ord-013",
        customer: "Lisa Chen",
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99,
        status: "delivered",
        purchaseDate: "2025-08-16",
        customerEmail: "lisa.chen@email.com",
      },
    ],
    "prod-006": [
      {
        id: "PUR-009",
        orderId: "ord-014",
        customer: "David Miller",
        quantity: 2,
        unitPrice: 34.99,
        totalPrice: 69.98,
        status: "pending",
        purchaseDate: "2025-08-18",
        customerEmail: "david.miller@email.com",
      },
    ],
  };

  return purchases[productId] || [];
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "out-of-stock";
  image: string | StaticImageData;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const productsData: Product[] = [
  {
    id: "prod-001",
    name: "Wireless Bluetooth Headphones",
    sku: "WBH-001",
    category: "Electronics",
    price: 89.99,
    stock: 45,
    status: "active",
    image: WirelessBluetoothHeadphones,
    description: "High-quality wireless headphones with noise cancellation",
    createdAt: "2025-01-15",
    updatedAt: "2025-08-18",
  },
  {
    id: "prod-002",
    name: "Smart Fitness Watch",
    sku: "SFW-002",
    category: "Electronics",
    price: 199.99,
    stock: 23,
    status: "active",
    image: SmartFitnessWatch,
    description: "Advanced fitness tracking with heart rate monitor",
    createdAt: "2025-02-20",
    updatedAt: "2025-08-17",
  },
  {
    id: "prod-003",
    name: "Organic Cotton T-Shirt",
    sku: "OCT-003",
    category: "Clothing",
    price: 24.99,
    stock: 0,
    status: "out-of-stock",
    image: OrganicCottonTShirt,
    description: "Comfortable organic cotton t-shirt in multiple colors",
    createdAt: "2025-03-10",
    updatedAt: "2025-08-16",
  },
  {
    id: "prod-004",
    name: "Ceramic Coffee Mug",
    sku: "CCM-004",
    category: "Home & Kitchen",
    price: 12.99,
    stock: 78,
    status: "active",
    image: CeramicCoffeeMug,
    description: "Handcrafted ceramic mug, perfect for coffee or tea",
    createdAt: "2025-04-05",
    updatedAt: "2025-08-15",
  },
  {
    id: "prod-005",
    name: "Yoga Mat Premium",
    sku: "YMP-005",
    category: "Sports & Fitness",
    price: 49.99,
    stock: 12,
    status: "active",
    image: YogaMatPremium,
    description: "Non-slip yoga mat with carrying strap",
    createdAt: "2025-05-12",
    updatedAt: "2025-08-14",
  },
  {
    id: "prod-006",
    name: "Wireless Charging Pad",
    sku: "WCP-006",
    category: "Electronics",
    price: 34.99,
    stock: 56,
    status: "active",
    image: WirelessChargingPad,
    description: "Fast wireless charging for compatible devices",
    createdAt: "2025-06-08",
    updatedAt: "2025-08-13",
  },
  {
    id: "prod-007",
    name: "Leather Wallet",
    sku: "LW-007",
    category: "Accessories",
    price: 39.99,
    stock: 8,
    status: "active",
    image: LeatherWallet,
    description: "Genuine leather wallet with RFID protection",
    createdAt: "2025-07-01",
    updatedAt: "2025-08-12",
  },
  {
    id: "prod-008",
    name: "LED Desk Lamp",
    sku: "LDL-008",
    category: "Home & Office",
    price: 29.99,
    stock: 0,
    status: "inactive",
    image: LEDDeskLamp,
    description: "Adjustable LED desk lamp with USB charging port",
    createdAt: "2025-07-15",
    updatedAt: "2025-08-11",
  },
  {
    id: "prod-009",
    name: "Stainless Steel Water Bottle",
    sku: "SSWB-009",
    category: "Sports & Outdoors",
    price: 19.99,
    stock: 34,
    status: "active",
    image: StainlessSteelWaterBottle,
    description:
      "Insulated stainless steel water bottle, keeps drinks cold for 24 hours",
    createdAt: "2025-08-01",
    updatedAt: "2025-08-10",
  },
  {
    id: "prod-010",
    name: "Bluetooth Speaker",
    sku: "BS-010",
    category: "Electronics",
    price: 79.99,
    stock: 15,
    status: "active",
    image: BluetoothSpeaker,
    description: "Portable Bluetooth speaker with waterproof design",
    createdAt: "2025-08-05",
    updatedAt: "2025-08-09",
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
