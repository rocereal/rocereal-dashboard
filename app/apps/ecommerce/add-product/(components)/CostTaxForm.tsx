"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface CostTaxFormProps {
  productData: {
    costPrice: string;
    taxRate: string;
  };
  onChange: (field: string, value: string) => void;
}

export function CostTaxForm({ productData, onChange }: CostTaxFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Cost & Tax</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={productData.costPrice}
              onChange={(e) => onChange("costPrice", e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your cost for this product (for profit calculations)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={productData.taxRate}
            onChange={(e) => onChange("taxRate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Tax rate as a percentage (e.g., 8.25 for 8.25%)
          </p>
        </div>
      </div>
    </div>
  );
}
