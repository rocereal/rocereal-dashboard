"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { cryptoTableData, type CryptoTableData } from "@/data/crypto-prices";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";

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
];

export function CryptoTable() {
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={cryptoTableData}
        searchKey="name"
        searchPlaceholder="Filter cryptocurrencies..."
      />
    </div>
  );
}
