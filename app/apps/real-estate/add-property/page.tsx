import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import { PropertyTabs } from "../(components)/PropertyTabs";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Add New Property",
  "Create a new property listing with detailed information and images."
);

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
    <div className="flex flex-col space-y-6">
      <PropertyTabs property={newPropertyTemplate} />
    </div>
  );
}
