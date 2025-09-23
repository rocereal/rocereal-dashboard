"use client";

import { Badge } from "@/components/ui/badge";

/**
 * Props for OrderStatusBadge component
 * @param status - The order status to display (delivered, shipped, processing, pending, cancelled)
 */
interface OrderStatusBadgeProps {
  status: string;
}

/**
 * Order Status Badge Component
 * Displays order status with color-coded styling based on status type
 * Uses different colors for delivered (green), shipped (blue), processing (yellow), pending (orange), cancelled (red)
 * @param status - The order status to display
 * @returns The JSX element representing the colored status badge
 */
export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  /**
   * Get Status Color
   * Returns appropriate Tailwind CSS classes for the status badge based on order status
   * @param status - The order status string
   * @returns Tailwind CSS class string for styling the badge
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {status}
    </Badge>
  );
}
