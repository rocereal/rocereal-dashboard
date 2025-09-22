"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

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

interface SEOTabProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

export function SEOTab({ productData, setProductData }: SEOTabProps) {
  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-semibold flex items-center gap-2">
          Search Engine Optimization
        </h4>
        <p className="text-sm text-muted-foreground">
          Configure how your product appears in search engines and social media
        </p>
      </div>

      {/* SEO Fields */}
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
            onChange={(e) => handleInputChange("metaTitle", e.target.value)}
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
            onChange={(e) =>
              handleInputChange("metaDescription", e.target.value)
            }
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
              onChange={(e) => handleInputChange("urlSlug", e.target.value)}
              className="!rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            The URL-friendly version of your product name. Leave blank to
            auto-generate from the product name.
          </p>
        </div>
      </div>

      {/* SEO Preview */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h4 className="text-md font-semibold mb-4">Search Result Preview</h4>

        {/* Google Search Result Preview */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Google Search Result
          </div>
          <div className="border rounded-lg p-4 bg-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="text-sm text-green-700 truncate">
                  {productData.urlSlug
                    ? `yoursite.com/products/${productData.urlSlug}`
                    : "yoursite.com/products/product-name"}
                </div>
              </div>
              <h3 className="text-blue-600 text-lg hover:underline cursor-pointer line-clamp-1">
                {productData.metaTitle || productData.name || "Product Title"}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {productData.metaDescription ||
                  productData.description ||
                  "Product description appears here..."}
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Preview */}
        <div className="space-y-2 mt-6">
          <div className="text-sm text-muted-foreground">
            Social Media Preview
          </div>
          <div className="border rounded-lg p-4 bg-white max-w-sm">
            <div className="space-y-2">
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Product Image</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm line-clamp-2">
                  {productData.metaTitle || productData.name || "Product Title"}
                </h4>
                <p className="text-gray-600 text-xs line-clamp-2">
                  {productData.metaDescription ||
                    productData.description ||
                    "Product description appears here..."}
                </p>
                <div className="text-xs text-gray-500 mt-1">yoursite.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
