"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import {
  Property,
  propertiesData,
  realEstateMetrics,
} from "@/data/real-estate";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { RealEstateTable } from "./RealEstateTable";
import { SectionCards } from "./SectionCards";

/**
 * Render Page Component
 * This is the main rendering component for the real estate management page
 * Displays property statistics cards, dashboard header with actions, and the properties table
 * Manages property state and provides handlers for edit, delete, and view operations
 * @returns The JSX element representing the complete real estate management page
 */
export default function RenderPage() {
  const [properties, setProperties] = useState(propertiesData);

  /**
   * Handle Edit
   * Handles the edit action for a property
   * Currently logs the property and is a placeholder for edit functionality implementation
   * @param property - The property object to edit
   */
  const handleEdit = (property: Property) => {
    console.log("Edit property:", property);
    // Implement edit functionality
  };

  /**
   * Handle Delete
   * Handles the delete action for a property with confirmation dialog
   * Shows a browser confirm dialog and removes the property from state if confirmed
   * @param property - The property object to delete
   */
  const handleDelete = (property: Property) => {
    console.log("Delete property:", property);
    // Implement delete functionality with confirmation
    if (confirm(`Are you sure you want to delete "${property.title}"?`)) {
      setProperties(properties.filter((p) => p.id !== property.id));
    }
  };

  /**
   * Handle View
   * Handles the view action for a property
   * Currently logs the property and is a placeholder for view details functionality
   * @param property - The property object to view
   */
  const handleView = (property: Property) => {
    console.log("View property:", property);
    // Implement view details functionality
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Real Estate Management"
        subtitle="Manage your property listings, inquiries, and sales"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Real Estate", href: "/apps/real-estate" },
        ]}
        primaryAction={{
          label: "Add Property",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Export Report",
          icon: <FileText className="h-4 w-4" />,
        }}
      />

      {/* Real Estate Stats Cards */}
      <SectionCards metrics={realEstateMetrics} />

      {/* Properties Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Property Listings</h3>
          <RealEstateTable
            properties={properties}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>
    </div>
  );
}
