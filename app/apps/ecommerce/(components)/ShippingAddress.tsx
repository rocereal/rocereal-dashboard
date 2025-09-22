"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ShippingAddressProps {
  customer: string;
}

export function ShippingAddress({ customer }: ShippingAddressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-1">
          <p className="font-medium">{customer}</p>
          <p>123 Main Street</p>
          <p>Apt 4B</p>
          <p>New York, NY 10001</p>
          <p>United States</p>
        </div>
      </CardContent>
    </Card>
  );
}
