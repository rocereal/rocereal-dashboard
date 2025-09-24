"use client";

import { PropertyTabs } from "../(components)/PropertyTabs";

/**
 * Add Property Page
 * Provides a form interface for adding new properties to the real estate system
 * Uses the same PropertyTabs component with empty default values for new property creation
 * @returns The JSX element representing the add property page
 */
export default function AddPropertyPage() {
  // Create a template property with empty/default values for new property creation
  const newPropertyTemplate = {
    id: `property-${Date.now()}`, // Temporary ID for form state management
    title: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: 0,
    type: "house" as const,
    status: "available" as const,
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    lotSize: undefined,
    yearBuilt: new Date().getFullYear(),
    description: "",
    features: [],
    images: [],
    floorPlans: [],
    nearbyFeatures: [],
    agent: "",
    agentEmail: "",
    agentPhone: "",
    listedDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    updatedDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to add a new property to your real estate
          listings.
        </p>
      </div>

      <PropertyTabs property={newPropertyTemplate} />
    </div>
  );
}
