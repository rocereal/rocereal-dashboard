"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (files: FileList) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  return (
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <div className="space-y-2">
        <h5 className="text-lg font-medium">Upload Product Images</h5>
        <p className="text-sm text-muted-foreground">
          Drag and drop images here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP. Maximum 5MB per image.
        </p>
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <Plus className="h-4 w-4 mr-2" />
        Choose Files
      </Button>
    </div>
  );
}
