import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMetrics } from "@/data/users/users-data";
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

interface UserMetricsProps {
  metrics: UserMetrics;
}

export function UserMetricsComponent({ metrics }: UserMetricsProps) {
  const metricCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: metrics.activeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Inactive Users",
      value: metrics.inactiveUsers,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Pending Users",
      value: metrics.pendingUsers,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Suspended Users",
      value: metrics.suspendedUsers,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "New This Month",
      value: metrics.newUsersThisMonth,
      icon: UserPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Session",
      value: `${metrics.averageSessionDuration}m`,
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Churn Rate",
      value: `${metrics.churnRate}%`,
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => {
        const IconComponent = metric.icon;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
