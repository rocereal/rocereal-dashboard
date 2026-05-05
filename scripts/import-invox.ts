import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

function fixEncoding(s: string): string {
  return s
    .replace(/CÄtÄlin/g, "Cătălin")
    .replace(/ValentÄ­n/g, "Valentin")
    .replace(/Ä/g, "ă");
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  const csvPath = join(process.cwd(), "scripts", "invox-import.csv");
  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  // Find the header row (starts with "Date")
  const headerIdx = lines.findIndex((l) => l.startsWith('"Date"'));
  if (headerIdx === -1) {
    console.error("Could not find data header row");
    process.exit(1);
  }

  const dataLines = lines.slice(headerIdx + 1);

  let inserted = 0;
  let skipped = 0;

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    // Skip empty or summary rows
    if (!cols[0] || cols[0] === "" || cols[1] === "") continue;
    // Skip if first col doesn't look like a date
    if (!cols[0].match(/^\d{4}-\d{2}-\d{2}/)) continue;

    const [dateStr, caller, status, receivingNumber, account, trackingNumber, durationRaw, channel] = cols;

    // Generate a unique ID for historical imports
    const invoxId = `csv_${dateStr.replace(/[^0-9]/g, "")}_${caller}`;
    const duration = durationRaw ? durationRaw.replace("s", "") : null;
    const date = new Date(dateStr);

    try {
      await prisma.crmCall.upsert({
        where: { invoxId },
        update: {},
        create: {
          invoxId,
          caller,
          account: fixEncoding(account) || null,
          date,
          duration: duration || null,
          status: status || null,
          source: channel || null,
          campaign: channel || null,
          receivingNumber: receivingNumber || null,
          rawPayload: { dateStr, caller, status, receivingNumber, account, trackingNumber, durationRaw, channel },
        },
      });
      inserted++;
    } catch (e) {
      console.error("Error inserting row:", dateStr, caller, e);
      skipped++;
    }
  }

  console.log(`Done! Inserted: ${inserted}, Skipped: ${skipped}`);
  await prisma.$disconnect();
}

main().catch(console.error);
