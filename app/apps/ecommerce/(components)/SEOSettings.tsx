"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface SEOSettingsProps {
  seoData: {
    metaTitle: string;
    metaDescription: string;
  };
  onChange: (field: string, value: string) => void;
}

export function SEOSettings({ seoData, onChange }: SEOSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>SEO & Metadata</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure how your product appears in search engines and social media
        </p>
      </div>

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
            value={seoData.metaTitle}
            onChange={(e) => onChange("metaTitle", e.target.value)}
            maxLength={60}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>
              Appears in browser tabs, search results, and social media links.
              Keep it under 60 characters for best results.
            </p>
            <span>{seoData.metaTitle.length}/60</span>
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
            value={seoData.metaDescription}
            onChange={(e) => onChange("metaDescription", e.target.value)}
            rows={3}
            maxLength={160}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>
              Appears under the title in search results. Write a compelling
              summary that encourages clicks. Keep it under 160 characters.
            </p>
            <span>{seoData.metaDescription.length}/160</span>
          </div>
        </div>
      </div>
    </div>
  );
}
