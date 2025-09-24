/**
 * Pricing Inventory Form Component
 * Form section for collecting pricing and inventory information in invoice creation
 * Provides input fields for price, stock quantity, and product status
 * Used in invoice creation workflow for product pricing and availability
 * @param formData - Object containing form field values (price, stock, status)
 * @param onChange - Callback function called when form fields change
 * @returns JSX element representing the pricing and inventory form section
 */

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PricingInventoryFormProps {
  formData: {
    price: string;
    stock: string;
    status: string;
  };
  onChange: (field: string, value: string) => void;
}

/**
 * PricingInventoryForm component for collecting product pricing and inventory
 * Renders form fields for price, stock quantity, and product status selection
 * Manages form state through parent component callbacks
 * @param formData - Current form data values for the fields
 * @param onChange - Function called when any field value changes
 * @returns JSX element representing the pricing and inventory form
 */
export function PricingInventoryForm({
  formData,
  onChange,
}: PricingInventoryFormProps) {
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Pricing & Inventory</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            placeholder="0"
            value={formData.stock}
            onChange={(e) => onChange("stock", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
