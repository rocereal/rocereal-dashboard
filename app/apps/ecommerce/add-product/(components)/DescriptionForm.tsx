"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  description: string;
  onChange: (value: string) => void;
}

export function DescriptionForm({
  description,
  onChange,
}: DescriptionFormProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Description</h4>
      <div className="space-y-2">
        <Label htmlFor="description">Product Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          Provide a detailed description of your product to help customers
          understand its features and benefits.
        </p>
      </div>
    </div>
  );
}
