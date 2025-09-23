/**
 * ChecklistSection Component
 * Form section component for managing task checklist items with add/remove functionality
 * Allows users to create and manage checklist items for tasks with visual feedback
 * Displays the count of checklist items and provides interactive controls
 * @returns The checklist section component
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckSquare, Plus, X } from "lucide-react";

interface ChecklistSectionProps {
  checklistItems: string[];
  newChecklistItem: string;
  onNewChecklistItemChange: (value: string) => void;
  onAddChecklistItem: () => void;
  onRemoveChecklistItem: (index: number) => void;
}

/**
 * ChecklistSection function component
 * Renders a form section for managing task checklist items
 * Handles adding new items and removing existing ones
 * @param checklistItems - Array of current checklist item strings
 * @param newChecklistItem - The current value of the new item input
 * @param onNewChecklistItemChange - Callback when new item input changes
 * @param onAddChecklistItem - Callback to add the new item to the list
 * @param onRemoveChecklistItem - Callback to remove an item by index
 * @returns JSX element for the checklist section
 */
export default function ChecklistSection({
  checklistItems,
  newChecklistItem,
  onNewChecklistItemChange,
  onAddChecklistItem,
  onRemoveChecklistItem,
}: ChecklistSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Checklist
          <Badge variant="outline" className="ml-auto">
            {checklistItems.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Checklist Item */}
        <div className="flex gap-2">
          <Input
            placeholder="Add checklist item"
            value={newChecklistItem}
            onChange={(e) => onNewChecklistItemChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAddChecklistItem();
              }
            }}
          />
          <Button onClick={onAddChecklistItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Checklist Items */}
        {checklistItems.length > 0 && (
          <div className="space-y-2">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <CheckSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm flex-1">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveChecklistItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
