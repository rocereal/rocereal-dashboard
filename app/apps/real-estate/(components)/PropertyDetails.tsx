"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Property } from "@/data/real-estate";
import { MortgageCalculator } from "./MortgageCalculator";
import { PropertyMap } from "./PropertyMap";
import {
  Bath,
  Bed,
  Calendar,
  DollarSign,
  Home,
  Mail,
  MapPin,
  Phone,
  Ruler,
  User,
} from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

/**
 * Property Details Component
 * Displays comprehensive property information in a well-organized layout
 * Shows property images, key details, features, description, and agent information
 * Organized into cards for better readability and visual hierarchy
 * @param property - The property object to display details for
 * @returns The JSX element representing the property details view
 */
export function PropertyDetails({ property }: PropertyDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "sold":
        return "bg-red-100 text-red-800 border-red-200";
      case "off-market":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Images and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border"
                  >
                    <ImageComponentOptimized
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Price & Status
                </span>
                <Badge className={getStatusColor(property.status)}>
                  {property.status.replace("-", " ")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${Math.round(property.price / property.sqft)}/sq ft
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {property.sqft.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Sq Ft</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{property.yearBuilt}</p>
                    <p className="text-xs text-muted-foreground">Year Built</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Agent Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{property.agent}</p>
                <p className="text-sm text-muted-foreground">Listing Agent</p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${property.agentEmail}`}
                  className="text-sm hover:underline"
                >
                  {property.agentEmail}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${property.agentPhone}`}
                  className="text-sm hover:underline"
                >
                  {property.agentPhone}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Row: Map and Mortgage Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PropertyMap property={property} />
        <MortgageCalculator property={property} />
      </div>

      {/* Floor Plans Section */}
      {property.floorPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Floor Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {property.floorPlans.map((floorPlan, index) => (
                <div key={floorPlan.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{floorPlan.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Level {floorPlan.level} •{" "}
                        {floorPlan.sqft.toLocaleString()} sq ft
                      </p>
                    </div>
                    {floorPlan.image && (
                      <div className="text-sm text-primary cursor-pointer hover:underline">
                        View Floor Plan
                      </div>
                    )}
                  </div>

                  {floorPlan.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {floorPlan.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {floorPlan.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-muted/50 rounded-md p-3 text-sm"
                      >
                        <div className="font-medium capitalize">
                          {room.name}
                        </div>
                        <div className="text-muted-foreground">
                          {room.sqft} sq ft • {room.type}
                        </div>
                        {room.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {room.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Features Section */}
      {property.nearbyFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Nearby Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.nearbyFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {feature.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {feature.name}
                      </h4>
                      {feature.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            ★
                          </span>
                          <span className="text-xs font-medium">
                            {feature.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {feature.distance} miles away
                    </p>
                    {feature.description && (
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="capitalize">{property.type}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p>{property.address}</p>
              <p className="text-sm text-muted-foreground">
                {property.city}, {property.state} {property.zipCode}
              </p>
            </div>

            {property.lotSize && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Lot Size
                </p>
                <p>{property.lotSize.toLocaleString()} sq ft</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Listed
              </p>
              <p>{formatDate(property.listedDate)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground">{property.description}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Features</h4>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
