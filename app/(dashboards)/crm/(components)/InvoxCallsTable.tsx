"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface CrmCall {
  id: string;
  caller: string;
  account: string | null;
  date: string;
  duration: string | null;
  status: string | null;
  source: string | null;
  campaign: string | null;
}

export function InvoxCallsTable() {
  const [calls, setCalls] = useState<CrmCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/calls")
      .then((r) => r.json())
      .then((data) => {
        setCalls(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const getStatusVariant = (status: string | null) => {
    if (!status) return "outline";
    const s = status.toLowerCase();
    if (s.includes("answer") || s === "calls") return "default";
    if (s.includes("miss") || s === "vmbox") return "destructive";
    return "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Phone className="w-4 h-4" />
          Apeluri INVOX
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Se încarcă...</p>
        ) : calls.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Niciun apel înregistrat încă. Apelurile vor apărea automat după configurarea webhook-ului.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-4 font-medium">Telefon</th>
                  <th className="text-left py-2 pr-4 font-medium">Account Manager</th>
                  <th className="text-left py-2 pr-4 font-medium">Data</th>
                  <th className="text-left py-2 pr-4 font-medium">Durată</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-left py-2 pr-4 font-medium">Sursă</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={call.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-2 pr-4 font-medium">{call.caller || "—"}</td>
                    <td className="py-2 pr-4">{call.account || "—"}</td>
                    <td className="py-2 pr-4">
                      {call.date ? format(new Date(call.date), "dd MMM yyyy, HH:mm") : "—"}
                    </td>
                    <td className="py-2 pr-4">{call.duration ? `${call.duration}s` : "—"}</td>
                    <td className="py-2 pr-4">
                      <Badge variant={getStatusVariant(call.status)}>
                        {call.status || "—"}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">{call.source || "—"}</td>
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
