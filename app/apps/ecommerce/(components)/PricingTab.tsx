"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

/**
 * Product data structure for form management
 * Contains all fields required for product creation and editing
 */
interface ProductData {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  taxRate: string;
  stock: string;
  lowStockThreshold: string;
  trackInventory: boolean;
  allowBackorders: boolean;
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  images: File[];
}

/**
 * Props for PricingTab component
 * @param productData - The current product data state
 * @param setProductData - Function to update the product data state
 */
interface PricingTabProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

/**
 * Pricing Tab Component
 * Handles product pricing configuration within the add product form including selling price, compare price, cost price, and tax rate
 * Calculates and displays real-time profit margins, tax amounts, and pricing preview
 * Manages form state updates for pricing-related product data
 * @param productData - The current product data state
 * @param setProductData - Function to update the product data state
 * @returns The JSX element representing the pricing tab interface
 */
export function PricingTab({ productData, setProductData }: PricingTabProps) {
  /**
   * Handle Input Change
   * Updates the product data state when form inputs change
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const price = parseFloat(productData.price) || 0;
  const comparePrice = parseFloat(productData.comparePrice) || 0;
  const costPrice = parseFloat(productData.costPrice) || 0;
  const taxRate = parseFloat(productData.taxRate) || 0;

  const taxAmount = (price * taxRate) / 100;
  const profit = price - costPrice - taxAmount;
  const profitMargin = costPrice > 0 ? (profit / costPrice) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing Information */}
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
                  onChange={(e) => handleInputChange("price", e.target.value)}
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
                  onChange={(e) =>
                    handleInputChange("comparePrice", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Original price to show as a comparison (for sales/discounts)
              </p>
            </div>
          </div>
        </div>

        {/* Cost & Tax */}
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
                  onChange={(e) =>
                    handleInputChange("costPrice", e.target.value)
                  }
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
                onChange={(e) => handleInputChange("taxRate", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tax rate as a percentage (e.g., 8.25 for 8.25%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h4 className="text-md font-semibold mb-4">Pricing Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Selling Price</div>
            <div className="text-2xl font-bold">${price.toFixed(2)}</div>
          </div>

          {comparePrice > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Compare Price</div>
              <div className="text-lg text-muted-foreground line-through">
                ${comparePrice.toFixed(2)}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Tax Amount</div>
            <div className="text-lg">${taxAmount.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Profit</div>
            <div
              className={`text-lg font-medium ${
                profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${profit.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Profit Margin</div>
            <div
              className={`text-lg font-medium ${
                profitMargin >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {profitMargin.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Price</div>
            <div className="text-lg font-semibold">
              ${(price + taxAmount).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
