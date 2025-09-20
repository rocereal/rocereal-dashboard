"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface PricingFormProps {
  productData: {
    price: string;
    comparePrice: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PricingForm({ productData, onChange }: PricingFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Pricing Information</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Selling Price *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={productData.price}
              onChange={(e) => onChange("price", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comparePrice">Compare at Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="comparePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={productData.comparePrice}
              onChange={(e) => onChange("comparePrice", e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Original price to show as a comparison (for sales/discounts)
          </p>
        </div>
      </div>
    </div>
  );
}
