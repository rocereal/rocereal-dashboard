"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Download,
  Edit,
  Package,
  Printer,
  Truck,
} from "lucide-react";

interface OrderStatusHeaderProps {
  order: {
    id: string;
    status: string;
  };
  onPrintOrder: () => void;
  onDownloadInvoice: () => void;
  onUpdateStatus: (status: string) => void;
}

export function OrderStatusHeader({
  order,
  onPrintOrder,
  onDownloadInvoice,
  onUpdateStatus,
}: OrderStatusHeaderProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-yellow-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

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
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-3">
        {getStatusIcon(order.status)}
        <div>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <p className="text-sm text-muted-foreground mt-1">
            Order #{order.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 w-full lg:w-fit">
        <Button variant="outline" onClick={onPrintOrder}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={onDownloadInvoice}>
          <Download className="h-4 w-4 mr-2" />
          Invoice
        </Button>
        <Button onClick={() => onUpdateStatus("shipped")}>
          <Edit className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </div>
    </div>
  );
}
