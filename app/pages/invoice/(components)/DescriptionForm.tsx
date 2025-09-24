/**
 * Description Form Component
 * Form section for collecting product description in invoice creation
 * Provides textarea input for detailed product information
 * Used in invoice creation workflow for product description entry
 * @param description - Current description text value
 * @param onChange - Callback function called when description changes
 * @returns JSX element representing the description form section
 */

"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  description: string;
  onChange: (value: string) => void;
}

/**
 * DescriptionForm component for collecting product description
 * Renders textarea field for detailed product information entry
 * Includes helper text to guide users on description content
 * @param description - Current description text value
 * @param onChange - Function called when description text changes
 * @returns JSX element representing the description form
 */
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
          rows={4}
        />
        <div className="text-xs text-muted-foreground">
          Provide a detailed description of your product to help customers
          understand its features and benefits.
        </div>
      </div>
    </div>
  );
}
