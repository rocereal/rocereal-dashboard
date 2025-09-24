"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Home, MapPin, Plus, Save, X, Trash2 } from "lucide-react";
import { useState } from "react";
import { Property } from "@/data/real-estate";
import { NearbyFeaturesDrawer } from "./NearbyFeaturesDrawer";
import { FloorPlansDrawer } from "./FloorPlansDrawer";
import { MortgageCalculator } from "./MortgageCalculator";
import { ColumnDef } from "@tanstack/react-table";

/**
 * Property data structure for form management
 * Contains all fields required for property creation and editing
 */
interface PropertyData {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: string;
  type: "house" | "apartment" | "condo" | "townhouse" | "land";
  status: "available" | "pending" | "sold" | "off-market";
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  description: string;
  features: string[];
  agent: string;
  agentEmail: string;
  agentPhone: string;
}

/**
 * Property Tabs Component
 * Provides a tabbed interface for editing property information with multiple sections
 * Organizes property editing into logical tabs: Information, Location, Pricing, and Details
 * Manages complex property data state and provides save/cancel functionality
 * Pre-populates form fields with existing property data for editing
 * @param property - The property object to edit
 * @returns The JSX element representing the complete property editing interface
 */
export function PropertyTabs({ property }: { property: Property }) {
  const [propertyData, setPropertyData] = useState<PropertyData>({
    // Basic Information
    title: property.title,
    address: property.address,
    city: property.city,
    state: property.state,
    zipCode: property.zipCode,

    // Pricing & Status
    price: property.price.toString(),
    type: property.type,
    status: property.status,

    // Property Details
    bedrooms: property.bedrooms.toString(),
    bathrooms: property.bathrooms.toString(),
    sqft: property.sqft.toString(),
    lotSize: property.lotSize?.toString() || "",
    yearBuilt: property.yearBuilt.toString(),

    // Additional Info
    description: property.description,
    features: property.features,

    // Agent Info
    agent: property.agent,
    agentEmail: property.agentEmail,
    agentPhone: property.agentPhone,
  });

  const [nearbyFeatures, setNearbyFeatures] = useState(
    property.nearbyFeatures || []
  );

  const handleAddFeature = (
    feature: Omit<(typeof property.nearbyFeatures)[0], "id">
  ) => {
    const newFeature = {
      ...feature,
      id: `feature-${Date.now()}`,
    };
    setNearbyFeatures([...nearbyFeatures, newFeature]);
  };

  const handleRemoveFeature = (featureId: string) => {
    setNearbyFeatures(
      nearbyFeatures.filter((feature) => feature.id !== featureId)
    );
  };

  const nearbyFeaturesColumns: ColumnDef<(typeof nearbyFeatures)[0]>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("type")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "distance",
      header: "Distance",
      cell: ({ row }) => <span>{row.getValue("distance")} miles</span>,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return rating ? (
          <div className="flex items-center gap-1">
            <span>★</span>
            <span>{rating}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRemoveFeature(row.original.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const tabs = [
    {
      id: "property-info",
      label: "Property Information",
      iconName: "FileText",
      content: (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property-title">Property Title</Label>
                <Input
                  id="property-title"
                  type="text"
                  value={propertyData.title}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-type">Property Type</Label>
                <Select
                  value={propertyData.type}
                  onValueChange={(value) =>
                    setPropertyData({
                      ...propertyData,
                      type: value as PropertyData["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property-description">Description</Label>
              <Textarea
                id="property-description"
                value={propertyData.description}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={propertyData.bedrooms}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      bedrooms: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={propertyData.bathrooms}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      bathrooms: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sqft">Square Feet</Label>
                <Input
                  id="sqft"
                  type="number"
                  value={propertyData.sqft}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, sqft: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year-built">Year Built</Label>
                <Input
                  id="year-built"
                  type="number"
                  value={propertyData.yearBuilt}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      yearBuilt: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lot-size">Lot Size (sq ft)</Label>
                <Input
                  id="lot-size"
                  type="number"
                  value={propertyData.lotSize}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      lotSize: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                type="text"
                value={propertyData.features.join(", ")}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    features: e.target.value.split(",").map((f) => f.trim()),
                  })
                }
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "location-features",
      label: "Location & Features",
      iconName: "MapPin",
      content: (
        <div className="space-y-6">
          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Location</h3>
            <div className="space-y-2">
              <Label htmlFor="street-address">Street Address</Label>
              <Input
                id="street-address"
                type="text"
                value={propertyData.address}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={propertyData.city}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  value={propertyData.state}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip-code">ZIP Code</Label>
                <Input
                  id="zip-code"
                  type="text"
                  value={propertyData.zipCode}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      zipCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Nearby Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium border-b pb-2">
                Nearby Features
              </h3>
              <NearbyFeaturesDrawer onAddFeature={handleAddFeature}>
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </NearbyFeaturesDrawer>
            </div>
            <div className="text-sm text-muted-foreground">
              Add and manage nearby amenities, schools, parks, shopping centers,
              and other points of interest.
            </div>
            {nearbyFeatures.length > 0 ? (
              <DataTable
                columns={nearbyFeaturesColumns}
                data={nearbyFeatures}
                searchKey="name"
                searchPlaceholder="Search features..."
              />
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No nearby features added yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Add Feature" to start adding schools, parks,
                  restaurants, and other local amenities
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "pricing",
      label: "Pricing & Status",
      iconName: "DollarSign",
      content: (
        <div className="space-y-6">
          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Pricing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={propertyData.price}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={propertyData.status}
                  onValueChange={(value) =>
                    setPropertyData({
                      ...propertyData,
                      status: value as PropertyData["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="off-market">Off Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Mortgage Calculator */}
          <div className="space-y-4">
            <MortgageCalculator
              property={{
                ...property,
                price: parseFloat(propertyData.price) || property.price,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "floor-plans",
      label: "Floor Plans",
      iconName: "Home",
      content: (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Floor plans and room details will be editable here. This section
            allows you to define the layout and specifications of each floor and
            room in the property.
          </div>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Floor Plan Editor</p>
            <p className="text-sm text-muted-foreground mt-2">
              Interactive floor plan and room management coming soon
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "agent",
      label: "Agent Information",
      iconName: "User",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                type="text"
                value={propertyData.agent}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, agent: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-email">Agent Email</Label>
              <Input
                id="agent-email"
                type="email"
                value={propertyData.agentEmail}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    agentEmail: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-phone">Agent Phone</Label>
            <Input
              id="agent-phone"
              type="tel"
              value={propertyData.agentPhone}
              onChange={(e) =>
                setPropertyData({
                  ...propertyData,
                  agentPhone: e.target.value,
                })
              }
            />
          </div>
        </div>
      ),
    },
  ];

  /**
   * Handle Save
   * Processes the form submission to save the updated property
   * Currently logs the property data and is a placeholder for backend integration
   * In a real implementation, this would send the data to an API endpoint
   */
  const handleSave = () => {
    console.log("Saving property:", propertyData);
    // Here you would typically save the data to your backend
  };

  /**
   * Handle Cancel
   * Resets the form data back to the original property values
   * Cancels any unsaved changes and restores the initial state
   */
  const handleCancel = () => {
    setPropertyData({
      // Basic Information
      title: property.title,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,

      // Pricing & Status
      price: property.price.toString(),
      type: property.type,
      status: property.status,

      // Property Details
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      sqft: property.sqft.toString(),
      lotSize: property.lotSize?.toString() || "",
      yearBuilt: property.yearBuilt.toString(),

      // Additional Info
      description: property.description,
      features: property.features,

      // Agent Info
      agent: property.agent,
      agentEmail: property.agentEmail,
      agentPhone: property.agentPhone,
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Edit Property</h2>
          <p className="text-sm text-muted-foreground">
            Update the property information below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <TabsWithIcons
        tabs={tabs}
        className="!w-full lg:!w-full border bg-card rounded-md p-8"
        grid="!grid !grid-cols-5"
      >
        <TabsContent value="property-info" className="space-y-4 pt-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-title">Property Title</Label>
                  <Input
                    id="property-title"
                    type="text"
                    value={propertyData.title}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select
                    value={propertyData.type}
                    onValueChange={(value) =>
                      setPropertyData({
                        ...propertyData,
                        type: value as PropertyData["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property-description">Description</Label>
                <Textarea
                  id="property-description"
                  value={propertyData.description}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={propertyData.bedrooms}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        bedrooms: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={propertyData.bathrooms}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        bathrooms: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Square Feet</Label>
                  <Input
                    id="sqft"
                    type="number"
                    value={propertyData.sqft}
                    onChange={(e) =>
                      setPropertyData({ ...propertyData, sqft: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year-built">Year Built</Label>
                  <Input
                    id="year-built"
                    type="number"
                    value={propertyData.yearBuilt}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        yearBuilt: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lot-size">Lot Size (sq ft)</Label>
                  <Input
                    id="lot-size"
                    type="number"
                    value={propertyData.lotSize}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        lotSize: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  type="text"
                  value={propertyData.features.join(", ")}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      features: e.target.value.split(",").map((f) => f.trim()),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location-features" className="space-y-4 pt-4">
          <div className="space-y-6">
            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Location</h3>
              <div className="space-y-2">
                <Label htmlFor="street-address">Street Address</Label>
                <Input
                  id="street-address"
                  type="text"
                  value={propertyData.address}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={propertyData.city}
                    onChange={(e) =>
                      setPropertyData({ ...propertyData, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    value={propertyData.state}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip-code">ZIP Code</Label>
                  <Input
                    id="zip-code"
                    type="text"
                    value={propertyData.zipCode}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        zipCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Nearby Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium border-b pb-2">
                  Nearby Features
                </h3>
                <NearbyFeaturesDrawer onAddFeature={handleAddFeature}>
                  <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </NearbyFeaturesDrawer>
              </div>
              <div className="text-sm text-muted-foreground">
                Add and manage nearby amenities, schools, parks, shopping
                centers, and other points of interest.
              </div>
              {nearbyFeatures.length > 0 ? (
                <DataTable
                  columns={nearbyFeaturesColumns}
                  data={nearbyFeatures}
                  searchKey="name"
                  searchPlaceholder="Search features..."
                />
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No nearby features added yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click "Add Feature" to start adding schools, parks,
                    restaurants, and other local amenities
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 pt-4">
          <div className="space-y-6">
            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Pricing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={propertyData.price}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={propertyData.status}
                    onValueChange={(value) =>
                      setPropertyData({
                        ...propertyData,
                        status: value as PropertyData["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="off-market">Off Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="space-y-4">
              <MortgageCalculator
                property={{
                  ...property,
                  price: parseFloat(propertyData.price) || property.price,
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="floor-plans" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Floor Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Define the layout and specifications of each floor and room in
                  the property.
                </p>
              </div>
              <FloorPlansDrawer
                onAddFloorPlan={(floorPlan) =>
                  console.log("Added floor plan:", floorPlan)
                }
              >
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Floor Plan
                </Button>
              </FloorPlansDrawer>
            </div>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Floor Plan Editor</p>
              <p className="text-sm text-muted-foreground mt-2">
                Interactive floor plan and room management coming soon
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agent" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  type="text"
                  value={propertyData.agent}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, agent: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-email">Agent Email</Label>
                <Input
                  id="agent-email"
                  type="email"
                  value={propertyData.agentEmail}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      agentEmail: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-phone">Agent Phone</Label>
              <Input
                id="agent-phone"
                type="tel"
                value={propertyData.agentPhone}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    agentPhone: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}
