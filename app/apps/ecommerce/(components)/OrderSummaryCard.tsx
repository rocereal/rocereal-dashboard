"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderProduct } from "@/data/ecommerce";
import { DollarSign } from "lucide-react";

interface OrderSummaryCardProps {
  order: {
    date: string;
    products: OrderProduct[];
    orderValue: number;
  };
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Order Date</span>
          <span>{new Date(order.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Items</span>
          <span>{order.products.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Order Total</span>
          <span className="font-medium">${order.orderValue.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
