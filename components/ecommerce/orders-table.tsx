"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { ordersData, type OrderData } from "@/data/ecommerce";
import { ArrowUpDown } from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const getStatusColor = (status: OrderData["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
    case "processing":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "shipped":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    case "delivered":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

export const columns: ColumnDef<OrderData>[] = [
  createSortableColumn("id", "Order ID"),
  createSortableColumn("customer", "Customer"),
  {
    accessorKey: "products",
    header: "Product(s)",
    cell: ({ row }) => {
      const products = row.getValue("products") as string[];
      return (
        <div className="max-w-[200px]">
          <div className="truncate" title={products.join(", ")}>
            {products.join(", ")}
          </div>
          {products.length > 1 && (
            <div className="text-xs text-muted-foreground">
              +{products.length - 1} more
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderValue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatCurrency(row.getValue("orderValue"))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderData["status"];
      return (
        <Badge
          variant="outline"
          className={`capitalize ${getStatusColor(status)}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString();
    },
  },
];

export function OrdersTable() {
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={ordersData}
        searchKey="customer"
        searchPlaceholder="Filter orders..."
      />
    </div>
  );
}
