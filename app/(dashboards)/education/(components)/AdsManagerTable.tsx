"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronRight, Columns, Filter, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

type Level = "campaign" | "adset" | "ad";
type StatusFilter = "ALL" | "ACTIVE" | "PAUSED" | "ARCHIVED";

interface AdRow {
  entityId: string;
  entityName: string;
  campaignId: string | null;
  campaignName: string | null;
  adsetId: string | null;
  adsetName: string | null;
  status: string | null;
  objective: string | null;
  budget: number | null;
  budgetType: string | null;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  purchaseRoas: number | null;
  costPerResult: number;
  frequency: number;
}

interface DrillState {
  campaignIds:  string[];
  campaignName: string | null;
  adsetIds:     string[];
  adsetName:    string | null;
}

const EMPTY_DRILL: DrillState = { campaignIds: [], campaignName: null, adsetIds: [], adsetName: null };

const formatRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", minimumFractionDigits: 2 }).format(v);

const formatNum = (v: number) =>
  new Intl.NumberFormat("ro-RO").format(Math.round(v));

const StatusBadge = ({ status }: { status: string | null }) => {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const color =
    status === "ACTIVE"   ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300" :
    status === "PAUSED"   ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300" :
    status === "ARCHIVED" ? "bg-gray-50 text-gray-500 border-gray-200" :
                            "bg-gray-50 text-gray-500 border-gray-200";
  return <Badge variant="outline" className={color}>{status}</Badge>;
};

function buildColumns(level: Level, onDrillDown: (row: AdRow) => void): ColumnDef<AdRow>[] {
  const nameHeader = level === "campaign" ? "Campanie" : level === "adset" ? "Ad Set" : "Ad";
  const canDrill   = level !== "ad";

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: "entityName",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {nameHeader} <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 group">
          {canDrill ? (
            <button
              className="font-medium max-w-[260px] truncate text-left hover:text-blue-600 hover:underline transition-colors"
              title={`Mergi la ${level === "campaign" ? "Ad Sets" : "Ads"} pentru: ${row.getValue("entityName")}`}
              onClick={() => onDrillDown(row.original)}
            >
              {row.getValue("entityName")}
            </button>
          ) : (
            <span className="font-medium max-w-[260px] truncate" title={row.getValue("entityName")}>
              {row.getValue("entityName")}
            </span>
          )}
          {canDrill && (
            <ChevronRight
              className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
              onClick={() => onDrillDown(row.original)}
            />
          )}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "conversions",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Results <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span>{formatNum(row.getValue("conversions"))}</span>,
    },
    {
      accessorKey: "costPerResult",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cost/Result <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const v = row.getValue("costPerResult") as number;
        return <span>{v > 0 ? formatRON(v) : "—"}</span>;
      },
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const budget = row.original.budget;
        const type   = row.original.budgetType;
        if (!budget) return <span className="text-muted-foreground">—</span>;
        return (
          <span>
            {formatRON(budget)}
            <span className="text-muted-foreground text-xs ml-1">{type === "daily" ? "/zi" : "/total"}</span>
          </span>
        );
      },
    },
    {
      accessorKey: "spend",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Cheltuit <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{formatRON(row.getValue("spend"))}</span>,
    },
    {
      accessorKey: "purchaseRoas",
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ROAS <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const v = row.getValue("purchaseRoas") as number | null;
        return v
          ? <span className="font-medium text-green-600">{v.toFixed(2)}x</span>
          : <span className="text-muted-foreground">—</span>;
      },
    },
    // Extra columns hidden by default
    { accessorKey: "impressions", header: "Impresii",  cell: ({ row }) => formatNum(row.getValue("impressions")) },
    { accessorKey: "clicks",      header: "Clicuri",   cell: ({ row }) => formatNum(row.getValue("clicks")) },
    { accessorKey: "reach",       header: "Reach",     cell: ({ row }) => formatNum(row.getValue("reach")) },
    { accessorKey: "ctr",         header: "CTR",       cell: ({ row }) => `${(row.getValue("ctr") as number).toFixed(2)}%` },
    { accessorKey: "cpc",         header: "CPC",       cell: ({ row }) => formatRON(row.getValue("cpc")) },
    { accessorKey: "cpm",         header: "CPM",       cell: ({ row }) => formatRON(row.getValue("cpm")) },
    { accessorKey: "frequency",   header: "Frecvență", cell: ({ row }) => (row.getValue("frequency") as number).toFixed(2) },
    { accessorKey: "objective",   header: "Obiectiv",  cell: ({ row }) => (row.getValue("objective") as string | null) ?? "—" },
  ];
}

const HIDDEN_BY_DEFAULT: VisibilityState = {
  impressions: false, clicks: false, reach: false,
  ctr: false, cpc: false, cpm: false, frequency: false, objective: false,
};

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "Toate",    value: "ALL"      },
  { label: "Active",   value: "ACTIVE"   },
  { label: "Pauzate",  value: "PAUSED"   },
  { label: "Arhivate", value: "ARCHIVED" },
];

interface AdsManagerTableProps {
  dateRange?: DateTimeRange;
}

export function AdsManagerTable({ dateRange }: AdsManagerTableProps) {
  const [level, setLevel]           = useState<Level>("campaign");
  const [drill, setDrill]           = useState<DrillState>(EMPTY_DRILL);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [data, setData]             = useState<AdRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [syncing, setSyncing]       = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sorting, setSorting]       = useState<SortingState>([{ id: "spend", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(HIDDEN_BY_DEFAULT);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const buildParams = (lvl: Level, dr: DrillState) => {
    const params = new URLSearchParams({ level: lvl });
    if (dateRange?.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to)   params.set("to",   format(dateRange.to,   "yyyy-MM-dd"));
    if (lvl === "adset" && dr.campaignIds.length) params.set("campaignIds", dr.campaignIds.join(","));
    if (lvl === "ad"    && dr.adsetIds.length)    params.set("adsetIds",    dr.adsetIds.join(","));
    return params;
  };

  const fetchData = async (lvl = level, dr = drill) => {
    const res = await fetch(`/api/education/facebook-ads?${buildParams(lvl, dr)}`);
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  };

  const runSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/education/facebook-ads/sync", { method: "POST" });
      const fresh = await fetchData();
      setData(fresh);
      setLastSynced(new Date());
    } catch { /* silently fail */ }
    finally { setSyncing(false); }
  };

  useEffect(() => {
    setLoading(true);
    fetchData()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));

    syncTimeout.current = setTimeout(() => { runSync(); }, 800);
    return () => { if (syncTimeout.current) clearTimeout(syncTimeout.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, drill, dateRange]);

  // Click on name → drill into children
  const handleDrillDown = (row: AdRow) => {
    if (level === "campaign") {
      setDrill({ campaignIds: [row.entityId], campaignName: row.entityName, adsetIds: [], adsetName: null });
      setLevel("adset");
    } else if (level === "adset") {
      setDrill((d) => ({ ...d, adsetIds: [row.entityId], adsetName: row.entityName }));
      setLevel("ad");
    }
    setRowSelection({});
  };

  // Button "View Ad Sets" from selected checkboxes
  const handleDrillSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
    if (!selectedRows.length) return;
    if (level === "campaign") {
      const ids   = selectedRows.map((r) => r.entityId);
      const names = selectedRows.map((r) => r.entityName);
      setDrill({ campaignIds: ids, campaignName: names.length === 1 ? names[0] : `${names.length} campanii`, adsetIds: [], adsetName: null });
      setLevel("adset");
    } else if (level === "adset") {
      const ids   = selectedRows.map((r) => r.entityId);
      const names = selectedRows.map((r) => r.entityName);
      setDrill((d) => ({ ...d, adsetIds: ids, adsetName: names.length === 1 ? names[0] : `${names.length} ad sets` }));
      setLevel("ad");
    }
    setRowSelection({});
  };

  const handleTabChange = (newLevel: Level) => {
    if (newLevel === "campaign") setDrill(EMPTY_DRILL);
    else if (newLevel === "adset") setDrill((d) => ({ ...d, adsetIds: [], adsetName: null }));
    setLevel(newLevel);
    setRowSelection({});
  };

  // Apply status filter client-side
  const filteredData = statusFilter === "ALL"
    ? data
    : data.filter((r) => r.status === statusFilter);

  const columns = buildColumns(level, handleDrillDown);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  const TABS: { label: string; value: Level }[] = [
    { label: "Campanii", value: "campaign" },
    { label: "Ad Sets",  value: "adset"    },
    { label: "Ads",      value: "ad"       },
  ];

  const allTogglable = table.getAllColumns().filter((c) => c.getCanHide());
  const rowLabel = level === "campaign" ? "campanii" : level === "adset" ? "ad sets" : "ads";
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Sync status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
          {syncing
            ? "Sincronizare cu Facebook Ads..."
            : lastSynced
            ? `Sincronizat la ${lastSynced.toLocaleTimeString("ro-RO")}`
            : "Facebook Ads"}
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={runSync} disabled={syncing}>
          Refresh
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: tabs + drill button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-md p-1">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTabChange(t.value)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  level === t.value
                    ? "bg-background shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Drill into selected button */}
          {selectedCount > 0 && level !== "ad" && (
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={handleDrillSelected}>
              <ChevronRight className="h-3 w-3" />
              {level === "campaign" ? "Ad Sets" : "Ads"} ({selectedCount})
            </Button>
          )}
        </div>

        {/* Right: status filter + columns */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-4 w-4" />
                {statusFilter === "ALL" ? "Status" : STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel>Filtrează status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map((o) => (
                <DropdownMenuItem
                  key={o.value}
                  onClick={() => { setStatusFilter(o.value); setRowSelection({}); }}
                  className={statusFilter === o.value ? "font-medium bg-accent" : ""}
                >
                  {o.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Columns className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Coloane vizibile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allTogglable.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(v)}
                >
                  {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Breadcrumb */}
      {(drill.campaignName || drill.adsetName) && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          <button className="hover:text-foreground transition-colors" onClick={() => handleTabChange("campaign")}>
            Toate campaniile
          </button>
          {drill.campaignName && (
            <>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              {drill.adsetName ? (
                <button
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                  onClick={() => handleTabChange("adset")}
                  title={drill.campaignName}
                >
                  {drill.campaignName}
                </button>
              ) : (
                <span className="font-medium text-foreground truncate max-w-[200px]">{drill.campaignName}</span>
              )}
            </>
          )}
          {drill.adsetName && (
            <>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium text-foreground truncate max-w-[200px]">{drill.adsetName}</span>
            </>
          )}
        </div>
      )}

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
                  <span className="text-sm text-muted-foreground">Se încarcă datele din Facebook Ads...</span>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-sm">
                  {level === "campaign"
                    ? "Nicio campanie găsită. Rulează sync-ul din GitHub Actions."
                    : `Niciun ${level === "adset" ? "ad set" : "ad"} găsit.`}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
        <span>{table.getFilteredRowModel().rows.length} {rowLabel}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Înapoi</Button>
          <span>Pagina {table.getState().pagination.pageIndex + 1} din {table.getPageCount()}</span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Înainte</Button>
        </div>
      </div>
    </div>
  );
}
