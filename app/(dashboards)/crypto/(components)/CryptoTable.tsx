"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BulkActions } from "@/components/tables/BulkActions";
import { cryptoTableData, type CryptoTableData } from "@/data/crypto-prices";
import { ColumnDef, Table } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { showToast } from "@/components/ui/sonner";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: value < 1 ? 4 : 0,
  }).format(value);
};

const formatLargeNumber = (value: number) => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

export const columns: ColumnDef<CryptoTableData>[] = [
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
  {
    accessorKey: "name",
    header: "Coin",
    cell: ({ row }) => {
      const coin = row.original;
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{coin.icon}</span>
          <div>
            <div className="font-medium">{coin.name}</div>
            <div className="text-sm text-muted-foreground">{coin.symbol}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatCurrency(row.getValue("price"))}
        </div>
      );
    },
  },
  {
    accessorKey: "change24h",
    header: "24h Change",
    cell: ({ row }) => {
      const change = row.getValue("change24h") as number;
      const isPositive = change >= 0;
      return (
        <div
          className={`flex items-center space-x-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "change7d",
    header: "7d Change",
    cell: ({ row }) => {
      const change = row.getValue("change7d") as number;
      const isPositive = change >= 0;
      return (
        <div
          className={`flex items-center space-x-1 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Market Cap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatLargeNumber(row.getValue("marketCap"))}
        </div>
      );
    },
  },
  {
    accessorKey: "volume24h",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume 24h
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatLargeNumber(row.getValue("volume24h"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const coin = row.original;

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
                navigator.clipboard.writeText(coin.id);
                showToast({
                  title: `Copied ${coin.id}`,
                  description: "Coin ID copied to clipboard",
                  button: {
                    label: "Close",
                    onClick: () => console.log("Undo clicked"),
                  },
                });
              }}
            >
              Copy coin name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View coin details</DropdownMenuItem>
            <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
            <DropdownMenuItem>View price history</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Remove from portfolio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function CryptoTable() {
  const bulkActions = (
    selectedRows: CryptoTableData[],
    table: Table<CryptoTableData>
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
        console.log("Exporting selected cryptocurrencies:", selectedRows);
      }}
      itemName="cryptocurrency"
    />
  );

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6">
        <DataTable
          columns={columns}
          data={cryptoTableData}
          searchKey="name"
          searchPlaceholder="Filter cryptocurrencies..."
          bulkActions={bulkActions}
        />
      </div>
    </div>
  );
}
