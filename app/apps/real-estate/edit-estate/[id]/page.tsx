import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { propertiesData } from "@/data/real-estate";
import { metadataTemplates } from "@/lib/metadata";
import { ArrowLeft, Save, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PropertyTabs } from "../../(components)/PropertyTabs";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Edit Property",
  "Edit property information and details."
);

/**
 * Edit Property Page Component
 * This is the dynamic page component for editing individual property details
 * It extracts the property ID from URL parameters, finds the property in the data, and renders the property editing interface
 * Includes property information editing with tabbed interface and action buttons for save/cancel
 * Handles the case where the property is not found by showing an appropriate error message
 * @param params - Promise containing the route parameters, specifically the property ID
 * @returns The JSX element representing the property edit page or not found message
 */
export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Find the property by ID
  const property = propertiesData.find((p) => p.id === slug);

  if (!property) {
    return (
      <div className="flex flex-col space-y-6">
        <DashboardHeader
          title="Property Not Found"
          subtitle="The requested property could not be found"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Real Estate", href: "/apps/real-estate" },
            { label: "Edit", href: "/apps/real-estate/edit-estate" },
            { label: "Not Found" },
          ]}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Property not found.</p>
          <Link href="/apps/real-estate">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <PropertyTabs property={property} />
    </div>
  );
}
