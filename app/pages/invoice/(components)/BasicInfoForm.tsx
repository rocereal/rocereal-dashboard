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

interface BasicInfoFormProps {
  formData: {
    name: string;
    sku: string;
    category: string;
  };
  onChange: (field: string, value: string) => void;
}

export function BasicInfoForm({ formData, onChange }: BasicInfoFormProps) {
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
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Basic Information</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            type="text"
            placeholder="Enter SKU"
            value={formData.sku}
            onChange={(e) => onChange("sku", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onChange("category", value)}
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
  );
}
