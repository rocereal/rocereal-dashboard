"use client";

import { useEffect, useState } from "react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { showToast } from "@/components/ui/sonner";

interface CrmCall {
  id: string;
  invoxId: string;
  caller: string;
  account: string | null;
  date: string;
  duration: string | null;
  status: string | null;
  source: string | null;
  campaign: string | null;
  utmSource: string | null;
  medium: string | null;
  receivingNumber: string | null;
  rawPayload: Record<string, unknown> | null;
}

export function CRMCustomerTable() {
  const [data, setData] = useState<CrmCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/calls")
      .then((r) => r.json())
      .then((calls) => {
        setData(calls);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<CrmCall>[] = [
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
      id: "customerName",
      header: "Nume Client",
      cell: () => "Lead",
    },
    {
      accessorKey: "account",
      header: "Agent asignat",
      cell: ({ row }) => row.getValue("account") as string ?? "-",
    },
    {
      id: "planTier",
      header: "Status",
      cell: () => (
        <Badge variant="outline">Prospect</Badge>
      ),
    },
    {
      accessorKey: "date",
      header: "Inregistrat in",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        try {
          return format(new Date(date), "dd MMM yyyy");
        } catch {
          return date;
        }
      },
    },
    {
      accessorKey: "caller",
      header: "Telefon",
    },
    {
      accessorKey: "duration",
      header: "Durata apel",
      cell: ({ row }) => {
        const duration = row.getValue("duration") as string | null;
        return duration ? `${duration}s` : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Stadiu",
      cell: ({ row }) => {
        const status = row.getValue("status") as string | null;
        if (!status) return "-";
        const variant =
          status === "answered" ? "default"
          : status === "missed" ? "destructive"
          : "secondary";
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "callStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (!status) return "-";
        const variant =
          status === "answered" ? "default"
          : status === "missed" ? "destructive"
          : "secondary";
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Canal",
      cell: ({ row }) => (row.getValue("source") as string | null) ?? "-",
    },
    {
      accessorKey: "utmSource",
      header: "utm_source",
      cell: ({ row }) => {
        const val = row.getValue("utmSource") as string | null;
        const raw = row.original.rawPayload;
        return val ?? (raw?.utm_source as string) ?? "-";
      },
    },
    {
      accessorKey: "medium",
      header: "utm_medium",
      cell: ({ row }) => {
        const val = row.getValue("medium") as string | null;
        const raw = row.original.rawPayload;
        return val ?? (raw?.utm_medium as string) ?? "-";
      },
    },
    {
      accessorKey: "campaign",
      header: "utm_campaign",
      cell: ({ row }) => (row.getValue("campaign") as string | null) ?? "-",
    },
    {
      id: "utmTerm",
      header: "utm_term",
      cell: ({ row }) => {
        const raw = row.original.rawPayload;
        return (raw?.utm_term as string) ?? "-";
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const call = row.original;
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
                  navigator.clipboard.writeText(call.caller);
                  showToast({
                    title: `Copied ${call.caller}`,
                    description: "Phone number copied to clipboard",
                    button: {
                      label: "Close",
                      onClick: () => {},
                    },
                  });
                }}
              >
                Copy phone number
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View call details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const bulkActions = (selectedRows: CrmCall[], table: Table<CrmCall>) => (
    <BulkActions
      selectedItems={selectedRows}
      isAllSelected={table.getIsAllPageRowsSelected()}
      onSelectAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      onBulkDelete={() => table.setRowSelection({})}
      onExport={() => console.log("Exporting:", selectedRows)}
      itemName="call"
    />
  );

  if (loading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <p className="text-muted-foreground">Loading calls...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6">
        <DataTable
          columns={columns}
          data={data}
          searchKey="caller"
          searchPlaceholder="Search by phone..."
          bulkActions={bulkActions}
        />
      </div>
    </div>
  );
}
