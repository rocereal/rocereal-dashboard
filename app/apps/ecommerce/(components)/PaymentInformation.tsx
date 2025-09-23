"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

/**
 * Props for PaymentInformation component
 * @param orderId - The unique identifier for the order
 */
interface PaymentInformationProps {
  orderId: string;
}

/**
 * Payment Information Component
 * Displays payment details for an order including method, status, and transaction ID
 * Shows payment information in a clean card layout with status badges
 * Generates transaction ID based on the order ID for display purposes
 * @param orderId - The unique identifier for the order
 * @returns The JSX element representing the payment information card
 */
export function PaymentInformation({ orderId }: PaymentInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Payment Method</span>
          <span>Credit Card</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Payment Status</span>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span>Transaction ID</span>
          <span className="font-mono text-xs">txn_{orderId.toLowerCase()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
