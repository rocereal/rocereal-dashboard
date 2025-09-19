"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { transactionsData, type TransactionData } from "@/data/finance";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(value));
};

const getStatusColor = (status: TransactionData["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

const getTypeColor = (type: TransactionData["type"]) => {
  switch (type) {
    case "income":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "expense":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

export const columns: ColumnDef<TransactionData>[] = [
  createSortableColumn("id", "Transaction ID"),
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
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px]">
          <div className="truncate" title={row.getValue("description")}>
            {row.getValue("description")}
          </div>
        </div>
      );
    },
  },
  createSortableColumn("category", "Category"),
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const isPositive = amount > 0;
      return (
        <div
          className={`font-medium flex items-center gap-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionData["type"];
      return (
        <Badge variant="outline" className={`capitalize ${getTypeColor(type)}`}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TransactionData["status"];
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
];

export function TransactionsTable() {
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={transactionsData}
        searchKey="description"
        searchPlaceholder="Search transactions..."
      />
    </div>
  );
}
