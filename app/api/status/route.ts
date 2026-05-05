import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ServiceStatus = "operational" | "degraded" | "down" | "unknown";

interface ServiceResult {
  id: string;
  name: string;
  status: ServiceStatus;
  message: string;
  latencyMs?: number;
  meta?: Record<string, string | number | boolean | null>;
}

async function checkGoogleAnalytics(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "google-analytics", name: "Google Analytics" };
  const propertyId = process.env.GA4_PROPERTY_ID;
  const serviceAccountJson = process.env.GA4_SERVICE_ACCOUNT_JSON;

  if (!propertyId || !serviceAccountJson) {
    return { ...base, status: "unknown", message: "Variabilele de mediu GA4_PROPERTY_ID / GA4_SERVICE_ACCOUNT_JSON lipsesc" };
  }

  const t0 = Date.now();
  try {
    const sa = JSON.parse(serviceAccountJson);
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };
    const encode = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const unsigned = `${encode(header)}.${encode(payload)}`;
    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(unsigned);
    const jwt = `${unsigned}.${sign.sign(sa.private_key, "base64url")}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    });
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) {
      return { ...base, status: "down", message: `Autentificare eșuată: ${tokenData.error ?? "token lipsă"}`, latencyMs: Date.now() - t0 };
    }

    // Quick lightweight metadata call
    const metaRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}/metadata`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` }, cache: "no-store" }
    );
    const latencyMs = Date.now() - t0;
    if (!metaRes.ok) {
      return { ...base, status: "degraded", message: `API răspunde cu ${metaRes.status}`, latencyMs };
    }
    return { ...base, status: "operational", message: "Conectat și autentificat cu succes", latencyMs, meta: { propertyId } };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

async function checkInvox(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "invox", name: "Invox" };
  const apiKey = process.env.INVOX_API_KEY;
  const webhookToken = process.env.INVOX_WEBHOOK_TOKEN;

  if (!apiKey) {
    return { ...base, status: "unknown", message: "INVOX_API_KEY lipsește din variabilele de mediu" };
  }

  const t0 = Date.now();
  try {
    // Check DB for last imported call
    const [count, lastCall] = await Promise.all([
      prisma.crmCall.count(),
      prisma.crmCall.findFirst({ orderBy: { date: "desc" }, select: { date: true } }),
    ]);
    const latencyMs = Date.now() - t0;

    if (count === 0) {
      return { ...base, status: "degraded", message: "Baza de date nu conține apeluri Invox", latencyMs };
    }

    const lastImport = lastCall?.date ? new Date(lastCall.date) : null;
    const hoursSinceLast = lastImport ? (Date.now() - lastImport.getTime()) / 3600000 : null;
    const status: ServiceStatus = hoursSinceLast !== null && hoursSinceLast > 48 ? "degraded" : "operational";
    const lastImportStr = lastImport
      ? lastImport.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "necunoscut";

    return {
      ...base,
      status,
      message: status === "operational"
        ? `${count.toLocaleString("ro-RO")} apeluri importate, ultimul sync recent`
        : `Ultimul apel: ${lastImportStr} — posibil sync întârziat`,
      latencyMs,
      meta: { totalCalls: count, lastCallDate: lastImportStr, webhookConfigured: !!webhookToken },
    };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare DB: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

async function checkSmartBill(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "smartbill", name: "SmartBill" };
  const email = process.env.SMARTBILL_EMAIL;
  const token = process.env.SMARTBILL_TOKEN;
  const cif = process.env.SMARTBILL_CIF;

  if (!email || !token || !cif) {
    return { ...base, status: "unknown", message: "SMARTBILL_EMAIL / SMARTBILL_TOKEN / SMARTBILL_CIF lipsesc" };
  }

  const t0 = Date.now();
  try {
    const auth = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
    const res = await fetch(`https://ws.smartbill.ro/SBORO/api/series?cif=${encodeURIComponent(cif)}&type=f`, {
      headers: { Authorization: auth, Accept: "application/json" },
      cache: "no-store",
    });
    const latencyMs = Date.now() - t0;

    if (!res.ok) {
      return { ...base, status: "down", message: `API răspunde cu ${res.status}: ${res.statusText}`, latencyMs };
    }
    const data = await res.json() as { list?: { name: string; nextNumber: number }[]; errorText?: string };
    if (data.errorText) {
      return { ...base, status: "degraded", message: `Răspuns cu eroare: ${data.errorText}`, latencyMs };
    }

    // Also check DB invoice count
    const invoiceCount = await prisma.smartbillInvoice.count();
    const seriesNames = (data.list ?? []).map(s => s.name).join(", ");

    return {
      ...base,
      status: "operational",
      message: `Conectat — ${invoiceCount.toLocaleString("ro-RO")} facturi sincronizate`,
      latencyMs,
      meta: { series: seriesNames, invoicesInDB: invoiceCount },
    };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

async function checkFacebookAds(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "facebook-ads", name: "Facebook Ads" };
  const fbToken = process.env.FB_ACCESS_TOKEN;

  if (!fbToken) {
    return { ...base, status: "unknown", message: "FB_ACCESS_TOKEN lipsește din variabilele de mediu" };
  }

  const t0 = Date.now();
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${fbToken}`,
      { cache: "no-store" }
    );
    const latencyMs = Date.now() - t0;
    const data = await res.json() as { id?: string; name?: string; error?: { message: string; code: number } };

    if (data.error) {
      const isExpired = data.error.code === 190;
      return {
        ...base,
        status: isExpired ? "down" : "degraded",
        message: isExpired ? "Token expirat — regenerează token-ul în Meta Business" : `Eroare API: ${data.error.message}`,
        latencyMs,
      };
    }

    // Check DB for any ad data
    const adCount = await prisma.facebookAdInsight?.count?.() ?? null;

    return {
      ...base,
      status: "operational",
      message: `Autentificat ca ${data.name ?? data.id}`,
      latencyMs,
      meta: {
        accountId: data.id ?? null,
        accountName: data.name ?? null,
        ...(adCount !== null ? { adsInDB: adCount } : {}),
      },
    };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

async function checkGitHubActions(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "github-actions", name: "GitHub Actions" };
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;
  const ghToken = process.env.GITHUB_TOKEN;

  if (!repoOwner || !repoName) {
    return { ...base, status: "unknown", message: "GITHUB_REPO_OWNER / GITHUB_REPO_NAME lipsesc din env" };
  }

  const t0 = Date.now();
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (ghToken) headers["Authorization"] = `Bearer ${ghToken}`;

    const res = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?per_page=10`,
      { headers, cache: "no-store" }
    );
    const latencyMs = Date.now() - t0;

    if (!res.ok) {
      return { ...base, status: "degraded", message: `GitHub API: ${res.status} — verifică credențialele`, latencyMs };
    }

    const data = await res.json() as {
      workflow_runs?: { name: string; status: string; conclusion: string | null; updated_at: string }[];
    };

    const runs = data.workflow_runs ?? [];
    const failed = runs.filter(r => r.conclusion === "failure");
    const allGood = failed.length === 0;

    const lastRunDate = runs[0]?.updated_at
      ? new Date(runs[0].updated_at).toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "necunoscut";

    return {
      ...base,
      status: allGood ? "operational" : "degraded",
      message: allGood
        ? `Toate workflow-urile recente au rulat cu succes`
        : `${failed.length} workflow(s) au eșuat recent`,
      latencyMs,
      meta: {
        totalRecentRuns: runs.length,
        failedRuns: failed.length,
        lastRun: lastRunDate,
        failedWorkflows: failed.map(r => r.name).join(", ") || null,
      },
    };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

async function checkDaktela(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "daktela", name: "Daktela" };
  const apiUrl   = process.env.DAKTELA_API_URL;
  const apiToken = process.env.DAKTELA_API_TOKEN;

  if (!apiUrl || !apiToken) {
    return { ...base, status: "unknown", message: "DAKTELA_API_URL / DAKTELA_API_TOKEN lipsesc din variabilele de mediu" };
  }

  const t0 = Date.now();
  try {
    const url = new URL(`${apiUrl}/api/v5/users.json`);
    url.searchParams.set("accessToken", apiToken);
    url.searchParams.set("limit", "1");
    const res = await fetch(url.toString(), { cache: "no-store" });
    const latencyMs = Date.now() - t0;
    if (!res.ok) return { ...base, status: "down", message: `API răspunde cu ${res.status}`, latencyMs };
    const data = await res.json() as { result?: unknown; error?: string };
    if (data.error) return { ...base, status: "degraded", message: data.error, latencyMs };

    const callCount = await prisma.leadCall.count({ where: { provider: "daktela" } });
    return { ...base, status: "operational", message: `Conectat — ${callCount.toLocaleString("ro-RO")} apeluri importate`, latencyMs, meta: { callsInDB: callCount } };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

async function checkDatabase(): Promise<ServiceResult> {
  const base: Omit<ServiceResult, "status" | "message"> = { id: "database", name: "Bază de date (Neon)" };
  const t0 = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - t0;
    return {
      ...base,
      status: "operational",
      message: "Conexiune PostgreSQL activă",
      latencyMs,
    };
  } catch (e) {
    return { ...base, status: "down", message: `Eroare DB: ${e instanceof Error ? e.message : String(e)}`, latencyMs: Date.now() - t0 };
  }
}

export async function GET() {
  const [db, ga, invox, daktela, smartbill, fbAds, ghActions] = await Promise.allSettled([
    checkDatabase(),
    checkGoogleAnalytics(),
    checkInvox(),
    checkDaktela(),
    checkSmartBill(),
    checkFacebookAds(),
    checkGitHubActions(),
  ]);

  const results = [db, ga, invox, daktela, smartbill, fbAds, ghActions].map(r =>
    r.status === "fulfilled" ? r.value : { id: "error", name: "Eroare", status: "down" as ServiceStatus, message: String(r.reason) }
  );

  const overallStatus: ServiceStatus =
    results.some(r => r.status === "down") ? "down" :
    results.some(r => r.status === "degraded") ? "degraded" :
    results.every(r => r.status === "operational") ? "operational" : "unknown";

  return NextResponse.json({
    overallStatus,
    checkedAt: new Date().toISOString(),
    services: results,
  });
}
