"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Package, RefreshCw, Upload, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StockItem {
  id:          string;
  name:        string;
  sku:         string | null;
  category:    string | null;
  quantity:    number;
  unitPrice:   number;
  totalValue:  number;
  unit:        string | null;
  status:      string;
  lastSyncedAt: string;
}

interface StockResponse { items: StockItem[]; syncedAt: string | null; total: number }

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  in_stock:     { label: "În stoc",    cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  icon: <CheckCircle className="h-3 w-3" /> },
  low_stock:    { label: "Stoc redus", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <AlertTriangle className="h-3 w-3" /> },
  out_of_stock: { label: "Epuizat",   cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",          icon: <XCircle className="h-3 w-3" /> },
};

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(v);

export default function RenderPage() {
  const [data, setData]           = useState<StockResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [filter, setFilter]       = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/stock", { cache: "no-store" })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    const form = new FormData();
    form.append("file", file);
    form.append("warehouse", "GESTIUNE PARC SIBIU- VESTEM");
    const res = await fetch("/api/stock/import", { method: "POST", body: form });
    const json = await res.json() as { ok?: boolean; error?: string; created?: number; updated?: number; total?: number };
    if (json.ok) {
      setUploadMsg({ ok: true, text: `Import reușit: ${json.created} adăugate, ${json.updated} actualizate (${json.total} total)` });
      load();
    } else {
      setUploadMsg({ ok: false, text: json.error ?? "Eroare import" });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

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
        subtitle="GESTIUNE PARC SIBIU-VESTEM — stoc la zi sincronizat din SmartBill"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Surse de date" },
          { label: "Stocuri de produse" },
        ]}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total produse",  value: String(data?.total ?? 0),   icon: <Package className="h-4 w-4 text-muted-foreground" /> },
          { label: "În stoc",        value: String(inStock),            icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
          { label: "Stoc redus",     value: String(lowStock),           icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> },
          { label: "Epuizat",        value: String(outOfStock),         icon: <XCircle className="h-4 w-4 text-red-500" /> },
        ].map(m => (
          <Card key={m.label} className="shadow-xs">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-1">{m.icon}<span className="text-xs text-muted-foreground">{m.label}</span></div>
              <p className="text-2xl font-bold">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Import + table */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Stoc la zi</CardTitle>
              <CardDescription className="text-xs">
                {data?.syncedAt ? `Ultimul sync: ${new Date(data.syncedAt).toLocaleString("ro-RO")}` : "Niciun import efectuat"} · Valoare totală: {fmtRON(totalValue)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-3 py-1.5 text-sm w-48"
                placeholder="Caută produs / SKU..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <button onClick={load} className="flex items-center gap-1 border rounded px-3 py-1.5 text-sm hover:bg-muted">
                <RefreshCw className="h-3.5 w-3.5" /> Reîncarcă
              </button>
              <label className="flex items-center gap-1 bg-primary text-primary-foreground rounded px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/90">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Se importă..." : "Import CSV"}
                <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>
          {uploadMsg && (
            <div className={`mt-2 text-xs px-3 py-2 rounded ${uploadMsg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {uploadMsg.text}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">Se încarcă stocurile...</div>
          ) : items.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <Package className="h-8 w-8 opacity-30" />
              {filter ? "Niciun produs găsit." : "Niciun produs importat. Folosește butonul Import CSV pentru a adăuga stocuri."}
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
                        <td className="px-4 py-2.5">{item.unitPrice > 0 ? fmtRON(item.unitPrice) : "—"}</td>
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

      {/* Instructions */}
      <Card className="shadow-xs bg-muted/30">
        <CardContent className="pt-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Cum importezi stocurile din SmartBill:</p>
          <p>1. Accesează <strong>cloud.smartbill.ro → Gestiune → Raport stoc la zi</strong></p>
          <p>2. Selectează gestiunea <strong>GESTIUNE PARC SIBIU-VESTEM</strong></p>
          <p>3. Exportă în format <strong>CSV sau Excel</strong></p>
          <p>4. Folosește butonul <strong>Import CSV</strong> de mai sus</p>
          <p className="text-[11px] pt-1">Coloane detectate automat: Denumire, Cod/SKU, Categorie, Cantitate, Preț unitar, UM</p>
        </CardContent>
      </Card>
    </div>
  );
}
