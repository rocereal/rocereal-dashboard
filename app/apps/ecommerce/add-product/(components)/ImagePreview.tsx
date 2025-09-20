"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  images: File[];
  onRemoveImage: (index: number) => void;
}

export function ImagePreview({ images, onRemoveImage }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium">Uploaded Images ({images.length})</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border">
              <ImageComponentOptimized
                src={URL.createObjectURL(image)}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemoveImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
            {index === 0 && (
              <Badge className="absolute bottom-2 left-2">Main</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
