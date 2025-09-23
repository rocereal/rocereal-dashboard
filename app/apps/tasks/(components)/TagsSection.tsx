/**
 * TagsSection Component
 * Form section component for managing task tags with add/remove functionality
 * Displays current tags as removable badges and provides input for adding new tags
 * Shows tag count and handles tag management interactions
 * @returns The tags section component
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Tag, X } from "lucide-react";

interface TagsSectionProps {
  tags: string[];
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tagToRemove: string) => void;
}

/**
 * TagsSection function component
 * Renders a form section for managing task tags
 * Handles adding new tags and removing existing ones
 * @param tags - Array of current tag strings
 * @param newTag - The current value of the new tag input
 * @param onNewTagChange - Callback when new tag input changes
 * @param onAddTag - Callback to add the new tag to the list
 * @param onRemoveTag - Callback to remove a tag by value
 * @returns JSX element for the tags section
 */
export default function TagsSection({
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
}: TagsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tags
          <Badge variant="outline" className="ml-auto">
            {tags.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Tag */}
        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAddTag();
              }
            }}
          />
          <Button onClick={onAddTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tags List */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => onRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
