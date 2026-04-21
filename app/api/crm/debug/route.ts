import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let p = raw.replace(/[\s\-().]/g, "");
  if (p.startsWith("+40")) p = "0" + p.slice(3);
  if (p.startsWith("40") && p.length === 11) p = "0" + p.slice(2);
  return p;
}

export async function GET() {
  const [sbClients, calls] = await Promise.all([
    prisma.smartbillClient.findMany({ select: { name: true, phone: true } }),
    prisma.crmCall.findMany({ select: { caller: true }, distinct: ["caller"] }),
  ]);

  const withPhone = sbClients.filter(c => c.phone && c.phone.trim() !== "");
  const withoutPhone = sbClients.filter(c => !c.phone || c.phone.trim() === "");

  const sbPhones = new Set(withPhone.map(c => normalizePhone(c.phone)));
  const invoxPhones = calls.map(c => normalizePhone(c.caller)).filter(Boolean);
  const matched = invoxPhones.filter(p => sbPhones.has(p));
  const unmatched = invoxPhones.filter(p => !sbPhones.has(p));

  return NextResponse.json({
    smartbill: {
      total: sbClients.length,
      withPhone: withPhone.length,
      withoutPhone: withoutPhone.length,
      sample_no_phone: withoutPhone.slice(0, 10).map(c => c.name),
    },
    invox: {
      uniqueCallers: invoxPhones.length,
      matched: matched.length,
      unmatched: unmatched.length,
      sample_unmatched: unmatched.slice(0, 10),
    },
  });
}
