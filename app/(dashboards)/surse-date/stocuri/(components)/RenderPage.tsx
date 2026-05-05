"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Package, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StockItem {
  id:           string;
  name:         string;
  sku:          string | null;
  category:     string | null;
  quantity:     number;
  unitPrice:    number;
  totalValue:   number;
  unit:         string | null;
  status:       string;
  lastSyncedAt: string;
}

interface StockResponse { items: StockItem[]; syncedAt: string | null; total: number }

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  in_stock:     { label: "În stoc",    cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     icon: <CheckCircle className="h-3 w-3" /> },
  low_stock:    { label: "Stoc redus", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <AlertTriangle className="h-3 w-3" /> },
  out_of_stock: { label: "Epuizat",    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",             icon: <XCircle className="h-3 w-3" /> },
};

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(v);

// ── Inline price cell ──────────────────────────────────────────────────────────
function PriceCell({ item, onSaved }: { item: StockItem; onSaved: (id: string, unitPrice: number, totalValue: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState("");
  const [saving, setSaving]   = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setValue(item.unitPrice > 0 ? String(item.unitPrice) : "");
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const save = async () => {
    const parsed = parseFloat(value.replace(",", "."));
    if (isNaN(parsed) || parsed < 0) { setEditing(false); return; }
    setSaving(true);
    const res = await fetch(`/api/stock/${item.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ unitPrice: parsed }),
    });
    if (res.ok) {
      const json = await res.json() as { unitPrice: number; totalValue: number };
      onSaved(item.id, json.unitPrice, json.totalValue);
    }
    setSaving(false);
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter")  save();
    if (e.key === "Escape") setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        className="border rounded px-2 py-0.5 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-primary"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        disabled={saving}
        placeholder="Ex: 15000"
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      className={`text-left hover:underline decoration-dashed underline-offset-2 ${item.unitPrice > 0 ? "" : "text-muted-foreground"}`}
      title="Click pentru a edita prețul"
    >
      {item.unitPrice > 0 ? fmtRON(item.unitPrice) : "—"}
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function RenderPage() {
  const [data, setData]       = useState<StockResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter]   = useState("");

  const load = async (triggerSyncIfEmpty = false) => {
    setLoading(true);
    const res  = await fetch("/api/stock", { cache: "no-store" });
    const json = await res.json() as StockResponse;
    setData(json);
    setLoading(false);

    if (triggerSyncIfEmpty && json.total === 0) {
      setSyncing(true);
      await fetch("/api/stock/sync", { method: "POST" });
      setSyncing(false);
      const res2  = await fetch("/api/stock", { cache: "no-store" });
      const json2 = await res2.json() as StockResponse;
      setData(json2);
    }
  };

  const handlePriceSaved = (id: string, unitPrice: number, totalValue: number) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(i => i.id === id ? { ...i, unitPrice, totalValue } : i),
      };
    });
  };

  useEffect(() => { load(true); }, []);

  const items = (data?.items ?? []).filter(i =>
    !filter || i.name.toLowerCase().includes(filter.toLowerCase()) || (i.sku ?? "").toLowerCase().includes(filter.toLowerCase())
  );

  const inStock    = (data?.items ?? []).filter(i => i.status === "in_stock").length;
  const lowStock   = (data?.items ?? []).filter(i => i.status === "low_stock").length;
  const outOfStock = (data?.items ?? []).filter(i => i.status === "out_of_stock").length;
  const totalValue = (data?.items ?? []).reduce((s, i) => s + i.totalValue, 0);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Stocuri de Produse"
        subtitle="GESTIUNE PARC SIBIU-VESTEM — sincronizat automat zilnic din SmartBill"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Surse de date" },
          { label: "Stocuri de produse" },
        ]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total produse", value: String(data?.total ?? 0),   icon: <Package className="h-4 w-4 text-muted-foreground" /> },
          { label: "În stoc",       value: String(inStock),            icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
          { label: "Stoc redus",    value: String(lowStock),           icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> },
          { label: "Epuizat",       value: String(outOfStock),         icon: <XCircle className="h-4 w-4 text-red-500" /> },
        ].map(m => (
          <Card key={m.label} className="shadow-xs">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-1">{m.icon}<span className="text-xs text-muted-foreground">{m.label}</span></div>
              <p className="text-2xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Stoc la zi</CardTitle>
              <CardDescription className="text-xs">
                {syncing
                  ? "Se sincronizează cu SmartBill..."
                  : data?.syncedAt
                    ? `Ultimul sync: ${new Date(data.syncedAt).toLocaleString("ro-RO")}${totalValue > 0 ? ` · Valoare totală: ${fmtRON(totalValue)}` : " · Click pe preț pentru a-l edita"}`
                    : "Sincronizare automată zilnică la 06:00 · Click pe preț pentru a-l edita"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-3 py-1.5 text-sm w-48"
                placeholder="Caută produs / SKU..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <button onClick={() => load()} className="flex items-center gap-1 border rounded px-3 py-1.5 text-sm hover:bg-muted">
                <RefreshCw className={`h-3.5 w-3.5 ${loading || syncing ? "animate-spin" : ""}`} /> Reîncarcă
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading || syncing ? (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
              {syncing ? "Se sincronizează stocurile din SmartBill..." : "Se încarcă stocurile..."}
            </div>
          ) : items.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <Package className="h-8 w-8 opacity-30" />
              {filter ? "Niciun produs găsit." : "Niciun produs disponibil. Sincronizare automată zilnică la 06:00."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {["Produs", "SKU", "Categorie", "Cantitate", "Preț unitar", "Valoare stoc", "Status"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const st = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.in_stock;
                    return (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium max-w-[220px]">
                          <p className="truncate" title={item.name}>{item.name}</p>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{item.sku ?? "—"}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{item.category ?? "—"}</td>
                        <td className="px-4 py-2.5 font-semibold">{fmtNum(item.quantity)} {item.unit ?? ""}</td>
                        <td className="px-4 py-2.5">
                          <PriceCell item={item} onSaved={handlePriceSaved} />
                        </td>
                        <td className="px-4 py-2.5 font-medium">{item.totalValue > 0 ? fmtRON(item.totalValue) : "—"}</td>
                        <td className="px-4 py-2.5">
                          <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded w-fit ${st.cls}`}>
                            {st.icon}{st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
