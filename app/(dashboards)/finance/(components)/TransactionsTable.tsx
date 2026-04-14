"use client";

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
import { transactionsData, type TransactionData } from "@/data/finance";
import { ColumnDef, Table } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Download,
  Eye,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { showToast } from "@/components/ui/sonner";

/**
 * Format Currency Function
 * Formats a numerical value into a USD currency string
 * Uses absolute value to ensure positive display
 * @param value - The numerical value to format as currency
 * @returns The formatted currency string in USD
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(value));
};

/**
 * Get Status Color Function
 * Returns appropriate CSS classes for status badges based on transaction status
 * @param status - The status of the transaction
 * @returns CSS class string for the status badge styling
 */
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

/**
 * Get Type Color Function
 * Returns appropriate CSS classes for type badges based on transaction type
 * @param type - The type of the transaction
 * @returns CSS class string for the type badge styling
 */
const getTypeColor = (type: TransactionData["type"]) => {
  switch (type) {
    case "credit":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "debit":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    case "transfer":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "refund":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

/**
 * Get Method Color Function
 * Returns appropriate CSS classes for method badges based on transaction method
 * @param method - The method of the transaction
 * @returns CSS class string for the method badge styling
 */
const getMethodColor = (method: TransactionData["method"]) => {
  switch (method) {
    case "card":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "bank_transfer":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "mobile_money":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    case "cash":
      return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

export const columns: ColumnDef<TransactionData>[] = [
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
  createSortableColumn("id", "Transaction ID"),
  {
    accessorKey: "date",
    header: "Date / Time",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const time = row.original.time;
      return (
        <div className="text-sm">
          <div>{new Date(date).toLocaleDateString()}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
      );
    },
  },
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
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("currency")}</span>;
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
  createSortableColumn("category", "Category"),
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as TransactionData["method"];
      return (
        <Badge
          variant="outline"
          className={`capitalize ${getMethodColor(method)}`}
        >
          {method.replace("_", " ")}
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;

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
                navigator.clipboard.writeText(transaction.id);
                showToast({
                  title: `Copied ${transaction.id}`,
                  description: "Transaction ID copied to clipboard",
                  button: {
                    label: "Close",
                    onClick: () => console.log("Undo clicked"),
                  },
                });
              }}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download receipt
            </DropdownMenuItem>
            <DropdownMenuItem>Report issue</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Cancel transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * Transactions Table Component
 * Displays a comprehensive table of financial transactions with sorting, filtering, and bulk actions
 * Includes columns for transaction details, amounts, types, methods, status, and actions
 * Provides functionality for selecting, viewing, and managing transaction records
 * @returns The JSX element representing the transactions data table
 */
export function TransactionsTable() {
  const bulkActions = (
    selectedRows: TransactionData[],
    table: Table<TransactionData>
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
        console.log("Exporting selected transactions:", selectedRows);
      }}
      itemName="transaction"
    />
  );

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6">
        <DataTable
          columns={columns}
          data={transactionsData}
          searchKey="id"
          searchPlaceholder="Search transactions..."
          bulkActions={bulkActions}
        />
      </div>
    </div>
  );
}
