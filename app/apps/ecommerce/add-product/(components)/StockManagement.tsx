"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StockManagementProps {
  productData: {
    stock: string;
    lowStockThreshold: string;
  };
  onChange: (field: string, value: string) => void;
}

export function StockManagement({
  productData,
  onChange,
}: StockManagementProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Stock Management</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Current Stock *</Label>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            value={productData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Number of units currently available
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            placeholder="10"
            value={productData.lowStockThreshold}
            onChange={(e) => onChange("lowStockThreshold", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Alert when stock falls below this number
          </p>
        </div>
      </div>
    </div>
  );
}
