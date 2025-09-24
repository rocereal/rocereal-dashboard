import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { propertiesData } from "@/data/real-estate";
import { metadataTemplates } from "@/lib/metadata";
import { ArrowLeft, Download, Eye, Share, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PropertyDetails } from "../(components)/PropertyDetails";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Property Details",
  "View and manage property information and details."
);

/**
 * Property Details Page Component
 * This is the dynamic page component for viewing individual property details
 * It extracts the property ID from URL parameters, finds the property in the data, and renders the property details interface
 * Includes property information display and action buttons for preview/download/share/delete
 * Handles the case where the property is not found by showing an appropriate error message
 * @param params - Promise containing the route parameters, specifically the property ID
 * @returns The JSX element representing the property details page or not found message
 */
export default async function PropertyDetailsPage({
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardHeader
          title={property.title}
          subtitle={`${property.address}, ${property.city}, ${property.state} • ${property.type}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Real Estate", href: "/apps/real-estate" },
            { label: property.title },
          ]}
        />
        <div className="flex items-center justify-start lg:justify-end flex-wrap gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Virtual Tour
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Listing
          </Button>

          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>
      </div>

      <PropertyDetails property={property} />
    </div>
  );
}
