"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";

/**
 * Props for ProductImage component
 * @param src - The image source URL
 * @param alt - The alt text for the image
 * @param className - Optional additional CSS classes
 */
interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Product Image Component
 * Displays a product image in a square aspect ratio with rounded corners and border
 * Uses optimized image component for better performance and responsive sizing
 * Supports custom CSS classes for additional styling
 * @param src - The image source URL
 * @param alt - The alt text for the image
 * @param className - Optional additional CSS classes
 * @returns The JSX element representing the product image container
 */
export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  return (
    <div
      className={`aspect-square max-w-sm rounded-lg overflow-hidden border ${className}`}
    >
      <ImageComponentOptimized
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="400px"
      />
    </div>
  );
}
