"use client";

import { ColumnDef, Table } from "@tanstack/react-table";
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
import { BulkActions } from "@/components/tables/BulkActions";
import { CRMCustomer } from "@/data/crm-customers";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { showToast } from "@/components/ui/sonner";

interface CRMCustomerTableProps {
  data: CRMCustomer[];
}

/**
 * CRM Customer Table Component
 * This component renders a data table displaying CRM customer information
 * It includes columns for customer details, plan tier, contact dates, lifetime value, and status
 * Provides bulk actions for managing selected customers and search functionality
 * @param data - Array of CRM customer objects to display
 * @returns The JSX element representing the CRM customer table
 */
export function CRMCustomerTable({ data }: CRMCustomerTableProps) {
  const columns: ColumnDef<CRMCustomer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    createSortableColumn("customerName", "Customer Name"),
    createSortableColumn("accountManager", "Account Manager"),
    {
      accessorKey: "planTier",
      header: "Plan/Tier",
      cell: ({ row }) => {
        const planTier = row.getValue("planTier") as string;
        const variant =
          planTier === "Enterprise"
            ? "default"
            : planTier === "Professional"
            ? "secondary"
            : "outline";

        return (
          <Badge variant={variant} className="capitalize">
            {planTier}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastContact",
      header: "Last Contact",
      cell: ({ row }) => {
        const date = row.getValue("lastContact") as string;
        return format(new Date(date), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "nextFollowUp",
      header: "Next Follow-Up",
      cell: ({ row }) => {
        const date = row.getValue("nextFollowUp") as string;
        return format(new Date(date), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "lifetimeValue",
      header: "Lifetime Value",
      cell: ({ row }) => {
        const value = row.getValue("lifetimeValue") as number;
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as CRMCustomer["status"];
        const variant =
          status === "Active"
            ? "default" // Blue for active
            : status === "Prospect"
            ? "secondary" // Neutral/gray for prospect
            : status === "Inactive"
            ? "destructive" // Red for inactive
            : "outline"; // Outline for churned

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;

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
                  navigator.clipboard.writeText(customer.id);
                  showToast({
                    title: `Copied ${customer.id}`,
                    description: "Customer ID copied to clipboard",
                    button: {
                      label: "Close",
                      onClick: () => console.log("Undo clicked"),
                    },
                  });
                }}
              >
                Copy customer name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer details</DropdownMenuItem>
              <DropdownMenuItem>Edit customer</DropdownMenuItem>
              <DropdownMenuItem>Schedule follow-up</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  /**
   * Bulk Actions Handler
   * This function handles bulk operations for selected CRM customers
   * It provides functionality for selecting all, deleting, and exporting selected items
   * @param selectedRows - Array of selected CRM customer objects
   * @param table - The table instance from TanStack Table
   * @returns The JSX element for bulk actions component
   */
  const bulkActions = (
    selectedRows: CRMCustomer[],
    table: Table<CRMCustomer>
  ) => (
    <BulkActions
      selectedItems={selectedRows}
      isAllSelected={table.getIsAllPageRowsSelected()}
      onSelectAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      onBulkDelete={() => {
        // For now, just clear selection. In a real app, you'd delete the selected items.
        table.setRowSelection({});
      }}
      onExport={() => {
        // Placeholder for export functionality
        console.log("Exporting selected CRM customers:", selectedRows);
      }}
      itemName="customer"
    />
  );

  return (
    // Table container
    <div className="bg-card rounded-lg border">
      {/* Table content wrapper */}
      <div className="p-6">
        <DataTable
          columns={columns}
          data={data}
          searchKey="customerName"
          searchPlaceholder="Search customers..."
          bulkActions={bulkActions}
        />
      </div>
    </div>
  );
}
