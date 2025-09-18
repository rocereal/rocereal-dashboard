"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import {
  businessCustomers,
  type BusinessCustomer,
} from "@/data/business-customers";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

export const businessColumns: ColumnDef<BusinessCustomer>[] = [
  createSortableColumn("userOrg", "Customer"),
  {
    accessorKey: "planType",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("planType") as string;
      return (
        <Badge
          variant={
            plan === "Enterprise"
              ? "default"
              : plan === "Pro"
              ? "secondary"
              : "outline"
          }
        >
          {plan}
        </Badge>
      );
    },
  },
  {
    accessorKey: "tokensUsed",
    header: "Tokens",
    cell: ({ row }) => {
      const tokens = row.getValue("tokensUsed") as number;
      return (tokens / 1000000).toFixed(1) + "M";
    },
  },
  {
    accessorKey: "costIncurred",
    header: "Cost",
    cell: ({ row }) => {
      const cost = row.getValue("costIncurred") as number;
      return `$${cost.toFixed(0)}`;
    },
  },
  {
    accessorKey: "requestsMade",
    header: "Requests",
    cell: ({ row }) => {
      const requests = row.getValue("requestsMade") as number;
      return (requests / 1000).toFixed(0) + "K";
    },
  },
  {
    accessorKey: "subscriptionStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("subscriptionStatus") as string;
      return (
        <Badge
          variant={
            status === "Active"
              ? "default"
              : status === "Cancelled"
              ? "destructive"
              : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalRevenueContribution",
    header: "Revenue",
    cell: ({ row }) => {
      const revenue = row.getValue("totalRevenueContribution") as number;
      return `$${(revenue / 1000).toFixed(0)}K`;
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
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer details</DropdownMenuItem>
            <DropdownMenuItem>Edit subscription</DropdownMenuItem>
            <DropdownMenuItem>View usage history</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Suspend account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BusinessCustomersTable() {
  return (
    <div className="w-full">
      <DataTable
        columns={businessColumns}
        data={businessCustomers}
        searchKey="userOrg"
        searchPlaceholder="Filter customers..."
      />
    </div>
  );
}
