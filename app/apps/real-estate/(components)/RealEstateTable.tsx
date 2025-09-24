"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/components/ui/sonner";
import { Property } from "@/data/real-estate";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RealEstateTableProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  onView?: (property: Property) => void;
}

/**
 * Real Estate Table Component
 * Renders a comprehensive data table for managing properties with selection, sorting, and bulk actions
 * Includes property images, details, status badges, and action dropdown menus
 * Supports bulk selection and operations like export and delete
 * Provides search functionality and responsive design
 * @param properties - Array of property objects to display in the table
 * @param onEdit - Optional callback function when edit action is triggered
 * @param onDelete - Optional callback function when delete action is triggered
 * @param onView - Optional callback function when view action is triggered
 * @returns The JSX element representing the properties data table
 */
export function RealEstateTable({
  properties,
  onDelete,
}: RealEstateTableProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  /**
   * Handle Select All
   * Handles the select all checkbox functionality
   * Either selects all properties or clears all selections based on the checked state
   * @param checked - Boolean indicating whether to select all or clear selection
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(properties.map((property) => property.id));
    } else {
      setSelectedProperties([]);
    }
  };

  /**
   * Handle Select Property
   * Handles individual property selection/deselection
   * Adds or removes the property ID from the selected properties array
   * @param propertyId - The ID of the property to select/deselect
   * @param checked - Boolean indicating whether to select or deselect the property
   */
  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties((prev) => [...prev, propertyId]);
    } else {
      setSelectedProperties((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  /**
   * Handle Bulk Delete
   * Processes bulk deletion of selected properties
   * Calls the onDelete callback for each selected property and clears the selection
   */
  const handleBulkDelete = () => {
    selectedProperties.forEach((propertyId) => {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        onDelete?.(property);
      }
    });
    setSelectedProperties([]);
  };

  const isAllSelected =
    properties.length > 0 && selectedProperties.length === properties.length;

  const columns: ColumnDef<Property>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all properties"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedProperties.includes(row.original.id)}
          onCheckedChange={(checked) =>
            handleSelectProperty(row.original.id, checked as boolean)
          }
          aria-label={`Select property ${row.original.title}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const images = row.getValue("images") as string[];
        const propertyTitle = row.getValue("title") as string;

        return (
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 rounded-md overflow-hidden border">
              <ImageComponentOptimized
                src={images[0] || "/placeholder-property.jpg"}
                alt={propertyTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          </div>
        );
      },
    },
    createSortableColumn("title", "Property Title"),
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address") as string;
        const city = row.getValue("city") as string;
        const state = row.getValue("state") as string;
        return (
          <div className="text-sm">
            <div className="font-medium">{address}</div>
            <div className="text-muted-foreground">
              {city}, {state}
            </div>
          </div>
        );
      },
    },
    createSortableColumn("type", "Type"),
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <div className="font-medium">${price.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "bedrooms",
      header: "Beds",
      cell: ({ row }) => {
        const bedrooms = row.getValue("bedrooms") as number;
        return <div className="text-center">{bedrooms}</div>;
      },
    },
    {
      accessorKey: "bathrooms",
      header: "Baths",
      cell: ({ row }) => {
        const bathrooms = row.getValue("bathrooms") as number;
        return <div className="text-center">{bathrooms}</div>;
      },
    },
    {
      accessorKey: "sqft",
      header: "Sq Ft",
      cell: ({ row }) => {
        const sqft = row.getValue("sqft") as number;
        return <div className="text-center">{sqft.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Property["status"];
        return (
          <Badge
            variant={
              status === "available"
                ? "default"
                : status === "pending"
                ? "secondary"
                : status === "sold"
                ? "destructive"
                : "outline"
            }
          >
            {status.replace("-", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedDate",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedDate") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const property = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(property.id);
                  showToast({
                    title: `Copied ${property.id}`,
                    description: "Property ID copied to clipboard",
                    button: {
                      label: "Close",
                      onClick: () => console.log("Undo clicked"),
                    },
                  });
                }}
              >
                Copy property ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                shallow={true}
                href="/apps/real-estate/[id]"
                as={`/apps/real-estate/${property?.id}`}
                passHref
                style={{ textDecoration: "none" }}
                className="cursor-pointer"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
              </Link>

              <Link
                shallow={true}
                href="/apps/real-estate/[id]"
                as={`/apps/real-estate/${property?.id}?tab=edit`}
                passHref
                style={{ textDecoration: "none" }}
                className="cursor-pointer"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit property
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(property)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">
                  {selectedProperties.length} propert
                  {selectedProperties.length !== 1 ? "ies" : "y"} selected
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={properties}
        searchKey="title"
        searchPlaceholder="Search properties..."
      />
    </div>
  );
}
