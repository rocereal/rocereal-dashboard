"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { CRMCustomer } from "@/data/crm-customers";
import { format } from "date-fns";

interface CRMCustomerTableProps {
  data: CRMCustomer[];
}

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
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="customerName"
      searchPlaceholder="Search customers..."
    />
  );
}
