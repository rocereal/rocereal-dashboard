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
import { ColumnDef, Table } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, RefreshCw, TrendingUp } from "lucide-react";
import { showToast } from "@/components/ui/sonner";
import { useEffect, useRef, useState } from "react";

interface SmartbillInvoice {
  id: string;
  issueDate: string | null;
  totalAmount: number;
  netAmount: number;
  taxAmount: number;
  currency: string;
  status: string;
  series: string;
  number: number;
}

const formatRON = (value: number) =>
  new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
  }).format(Math.abs(value));

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "incasata":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "emisa":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "partial":
      return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
    case "anulata":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

const columns: ColumnDef<SmartbillInvoice>[] = [
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
    accessorKey: "issueDate",
    header: "Date / Time",
    cell: ({ row }) => {
      const raw = row.getValue("issueDate") as string | null;
      if (!raw) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="text-sm">
          {new Date(raw).toLocaleDateString("ro-RO")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-1 text-green-600">
        <TrendingUp className="h-4 w-4" />
        {formatRON(row.getValue("totalAmount") as number)}
      </div>
    ),
  },
  {
    accessorKey: "netAmount",
    header: "Currency",
    cell: ({ row }) => (
      <span className="font-medium">{formatRON(row.getValue("netAmount") as number)}</span>
    ),
  },
  {
    accessorKey: "taxAmount",
    header: "Category",
    cell: ({ row }) => (
      <span className="font-medium text-muted-foreground">
        {formatRON(row.getValue("taxAmount") as number)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Type",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actiuni</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(invoice.id);
                showToast({
                  title: `Copiat ${invoice.id}`,
                  description: "Numarul facturii a fost copiat",
                  button: { label: "Inchide", onClick: () => {} },
                });
              }}
            >
              Copiaza numarul facturii
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Vezi detalii
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

async function fetchInvoices(): Promise<SmartbillInvoice[]> {
  const res = await fetch("/api/finance/invoices");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function TransactionsTable() {
  const [data, setData] = useState<SmartbillInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/finance/invoices/sync");
      const fresh = await fetchInvoices();
      setData(fresh);
      setLastSynced(new Date());
    } catch {
      // silently fail — data already shown from initial load
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // 1. Load current DB data immediately
    fetchInvoices()
      .then((invoices) => {
        setData(invoices);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. Trigger background sync — picks up any new invoices from SmartBill
    syncTimeout.current = setTimeout(() => {
      runSync();
    }, 500); // slight delay so the table renders first

    return () => {
      if (syncTimeout.current) clearTimeout(syncTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bulkActions = (
    selectedRows: SmartbillInvoice[],
    table: Table<SmartbillInvoice>
  ) => (
    <BulkActions
      selectedItems={selectedRows}
      isAllSelected={table.getIsAllPageRowsSelected()}
      onSelectAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      onBulkDelete={() => table.setRowSelection({})}
      onExport={() => console.log("Export:", selectedRows)}
      itemName="factura"
    />
  );

  return (
    <div className="bg-card rounded-lg border">
      {/* Sync status bar */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
          {syncing
            ? "Sincronizare cu SmartBill..."
            : lastSynced
            ? `Sincronizat la ${lastSynced.toLocaleTimeString("ro-RO")}`
            : "SmartBill"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={runSync}
          disabled={syncing}
        >
          Refresh
        </Button>
      </div>

      <div className="px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Se incarca facturile...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            searchKey="id"
            searchPlaceholder="Cauta dupa numarul facturii..."
            bulkActions={bulkActions}
          />
        )}
      </div>
    </div>
  );
}
