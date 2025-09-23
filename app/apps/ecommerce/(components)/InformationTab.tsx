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
import { Textarea } from "@/components/ui/textarea";

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
 * Props for InformationTab component
 * @param productData - The current product data state
 * @param setProductData - Function to update the product data state
 */
interface InformationTabProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

/**
 * Information Tab Component
 * Handles basic product information input within the add product form
 * Includes product name, SKU, category selection, and description fields
 * Manages form state updates for information-related product data
 * @param productData - The current product data state
 * @param setProductData - Function to update the product data state
 * @returns The JSX element representing the information tab interface
 */
export function InformationTab({
  productData,
  setProductData,
}: InformationTabProps) {
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

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Sports & Fitness",
    "Accessories",
    "Home & Office",
    "Sports & Outdoors",
    "Books",
    "Beauty & Personal Care",
    "Toys & Games",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Basic Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                type="text"
                placeholder="Enter SKU"
                value={productData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={productData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Description</h4>
          <Textarea
            placeholder="Enter product description"
            value={productData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={8}
          />
        </div>
      </div>
    </div>
  );
}
