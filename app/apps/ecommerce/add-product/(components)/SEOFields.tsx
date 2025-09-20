"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface SEOFieldsProps {
  productData: {
    metaTitle: string;
    metaDescription: string;
    urlSlug: string;
  };
  onChange: (field: string, value: string) => void;
}

export function SEOFields({ productData, onChange }: SEOFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle" className="flex items-center gap-2">
          Meta Title
          <Info className="h-4 w-4 text-muted-foreground" />
        </Label>
        <Input
          id="metaTitle"
          type="text"
          placeholder="Enter meta title"
          value={productData.metaTitle}
          onChange={(e) => onChange("metaTitle", e.target.value)}
          maxLength={60}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <p>
            Appears in browser tabs, search results, and social media links.
            Keep it under 60 characters for best results.
          </p>
          <span>{productData.metaTitle.length}/60</span>
        </div>
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription" className="flex items-center gap-2">
          Meta Description
          <Info className="h-4 w-4 text-muted-foreground" />
        </Label>
        <Textarea
          id="metaDescription"
          placeholder="Enter meta description"
          value={productData.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          rows={3}
          maxLength={160}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <p>
            Appears under the title in search results. Write a compelling
            summary that encourages clicks. Keep it under 160 characters.
          </p>
          <span>{productData.metaDescription.length}/160</span>
        </div>
      </div>

      {/* URL Slug */}
      <div className="space-y-2">
        <Label htmlFor="urlSlug">URL Slug</Label>
        <div className="flex">
          <span className="w-32 inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
            /products/
          </span>
          <Input
            id="urlSlug"
            type="text"
            placeholder="product-name"
            value={productData.urlSlug}
            onChange={(e) => onChange("urlSlug", e.target.value)}
            className="!rounded-l-none"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          The URL-friendly version of your product name. Leave blank to
          auto-generate from the product name.
        </p>
      </div>
    </div>
  );
}
