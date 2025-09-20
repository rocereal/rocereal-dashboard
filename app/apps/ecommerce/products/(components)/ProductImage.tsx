"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

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
