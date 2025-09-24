"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Home, MapPin, Save, X } from "lucide-react";
import { useState } from "react";
import { Property } from "@/data/real-estate";

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

  const tabs = [
    {
      id: "information",
      label: "Basic Information",
      iconName: "FileText",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={propertyData.title}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Type</label>
              <select
                className="w-full p-2 border rounded-md"
                value={propertyData.type}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    type: e.target.value as PropertyData["type"],
                  })
                }
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px]"
              value={propertyData.description}
              onChange={(e) =>
                setPropertyData({
                  ...propertyData,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>
      ),
    },
    {
      id: "location",
      label: "Location",
      iconName: "MapPin",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Street Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={propertyData.address}
              onChange={(e) =>
                setPropertyData({ ...propertyData, address: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={propertyData.city}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, city: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={propertyData.state}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, state: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={propertyData.zipCode}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, zipCode: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "pricing",
      label: "Pricing & Status",
      iconName: "DollarSign",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={propertyData.price}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full p-2 border rounded-md"
                value={propertyData.status}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    status: e.target.value as PropertyData["status"],
                  })
                }
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="off-market">Off Market</option>
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "details",
      label: "Property Details",
      iconName: "Home",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bedrooms</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={propertyData.bedrooms}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, bedrooms: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bathrooms</label>
              <input
                type="number"
                step="0.5"
                className="w-full p-2 border rounded-md"
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
              <label className="text-sm font-medium">Square Feet</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={propertyData.sqft}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, sqft: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year Built</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Lot Size (sq ft)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={propertyData.lotSize}
              onChange={(e) =>
                setPropertyData({ ...propertyData, lotSize: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Features (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
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
      id: "nearby-features",
      label: "Nearby Features",
      iconName: "MapPin",
      content: (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Add and manage nearby amenities, schools, parks, shopping centers,
            and other points of interest.
          </div>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nearby Features Manager</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add schools, parks, restaurants, and other local amenities
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
              <label className="text-sm font-medium">Agent Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={propertyData.agent}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, agent: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
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
            <label className="text-sm font-medium">Agent Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded-md"
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
        <TabsContent value="information" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={propertyData.title}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={propertyData.type}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      type: e.target.value as PropertyData["type"],
                    })
                  }
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[100px]"
                value={propertyData.description}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Street Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={propertyData.address}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={propertyData.city}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={propertyData.state}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, state: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ZIP Code</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
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
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ($)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={propertyData.price}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={propertyData.status}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      status: e.target.value as PropertyData["status"],
                    })
                  }
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="off-market">Off Market</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
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
                <label className="text-sm font-medium">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full p-2 border rounded-md"
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
                <label className="text-sm font-medium">Square Feet</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={propertyData.sqft}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, sqft: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year Built</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Lot Size (sq ft)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={propertyData.lotSize}
                onChange={(e) =>
                  setPropertyData({ ...propertyData, lotSize: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Features (comma-separated)
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
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
        </TabsContent>

        <TabsContent value="agent" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={propertyData.agent}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, agent: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
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
              <label className="text-sm font-medium">Agent Phone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
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
