"use client";

import { Product } from "@/data/ecommerce";

/**
 * Props for ProductMetadata component
 * @param product - The product object to display metadata for
 */
interface ProductMetadataProps {
  product: Product;
}

/**
 * Product Metadata Component
 * Displays product creation and last update timestamps in a formatted layout
 * Shows metadata information including created date and last updated date
 * Formats dates for better readability with full month names and numeric dates
 * @param product - The product object to display metadata for
 * @returns The JSX element representing the product metadata section
 */
export function ProductMetadata({ product }: ProductMetadataProps) {
  const metadata = [
    {
      label: "Created",
      value: new Date(product.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      label: "Last Updated",
      value: new Date(product.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Metadata</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metadata.map((item, index) => (
          <div key={index}>
            <label className="text-sm font-medium text-muted-foreground">
              {item.label}
            </label>
            <p className="text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
