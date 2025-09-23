/**
 * User Metrics Component
 * Displays key user statistics and metrics in card format
 * Transforms raw user metrics data into visual metric cards
 * Shows total users, active users, inactive users, and other key metrics
 */

import { SectionCards } from "./SectionCards";
import { UserMetrics } from "@/data/users-data";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Activity,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

/**
 * Props for the UserMetricsComponent
 * @param metrics - User metrics data object containing various user statistics
 */
interface UserMetricsProps {
  metrics: UserMetrics;
}

/**
 * UserMetricsComponent for displaying user statistics
 * Transforms raw user metrics data into formatted metric cards for display
 * Shows various user-related statistics with icons, changes, and descriptions
 * @param metrics - Raw user metrics data from the data layer
 * @returns JSX element representing the user metrics cards
 */
export function UserMetricsComponent({ metrics }: UserMetricsProps) {
  // Transform UserMetrics to UserMetric[] format expected by SectionCards
  const userMetricsData = [
    {
      id: "total-users",
      title: "Total Users",
      value: metrics.totalUsers.toString(),
      icon: Users,
      changeType: "positive" as const,
      change: "+12%",
      description: "Total registered users in the system",
    },
    {
      id: "active-users",
      title: "Active Users",
      value: metrics.activeUsers.toString(),
      icon: UserCheck,
      changeType: "positive" as const,
      change: "+8%",
      description: "Users active in the last 30 days",
    },
    {
      id: "inactive-users",
      title: "Inactive Users",
      value: metrics.inactiveUsers.toString(),
      icon: UserX,
      changeType: "negative" as const,
      change: "-3%",
      description: "Users inactive for 30+ days",
    },
    {
      id: "pending-users",
      title: "Pending Users",
      value: metrics.pendingUsers.toString(),
      icon: Clock,
      changeType: "neutral" as const,
      change: "0%",
      description: "Users awaiting activation",
    },
    {
      id: "suspended-users",
      title: "Suspended Users",
      value: metrics.suspendedUsers.toString(),
      icon: AlertTriangle,
      changeType: "negative" as const,
      change: "+2%",
      description: "Users currently suspended",
    },
    {
      id: "new-users-month",
      title: "New This Month",
      value: metrics.newUsersThisMonth.toString(),
      icon: UserPlus,
      changeType: "positive" as const,
      change: "+15%",
      description: "New user registrations this month",
    },
    {
      id: "avg-session",
      title: "Avg Session",
      value: `${metrics.averageSessionDuration}m`,
      icon: Activity,
      changeType: "positive" as const,
      change: "+5m",
      description: "Average session duration",
    },
    {
      id: "churn-rate",
      title: "Churn Rate",
      value: `${metrics.churnRate}%`,
      icon: TrendingUp,
      changeType: "negative" as const,
      change: "-0.5%",
      description: "Monthly user churn rate",
    },
  ];

  return <SectionCards metrics={userMetricsData} className="mb-8" />;
}
