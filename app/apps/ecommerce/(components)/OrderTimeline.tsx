"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props for OrderTimeline component
 * @param order - The order object containing date and current status
 */
interface OrderTimelineProps {
  order: {
    date: string;
    status: string;
  };
}

/**
 * Order Timeline Component
 * Displays a visual timeline of order progress with status-based styling
 * Shows four main stages: Order Placed, Order Confirmed, Order Shipped, Order Delivered
 * Uses color-coded dots and connecting lines to indicate current progress
 * Dynamically updates appearance based on current order status
 * @param order - The order object containing date and current status
 * @returns The JSX element representing the order timeline visualization
 */
export function OrderTimeline({ order }: OrderTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-2 top-5 bottom-6 border-l-2 border-dashed border-gray-200 dark:border-stone-700"></div>

          {/* Timeline Steps */}
          <div className="space-y-8 relative">
            <div className="flex items-start gap-4">
              <div
                className={`w-4 h-4 rounded-full mt-1 border-2 border-white shadow-sm ${
                  order.status !== "cancelled" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              <div className="flex-1">
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()} at{" "}
                  {new Date(order.date).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-4 h-4 rounded-full mt-1 border-2 border-white shadow-sm ${
                  order.status !== "pending" && order.status !== "cancelled"
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    order.status !== "pending" && order.status !== "cancelled"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Order Confirmed
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.status !== "pending" && order.status !== "cancelled"
                    ? "Order has been confirmed and is being processed"
                    : "Waiting for confirmation"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-4 h-4 rounded-full mt-1 border-2 border-white shadow-sm ${
                  order.status === "shipped" || order.status === "delivered"
                    ? "bg-yellow-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    order.status === "shipped" || order.status === "delivered"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Order Shipped
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.status === "shipped" || order.status === "delivered"
                    ? "Order has been shipped and is on its way"
                    : "Waiting to be shipped"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-4 h-4 rounded-full mt-1 border-2 border-white shadow-sm ${
                  order.status === "delivered" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    order.status === "delivered"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Order Delivered
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.status === "delivered"
                    ? "Order has been successfully delivered"
                    : "Waiting for delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
