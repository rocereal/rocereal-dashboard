"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface Room {
  id: string;
  name: string;
  type:
    | "bedroom"
    | "bathroom"
    | "living"
    | "dining"
    | "kitchen"
    | "office"
    | "garage"
    | "basement"
    | "other";
  sqft: number;
  level: number;
  description?: string;
}

interface FloorPlan {
  id: string;
  level: number;
  name: string;
  sqft: number;
  rooms: Room[];
  image?: string;
  description?: string;
}

interface FloorPlansDrawerProps {
  onAddFloorPlan: (
    floorPlan: Omit<FloorPlan, "id" | "rooms"> & { rooms: Omit<Room, "id">[] }
  ) => void;
  children?: React.ReactNode;
}

/**
 * Floor Plans Drawer Component
 * Provides a slide-out drawer for adding new floor plans
 * Includes form fields for floor level, name, square footage, and description
 * @param onAddFloorPlan - Callback function when a new floor plan is added
 * @param children - Optional trigger element, defaults to Add Floor Plan button
 * @returns The JSX element representing the floor plans drawer
 */
export function FloorPlansDrawer({
  onAddFloorPlan,
  children,
}: FloorPlansDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    level: "",
    name: "",
    sqft: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.level || !formData.name || !formData.sqft) {
      return; // Basic validation
    }

    const newFloorPlan: Omit<FloorPlan, "id" | "rooms"> & {
      rooms: Omit<Room, "id">[];
    } = {
      level: parseInt(formData.level),
      name: formData.name,
      sqft: parseInt(formData.sqft),
      description: formData.description || undefined,
      rooms: [], // Start with empty rooms array
    };

    onAddFloorPlan(newFloorPlan);

    // Reset form and close drawer
    setFormData({
      level: "",
      name: "",
      sqft: "",
      description: "",
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      level: "",
      name: "",
      sqft: "",
      description: "",
    });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Floor Plan
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Add Floor Plan</SheetTitle>
          <SheetDescription>
            Create a new floor plan with level, name, and square footage
            details.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor-level">Floor Level *</Label>
                <Input
                  id="floor-level"
                  type="number"
                  min="0"
                  placeholder="e.g., 1"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor-sqft">Square Feet *</Label>
                <Input
                  id="floor-sqft"
                  type="number"
                  min="0"
                  placeholder="e.g., 1200"
                  value={formData.sqft}
                  onChange={(e) =>
                    setFormData({ ...formData, sqft: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor-name">Floor Name *</Label>
              <Input
                id="floor-name"
                type="text"
                placeholder="e.g., Main Floor, Upper Level, Basement"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor-description">Description</Label>
              <Textarea
                id="floor-description"
                placeholder="Describe this floor plan..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">Note:</p>
              <p>
                After creating the floor plan, you can add individual rooms with
                detailed specifications including room type, square footage, and
                descriptions.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Floor Plan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
