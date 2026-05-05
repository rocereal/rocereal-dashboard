"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface ZeroAd { id: string; name: string; campaign: string | null; spend: number; impressions: number; clicks: number }
interface Analysis { zeroConversionAds: ZeroAd[] }

const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) => new Intl.NumberFormat("ro-RO").format(v);

export function ZeroConversionAds({ dateRange }: { dateRange?: DateTimeRange }) {
  const [ads, setAds]         = useState<ZeroAd[]>([]);
  const [loading, setLoading] = useState(true);

  const from = dateRange?.from?.toISOString().slice(0, 10);
  const to   = dateRange?.to?.toISOString().slice(0, 10);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to)   params.set("to", to);
    fetch(`/api/finance/ai-analysis?${params}`, { cache: "no-store" })
      .then(r => r.json())
      .then((d: Analysis) => setAds(d.zeroConversionAds ?? []))
      .finally(() => setLoading(false));
  }, [from, to]);

  if (!loading && ads.length === 0) return null;

  return (
    <Card className="shadow-xs border-orange-200 dark:border-orange-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <AlertTriangle className="h-4 w-4" /> Reclame cu Spend Mare și Zero Conversii
        </CardTitle>
        <CardDescription className="text-xs">Facebook Ads — spend &gt; 50 RON, 0 conversii raportate în period</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-16 flex items-center justify-center text-sm text-muted-foreground">Se încarcă...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  {["Reclamă", "Campanie", "Spend", "Impresii", "Clicuri", "Recomandare"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium max-w-[200px] truncate" title={ad.name}>{ad.name}</td>
                    <td className="px-4 py-2 text-muted-foreground max-w-[160px] truncate" title={ad.campaign ?? ""}>{ad.campaign ?? "—"}</td>
                    <td className="px-4 py-2 font-semibold text-red-500">{fmtRON(ad.spend)}</td>
                    <td className="px-4 py-2">{fmtNum(ad.impressions)}</td>
                    <td className="px-4 py-2">{fmtNum(ad.clicks)}</td>
                    <td className="px-4 py-2">
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[11px] font-medium px-2 py-0.5 rounded">
                        Oprește
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
