"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ChannelData { conversions: number; revenue: number; calls: number; answered: number }
interface Analysis {
  channelRevenue: Record<string, ChannelData>;
  totals: { attributedRevenue: number; unattributedRevenue: number; totalSmartbillRevenue: number; totalCalls: number; answeredCalls: number; attributedInvoices: number; unattributedInvoices: number; totalInvoices: number };
}

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);
const pct = (a: number, b: number) => b > 0 ? `${((a / b) * 100).toFixed(1)}%` : "—";

const CHANNELS: { key: string; label: string; color: string }[] = [
  { key: "facebook", label: "Facebook",  color: "bg-blue-500"   },
  { key: "tiktok",   label: "TikTok",    color: "bg-pink-500"   },
  { key: "google",   label: "Google",    color: "bg-green-500"  },
];

function currentMonthParams() {
  const now  = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const to   = now.toISOString().slice(0, 10);
  return `from=${from}&to=${to}`;
}

export function AttributionPanel() {
  const [data, setData]       = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/finance/ai-analysis?${currentMonthParams()}`, { cache: "no-store" })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Atribuire Venituri per Canal</CardTitle>
        <CardDescription className="text-xs">Apeluri Invox/Daktela → SmartBill clienți → Facturi plătite — luna curentă</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">Se încarcă...</div>
        ) : !data ? null : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-center">
              {[
                { label: "Venituri totale SmartBill", value: fmtRON(data.totals.totalSmartbillRevenue), sub: `${fmtNum(data.totals.totalInvoices)} facturi` },
                { label: "Venituri atribuite",        value: fmtRON(data.totals.attributedRevenue),     sub: `${data.totals.attributedInvoices} facturi`, cls: "text-green-600" },
                { label: "Venituri neatribuite",      value: fmtRON(data.totals.unattributedRevenue),   sub: `${data.totals.unattributedInvoices} facturi`, cls: "text-orange-500" },
                { label: "Total apeluri",             value: fmtNum(data.totals.totalCalls),            sub: "luna curentă" },
                { label: "Apeluri receptionate",      value: fmtNum(data.totals.answeredCalls),         sub: pct(data.totals.answeredCalls, data.totals.totalCalls) + " rată răspuns" },
              ].map(m => (
                <div key={m.label} className="bg-muted/40 rounded-lg p-3">
                  <p className={`text-xl font-bold ${m.cls ?? ""}`}>{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {["Canal", "Apeluri", "Receptionate", "Rată răspuns", "Conversii atribuite", "Venituri atribuite", "Rată conversie"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CHANNELS.map(ch => {
                    const d = data.channelRevenue[ch.key] ?? { calls: 0, answered: 0, conversions: 0, revenue: 0 };
                    return (
                      <tr key={ch.key} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${ch.color}`} />{ch.label}
                        </td>
                        <td className="px-4 py-2.5">{fmtNum(d.calls)}</td>
                        <td className="px-4 py-2.5">{fmtNum(d.answered)}</td>
                        <td className="px-4 py-2.5">{pct(d.answered, d.calls)}</td>
                        <td className="px-4 py-2.5 font-semibold">{d.conversions > 0 ? fmtNum(d.conversions) : "—"}</td>
                        <td className="px-4 py-2.5 font-medium text-green-700 dark:text-green-400">{d.revenue > 0 ? fmtRON(d.revenue) : "—"}</td>
                        <td className="px-4 py-2.5">{pct(d.conversions, d.answered)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
