"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/data/real-estate";
import { MapPin } from "lucide-react";

interface PropertyMapProps {
  property: Property;
  className?: string;
}

/**
 * Property Map Component
 * Displays a map card showing the property location
 * Currently shows a placeholder map with address information
 * Can be easily replaced with actual map integration (Google Maps, Mapbox, etc.)
 * @param property - The property object containing address information
 * @param className - Optional CSS class name for additional styling
 * @returns The JSX element representing the property map
 */
export function PropertyMap({ property, className }: PropertyMapProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Property Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Placeholder */}
          <div className="relative aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium text-muted-foreground">Map View</p>
                <p className="text-sm text-muted-foreground">
                  Interactive map would be displayed here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Google Maps / Mapbox integration)
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-2">
            <h4 className="font-medium">Address Details</h4>
            <div className="text-sm space-y-1">
              <p className="font-medium">{property.address}</p>
              <p className="text-muted-foreground">
                {property.city}, {property.state} {property.zipCode}
              </p>
              {property.latitude && property.longitude && (
                <p className="text-muted-foreground text-xs">
                  Coordinates: {property.latitude.toFixed(6)},{" "}
                  {property.longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <button className="text-sm text-primary hover:underline">
              Get Directions
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-sm text-primary hover:underline">
              View on Map
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
