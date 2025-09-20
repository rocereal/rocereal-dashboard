"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

interface OrderItem {
  name: string;
  image: string;
  product?: {
    sku?: string;
  };
  quantity: number;
  price: number;
}

interface OrderItemsCardProps {
  items: OrderItem[];
  orderValue: number;
}

export function OrderItemsCard({ items, orderValue }: OrderItemsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-start gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                <ImageComponentOptimized
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                {item.product?.sku && (
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.product.sku}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="font-medium">${item.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${orderValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${orderValue.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
