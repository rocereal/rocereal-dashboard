"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { BrainCircuit, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Insight {
  id:        string;
  type:      string;
  category:  string;
  priority:  string;
  title:     string;
  body:      string;
  action:    string | null;
  isRead:    boolean;
  createdAt: string;
}

interface Employee {
  id:          string;
  slug:        string;
  name:        string;
  title:       string;
  skills:      string[];
  avatarColor: string;
  insights:    Insight[];
}

const ACTION_COLOR: Record<string, string> = {
  scale:       "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  stop:        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  test:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  investigate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  monitor:     "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const PRIORITY_DOT: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-yellow-500",
  low:    "bg-green-500",
};

const ACTION_LABEL: Record<string, string> = {
  scale: "Scalează", stop: "Oprește", test: "Testează", investigate: "Investighează", monitor: "Monitorizează",
};

function EmployeeCard({ emp }: { emp: Employee }) {
  const initials = emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const unread   = emp.insights.filter(i => !i.isRead).length;

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: emp.avatarColor }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold">{emp.name}</CardTitle>
            <CardDescription className="text-xs">{emp.title}</CardDescription>
            <div className="flex flex-wrap gap-1 mt-1">
              {emp.skills.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
          {unread > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
              {unread}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {emp.insights.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Niciun insight generat încă pentru această perioadă.</p>
        ) : (
          emp.insights.map(ins => (
            <div key={ins.id} className={`rounded-lg border p-3 space-y-1 ${ins.isRead ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[ins.priority] ?? "bg-gray-400"}`} />
                  <p className="text-xs font-semibold">{ins.title}</p>
                </div>
                {ins.action && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${ACTION_COLOR[ins.action] ?? "bg-muted"}`}>
                    {ACTION_LABEL[ins.action] ?? ins.action}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function AiEmployeesSection({ dateRange }: { dateRange?: DateTimeRange }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading]     = useState(true);

  const loadEmployees = () => {
    setLoading(true);
    fetch("/api/ai/employees", { cache: "no-store" })
      .then(r => r.json())
      .then(setEmployees)
      .finally(() => setLoading(false));
  };

  useEffect(loadEmployees, [dateRange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Echipa AI — 7 Angajați</h2>
          <span className="text-xs text-muted-foreground">Insights generate din date reale</span>
        </div>
        <button onClick={loadEmployees} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RefreshCw className="h-3 w-3" /> Reîncarcă
        </button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Se încarcă angajații AI...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {employees.map(emp => <EmployeeCard key={emp.id} emp={emp} />)}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        💡 Insight-urile AI se generează zilnic pe baza datelor reale din Facebook Ads, TikTok, Google Ads, Invox și SmartBill.
        Configurează integrarea Claude API pentru activare automată.
      </p>
    </div>
  );
}
