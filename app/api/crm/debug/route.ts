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

  const testPhone = "0747230442";
  const allCalls = await prisma.crmCall.findMany({ select: { caller: true }, where: { caller: { contains: "0747230442" } } });
  const testSB = sbClients.filter(c => normalizePhone(c.phone) === testPhone);
  const inCallMap = sbPhones.has(testPhone);

  return NextResponse.json({
    smartbill: { total: sbClients.length, withPhone: withPhone.length },
    invox: { uniqueCallers: invoxPhones.length, matched: matched.length, unmatched: unmatched.length },
    test_0747230442: {
      raw_calls_in_db: allCalls.map(c => c.caller),
      normalized_calls: allCalls.map(c => normalizePhone(c.caller)),
      in_smartbill: testSB.map(c => ({ name: c.name, phone: c.phone, normalized: normalizePhone(c.phone) })),
      phone_in_callMap_keys: invoxPhones.includes(testPhone),
      phone_in_sbPhones: inCallMap,
    },
  });
}
