export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: "active" | "inactive" | "cancelled" | "past_due" | "trialing";
  billingCycle: "monthly" | "yearly";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  nextBillingDate: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export const subscriptions: Subscription[] = [
  {
    id: "sub_001",
    userId: "user_001",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    planId: "professional",
    planName: "Professional",
    status: "active",
    billingCycle: "monthly",
    currentPeriodStart: "2025-01-01",
    currentPeriodEnd: "2025-01-31",
    amount: 79,
    currency: "USD",
    nextBillingDate: "2025-02-01",
    cancelAtPeriodEnd: false,
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sub_002",
    userId: "user_002",
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@example.com",
    planId: "enterprise",
    planName: "Enterprise",
    status: "active",
    billingCycle: "yearly",
    currentPeriodStart: "2024-12-01",
    currentPeriodEnd: "2025-11-30",
    amount: 1990,
    currency: "USD",
    nextBillingDate: "2025-12-01",
    cancelAtPeriodEnd: false,
    createdAt: "2024-11-15T14:30:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
  },
  {
    id: "sub_003",
    userId: "user_003",
    userName: "Mike Davis",
    userEmail: "mike.davis@example.com",
    planId: "starter",
    planName: "Starter",
    status: "past_due",
    billingCycle: "monthly",
    currentPeriodStart: "2024-12-01",
    currentPeriodEnd: "2024-12-31",
    amount: 29,
    currency: "USD",
    nextBillingDate: "2025-01-01",
    cancelAtPeriodEnd: false,
    createdAt: "2024-11-01T09:15:00Z",
    updatedAt: "2024-12-15T09:15:00Z",
  },
  {
    id: "sub_004",
    userId: "user_004",
    userName: "Emily Chen",
    userEmail: "emily.chen@example.com",
    planId: "professional",
    planName: "Professional",
    status: "trialing",
    billingCycle: "monthly",
    currentPeriodStart: "2025-01-15",
    currentPeriodEnd: "2025-02-14",
    amount: 0,
    currency: "USD",
    nextBillingDate: "2025-02-15",
    cancelAtPeriodEnd: false,
    createdAt: "2025-01-15T16:45:00Z",
    updatedAt: "2025-01-15T16:45:00Z",
  },
  {
    id: "sub_005",
    userId: "user_005",
    userName: "David Wilson",
    userEmail: "david.wilson@example.com",
    planId: "professional",
    planName: "Professional",
    status: "cancelled",
    billingCycle: "yearly",
    currentPeriodStart: "2024-06-01",
    currentPeriodEnd: "2025-05-31",
    amount: 790,
    currency: "USD",
    nextBillingDate: null,
    cancelAtPeriodEnd: true,
    createdAt: "2024-05-15T11:20:00Z",
    updatedAt: "2024-12-01T11:20:00Z",
  },
  {
    id: "sub_006",
    userId: "user_006",
    userName: "Lisa Brown",
    userEmail: "lisa.brown@example.com",
    planId: "starter",
    planName: "Starter",
    status: "active",
    billingCycle: "monthly",
    currentPeriodStart: "2025-01-01",
    currentPeriodEnd: "2025-01-31",
    amount: 29,
    currency: "USD",
    nextBillingDate: "2025-02-01",
    cancelAtPeriodEnd: false,
    createdAt: "2024-12-15T13:10:00Z",
    updatedAt: "2025-01-01T13:10:00Z",
  },
];

export interface SubscriptionMetrics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

export const subscriptionMetrics: SubscriptionMetrics = {
  totalSubscriptions: subscriptions.length,
  activeSubscriptions: subscriptions.filter((sub) => sub.status === "active")
    .length,
  monthlyRevenue: subscriptions
    .filter((sub) => sub.status === "active" && sub.billingCycle === "monthly")
    .reduce((sum, sub) => sum + sub.amount, 0),
  yearlyRevenue: subscriptions
    .filter((sub) => sub.status === "active" && sub.billingCycle === "yearly")
    .reduce((sum, sub) => sum + sub.amount, 0),
  churnRate: 2.5, // percentage
  averageRevenuePerUser: Math.round(
    subscriptions
      .filter((sub) => sub.status === "active")
      .reduce((sum, sub) => sum + sub.amount, 0) /
      subscriptions.filter((sub) => sub.status === "active").length
  ),
};

export interface SubscriptionAction {
  id: string;
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  action: string;
}

export const subscriptionActions: SubscriptionAction[] = [
  {
    id: "view",
    label: "View Details",
    variant: "outline",
    action: "view",
  },
  {
    id: "edit",
    label: "Edit Plan",
    variant: "outline",
    action: "edit",
  },
  {
    id: "cancel",
    label: "Cancel",
    variant: "destructive",
    action: "cancel",
  },
  {
    id: "reactivate",
    label: "Reactivate",
    variant: "default",
    action: "reactivate",
  },
];
