"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Mail,
  Phone,
  PhoneCall,
  PhoneIncoming,
  Receipt,
  Route,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CallRecord {
  id: string;
  date: string;
  duration: string | null;
  status: string | null;
  agent: string;
  source: string | null;
  campaign: string | null;
}

interface InvoiceRecord {
  invoiceKey: string;
  series: string;
  number: number;
  issuedAt: string;
  dueDate: string | null;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paid: boolean;
}

interface ClientDetail {
  phone: string;
  rawPhone: string;
  name: string;
  email: string;
  status: string;
  firstSeen: string;
  lastSeen: string;
  callCount: number;
  totalValue: number;
  paidInvoices: number;
  totalInvoices: number;
  calls: CallRecord[];
  invoices: InvoiceRecord[];
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmtRON = (v: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", minimumFractionDigits: 2 }).format(v);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function fmtDuration(raw: string | null) {
  if (!raw) return "—";
  const s = parseInt(raw, 10);
  if (isNaN(s)) return raw;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function initials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

// ─── Info tab ─────────────────────────────────────────────────────────────────
function InfoTab({ client }: { client: ClientDetail }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact */}
      <Card className="border !bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4" /> Informații contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: User, label: "Nume", value: client.name || "—" },
            { icon: Phone, label: "Telefon", value: client.phone },
            { icon: Mail, label: "E-mail", value: client.email || "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="size-8 flex items-center justify-center rounded-lg bg-muted shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity stats */}
      <Card className="border !bg-card shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Statistici activitate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: Calendar, label: "Primul contact", value: fmtDateTime(client.firstSeen) },
            { icon: Clock, label: "Ultimul contact", value: fmtDateTime(client.lastSeen) },
            { icon: PhoneCall, label: "Număr apeluri", value: `${client.callCount} apeluri` },
            { icon: Receipt, label: "Facturi", value: `${client.paidInvoices} achitate / ${client.totalInvoices} total` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="size-8 flex items-center justify-center rounded-lg bg-muted shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Financial summary */}
      {client.totalInvoices > 0 && (
        <Card className="border !bg-card shadow-xs lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" /> Sumar financiar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-green-50 dark:bg-green-950/40 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Valoare totală achitată</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{fmtRON(client.totalValue)}</p>
              </div>
              <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/40 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Facturi achitate</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{client.paidInvoices}</p>
              </div>
              <div className="rounded-xl border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Facturi neachitate</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{client.totalInvoices - client.paidInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Calls tab ────────────────────────────────────────────────────────────────
function CallsTab({ calls }: { calls: CallRecord[] }) {
  return (
    <Card className="border !bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <PhoneIncoming className="h-4 w-4" /> Apeluri Invox ({calls.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Durată</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Sursă</TableHead>
                <TableHead>Campanie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                    Niciun apel găsit.
                  </TableCell>
                </TableRow>
              ) : (
                calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="text-sm tabular-nums">{fmtDateTime(call.date)}</TableCell>
                    <TableCell className="text-sm font-mono">{fmtDuration(call.duration)}</TableCell>
                    <TableCell>
                      {call.status ? (
                        <Badge variant="outline" className="text-xs">
                          {call.status}
                        </Badge>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm">{call.agent}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{call.source || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{call.campaign || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Invoices tab ─────────────────────────────────────────────────────────────
function InvoicesTab({ invoices }: { invoices: InvoiceRecord[] }) {
  return (
    <Card className="border !bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4" /> Facturi SmartBill ({invoices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
            <FileText className="h-8 w-8 opacity-30" />
            <p className="text-sm">Clientul nu are facturi în SmartBill.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factură</TableHead>
                  <TableHead>Data emiterii</TableHead>
                  <TableHead>Scadentă</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Achitat</TableHead>
                  <TableHead className="text-right">Rest</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.invoiceKey}>
                    <TableCell className="font-mono text-sm font-medium">{inv.invoiceKey}</TableCell>
                    <TableCell className="text-sm tabular-nums">{fmtDate(inv.issuedAt)}</TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">
                      {inv.dueDate ? fmtDate(inv.dueDate) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm tabular-nums">{fmtRON(inv.totalAmount)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-green-600 dark:text-green-400">
                      {fmtRON(inv.paidAmount)}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums text-orange-600 dark:text-orange-400">
                      {inv.unpaidAmount > 0 ? fmtRON(inv.unpaidAmount) : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {inv.paid ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Achitată
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 text-xs">
                          <XCircle className="h-3 w-3 mr-1" /> Neachitată
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Timeline tab ─────────────────────────────────────────────────────────────
interface TimelineEvent {
  date: string;
  type: "call" | "invoice_issued" | "invoice_paid" | "first_contact";
  title: string;
  description: string;
  color: string;
  dot: string;
}

function buildTimeline(client: ClientDetail): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // First contact
  events.push({
    date: client.firstSeen,
    type: "first_contact",
    title: "Primul contact",
    description: `Clientul a sunat pentru prima dată pe numărul de tracking Invox.`,
    color: "bg-blue-500",
    dot: "border-blue-500 bg-blue-50 dark:bg-blue-950",
  });

  // All subsequent calls (skip first — already covered)
  client.calls.slice(1).forEach((call, i) => {
    events.push({
      date: call.date,
      type: "call",
      title: `Apel ${i + 2}`,
      description: `Durată: ${fmtDuration(call.duration)} · Agent: ${call.agent}${call.status ? ` · Status: ${call.status}` : ""}`,
      color: "bg-slate-400",
      dot: "border-slate-300 bg-slate-50 dark:bg-slate-900",
    });
  });

  // Invoices
  client.invoices.forEach((inv) => {
    events.push({
      date: inv.issuedAt,
      type: "invoice_issued",
      title: `Factură emisă — ${inv.invoiceKey}`,
      description: `Total: ${fmtRON(inv.totalAmount)}`,
      color: "bg-purple-500",
      dot: "border-purple-500 bg-purple-50 dark:bg-purple-950",
    });
    if (inv.paid && inv.dueDate) {
      events.push({
        date: inv.dueDate,
        type: "invoice_paid",
        title: `Factură achitată — ${inv.invoiceKey}`,
        description: `Suma achitată: ${fmtRON(inv.paidAmount)}`,
        color: "bg-green-500",
        dot: "border-green-500 bg-green-50 dark:bg-green-950",
      });
    }
  });

  // Sort chronologically
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return events;
}

const typeIcons: Record<TimelineEvent["type"], React.ElementType> = {
  first_contact: PhoneCall,
  call: Phone,
  invoice_issued: FileText,
  invoice_paid: CheckCircle2,
};

function TimelineTab({ client }: { client: ClientDetail }) {
  const events = buildTimeline(client);

  return (
    <Card className="border !bg-card shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Route className="h-4 w-4" /> Traseu client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-5 bottom-2 w-px bg-border" />

          <div className="space-y-6">
            {events.map((ev, idx) => {
              const Icon = typeIcons[ev.type];
              return (
                <div key={idx} className="flex items-start gap-4 relative">
                  {/* Dot */}
                  <div className={`relative z-10 size-10 rounded-full border-2 flex items-center justify-center shrink-0 ${ev.dot}`}>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{ev.title}</p>
                      <time className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {fmtDateTime(ev.date)}
                      </time>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientDetailPage({ phone }: { phone: string }) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/crm/clients/${encodeURIComponent(phone)}`, { cache: "no-store" })
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setClient(d as ClientDetail); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [phone]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Se încarcă fișa clientului...</span>
      </div>
    );
  }

  if (notFound || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
        <Phone className="h-10 w-10 opacity-30" />
        <p className="font-semibold">Clientul nu a fost găsit</p>
        <p className="text-sm">Telefon: {phone}</p>
        <Link href="/crm">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi la Raport Clienți
          </Button>
        </Link>
      </div>
    );
  }

  const avatarInitials = initials(client.name || client.phone);

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={client.name || client.phone}
        subtitle={`Fișă client · ${client.phone}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Raport Clienți", href: "/crm" },
          { label: client.name || client.phone },
        ]}
      />

      {/* Hero card */}
      <Card className="border !bg-card shadow-xs">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start gap-4">
            <Avatar className="w-16 h-16 text-lg font-bold">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-xl font-bold">{client.name || <span className="text-muted-foreground">Client necunoscut</span>}</h1>
                <Badge
                  variant="outline"
                  className={
                    client.status === "Calificat"
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }
                >
                  {client.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {client.phone}
                </span>
                {client.email && (
                  <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                    <Mail className="h-3.5 w-3.5" /> {client.email}
                  </a>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Primul contact: {fmtDate(client.firstSeen)}
                </span>
              </div>
            </div>
            {/* Value pill */}
            {client.totalValue > 0 && (
              <div className="rounded-xl border bg-green-50 dark:bg-green-950/40 px-5 py-3 text-center">
                <p className="text-xs text-muted-foreground">Valoare client</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{fmtRON(client.totalValue)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Informații</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span className="hidden sm:inline">Apeluri</span>
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{client.callCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Facturi</span>
            {client.totalInvoices > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{client.totalInvoices}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Traseu</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <InfoTab client={client} />
        </TabsContent>
        <TabsContent value="calls" className="mt-6">
          <CallsTab calls={client.calls} />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <InvoicesTab invoices={client.invoices} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <TimelineTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
