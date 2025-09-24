"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface NearbyFeature {
  id: string;
  type:
    | "school"
    | "park"
    | "shopping"
    | "restaurant"
    | "hospital"
    | "transport"
    | "other";
  name: string;
  distance: number;
  rating?: number;
  description?: string;
}

interface NearbyFeaturesDrawerProps {
  onAddFeature: (feature: Omit<NearbyFeature, "id">) => void;
  children?: React.ReactNode;
}

/**
 * Nearby Features Drawer Component
 * Provides a slide-out drawer for adding new nearby features
 * Includes form fields for feature type, name, distance, rating, and description
 * @param onAddFeature - Callback function when a new feature is added
 * @param children - Optional trigger element, defaults to Add Feature button
 * @returns The JSX element representing the nearby features drawer
 */
export function NearbyFeaturesDrawer({
  onAddFeature,
  children,
}: NearbyFeaturesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "" as NearbyFeature["type"],
    name: "",
    distance: "",
    rating: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.name || !formData.distance) {
      return; // Basic validation
    }

    const newFeature: Omit<NearbyFeature, "id"> = {
      type: formData.type,
      name: formData.name,
      distance: parseFloat(formData.distance),
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      description: formData.description || undefined,
    };

    onAddFeature(newFeature);

    // Reset form and close drawer
    setFormData({
      type: "" as NearbyFeature["type"],
      name: "",
      distance: "",
      rating: "",
      description: "",
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      type: "" as NearbyFeature["type"],
      name: "",
      distance: "",
      rating: "",
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
            Add Feature
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="h-full flex flex-col  pb-4">
        <SheetHeader>
          <SheetTitle>Add Nearby Feature</SheetTitle>
          <SheetDescription>
            Add a new nearby amenity, school, park, or point of interest.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feature-type">Feature Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as NearbyFeature["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="park">Park</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feature-distance">Distance (miles) *</Label>
                <Input
                  id="feature-distance"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 0.5"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature-name">Name *</Label>
              <Input
                id="feature-name"
                type="text"
                placeholder="e.g., Lincoln High School"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature-rating">Rating (1-5 stars)</Label>
              <Input
                id="feature-rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="e.g., 4.5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature-description">Description</Label>
              <Textarea
                id="feature-description"
                placeholder="Additional details about this feature..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Feature
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
