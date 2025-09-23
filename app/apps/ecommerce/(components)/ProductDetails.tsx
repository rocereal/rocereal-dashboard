"use client";

import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/ecommerce";

/**
 * Props for ProductDetails component
 * @param product - The product object to display details for
 */
interface ProductDetailsProps {
  product: Product;
}

/**
 * Product Details Component
 * Displays key product information in a structured format including name, SKU, category, price, stock, and status
 * Shows product details with appropriate styling and status badges
 * Formats price and stock information for better readability
 * @param product - The product object to display details for
 * @returns The JSX element representing the product details section
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  const details = [
    { label: "Name", value: product.name },
    { label: "SKU", value: product.sku },
    { label: "Category", value: product.category },
    {
      label: "Price",
      value: `$${product.price.toFixed(2)}`,
      className: "text-lg font-semibold",
    },
    { label: "Stock", value: `${product.stock} units` },
    {
      label: "Status",
      value: (
        <Badge
          variant={
            product.status === "active"
              ? "default"
              : product.status === "inactive"
              ? "secondary"
              : "destructive"
          }
        >
          {product.status.replace("-", " ")}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product Details</h3>
      <div className="space-y-3">
        {details.map((detail, index) => (
          <div key={index}>
            <label className="text-sm font-medium text-muted-foreground">
              {detail.label}
            </label>
            <div className={`text-sm ${detail.className || ""}`}>
              {detail.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
