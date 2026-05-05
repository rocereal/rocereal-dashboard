"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Analysis {
  forecast: { projectedRevenue: number; targetRON: number | null; belowTarget: boolean; daysElapsed: number; daysTotal: number };
  totals:   { attributedRevenue: number; unattributedRevenue: number; totalSmartbillRevenue: number; totalCalls: number; answeredCalls: number; attributedInvoices: number; unattributedInvoices: number; totalInvoices: number };
}

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);

function currentMonthParams() {
  const now  = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to   = now.toISOString().slice(0, 10);
  return { from, to, params: `from=${from}&to=${to}`, period: now.toISOString().slice(0, 7) };
}

export function SalesTargetWidget() {
  const [data, setData]       = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [targetInput, setTargetInput] = useState("");
  const [saving, setSaving]   = useState(false);

  const { params, period } = currentMonthParams();

  const load = () => {
    setLoading(true);
    fetch(`/api/finance/ai-analysis?${params}`, { cache: "no-store" })
      .then(r => r.json())
      .then((d: Analysis) => { setData(d); setTargetInput(String(d.forecast.targetRON ?? "")); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const saveTarget = async () => {
    const val = parseFloat(targetInput);
    if (isNaN(val) || val <= 0) return;
    setSaving(true);
    await fetch("/api/finance/sales-target", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period, targetRON: val }),
    });
    setSaving(false);
    setEditing(false);
    load();
  };

  if (loading) return <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">Se încarcă analiza...</div>;
  if (!data) return null;

  const { forecast, totals } = data;
  const progress = forecast.targetRON ? Math.min(100, Math.round((totals.attributedRevenue / forecast.targetRON) * 100)) : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="col-span-2 shadow-xs">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Obiectiv lunar — {period}
          </CardTitle>
          <button onClick={() => setEditing(e => !e)} className="text-xs text-muted-foreground hover:text-foreground underline">
            {editing ? "Anulează" : "Setează obiectiv"}
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {editing && (
            <div className="flex gap-2">
              <input
                className="border rounded px-2 py-1 text-sm w-40"
                placeholder="Ex: 500000"
                value={targetInput}
                onChange={e => setTargetInput(e.target.value)}
              />
              <button onClick={saveTarget} disabled={saving} className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded">
                {saving ? "..." : "Salvează"}
              </button>
            </div>
          )}
          {forecast.targetRON ? (
            <>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{fmtRON(totals.attributedRevenue)} realizat</span>
                <span>{fmtRON(forecast.targetRON)} target</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${progress! >= 100 ? "bg-green-500" : progress! >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{progress}% din target ({forecast.daysElapsed}/{forecast.daysTotal} zile)</p>
              {forecast.belowTarget && (
                <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                  <AlertTriangle className="h-3 w-3" />
                  Forecast ({fmtRON(forecast.projectedRevenue)}) este sub target!
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Niciun target setat pentru această perioadă.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="pb-1"><CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Forecast luna curentă</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fmtRON(forecast.projectedRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">bazat pe {forecast.daysElapsed} zile</p>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="pb-1"><CardTitle className="text-xs font-semibold text-muted-foreground">Venituri neatribuite</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-orange-500">{fmtRON(totals.unattributedRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{totals.unattributedInvoices} facturi fără sursă</p>
        </CardContent>
      </Card>
    </div>
  );
}
