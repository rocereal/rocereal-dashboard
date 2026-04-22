"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Loader2, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Client {
  phone: string;
  name: string;
  agent: string;
  status: string;
  firstSeen: string;
  email: string;
  channel: string;
  totalValue: number;
  callCount: number;
}

const formatRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", minimumFractionDigits: 2 }).format(v);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nume client <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name") || <span className="text-muted-foreground italic">Necunoscut</span>}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Telefon",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "agent",
    header: "Agent asignat",
    cell: ({ row }) => <span>{row.getValue("agent")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={
          s === "Calificat"
            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
            : "bg-gray-50 text-gray-500 border-gray-200"
        }>
          {s}
        </Badge>
      );
    },
  },
  {
    accessorKey: "firstSeen",
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Înregistrat în <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{formatDate(row.getValue("firstSeen"))}</span>,
    sortingFn: "datetime",
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return email
        ? <a href={`mailto:${email}`} className="text-blue-600 hover:underline text-sm">{email}</a>
        : <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "channel",
    header: "Canal",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
        {row.getValue("channel")}
      </Badge>
    ),
  },
  {
    accessorKey: "totalValue",
    header: ({ column }) => (
      <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Valoare client <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("totalValue") as number;
      return v > 0
        ? <span className="font-medium text-green-600">{formatRON(v)}</span>
        : <span className="text-muted-foreground">—</span>;
    },
  },
];

export function ClientsTable() {
  const router = useRouter();
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/clients", { cache: "no-store" });
      const d = await res.json();
      setData(Array.isArray(d) ? d : []);
      setLastFetched(new Date());
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    const q = globalFilter.toLowerCase();
    return data.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.agent.toLowerCase().includes(q)
    );
  }, [data, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="space-y-3">
      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {loading
            ? "Se încarcă clienții..."
            : lastFetched
            ? `Actualizat la ${lastFetched.toLocaleTimeString("ro-RO")}`
            : ""}
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Caută după nume, telefon, email, agent..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Se încarcă clienții...</span>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground text-sm">
                  Niciun client găsit.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={() => router.push(`/crm/client/${encodeURIComponent(row.original.phone)}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredData.length} clienți unici</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Înapoi</Button>
          <span>Pagina {table.getState().pagination.pageIndex + 1} din {table.getPageCount()}</span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Înainte</Button>
        </div>
      </div>
    </div>
  );
}
