// Naming convention validator for RO CEREAL ads
//
// Campaign: ROCE_[CANAL]_[PRODUS]_[OBIECTIV]_[JUDET/REGIUNE]_[YYYYMM]
// Ad set:   [PUBLIC]_[REGIUNE]_[PLACEMENT]_[VARSTA]_[INTERES]
// Ad:       [PRODUS]_[UNGHI]_[FORMAT]_[CREATIVE-ID]_[DATA]

export const VALID_CHANNELS   = ["META", "TIKTOK", "GOOGLE", "YOUTUBE"];
export const VALID_OBJECTIVES = ["LEADS", "TRAFFIC", "AWARENESS", "CONVERSIONS", "REACH", "ENGAGEMENT"];
export const VALID_FORMATS    = ["VIDEO", "IMAGE", "CAROUSEL", "REEL", "STORY", "COLLECTION"];

export interface NamingViolation {
  entityId:   string;
  entityName: string;
  level:      "campaign" | "adset" | "ad";
  platform:   string;
  reason:     string;
}

// ROCE_META_MASINI-ELECTRICE_LEADS_RO_202605
const CAMPAIGN_REGEX = /^ROCE_[A-Z0-9-]+_[A-Z0-9-]+_[A-Z]+_[A-Z0-9-]+_\d{6}$/;

// TINERI-16-18_RO_ADVANTAGE_16-18_MICROCAR
const ADSET_REGEX = /^[A-Z0-9-]+_[A-Z0-9-]+_[A-Z0-9-]+_[A-Z0-9-]+_[A-Z0-9-]+$/;

// AIXAM_FARA-PERMIS_VIDEO_CR03_20260505
const AD_REGEX = /^[A-Z0-9-]+_[A-Z0-9-]+_[A-Z0-9-]+_[A-Z0-9-]+_\d{8}$/;

export function validateCampaignName(name: string): { valid: boolean; reason?: string } {
  const n = name.toUpperCase().trim();
  if (!n.startsWith("ROCE_")) return { valid: false, reason: "Campania nu începe cu ROCE_" };
  if (!CAMPAIGN_REGEX.test(n))  return { valid: false, reason: "Format invalid: ROCE_[CANAL]_[PRODUS]_[OBIECTIV]_[REGIUNE]_[YYYYMM]" };
  const parts = n.split("_");
  if (!VALID_CHANNELS.includes(parts[1]))   return { valid: false, reason: `Canal invalid: ${parts[1]}. Valide: ${VALID_CHANNELS.join(", ")}` };
  if (!VALID_OBJECTIVES.includes(parts[3])) return { valid: false, reason: `Obiectiv invalid: ${parts[3]}. Valide: ${VALID_OBJECTIVES.join(", ")}` };
  return { valid: true };
}

export function validateAdsetName(name: string): { valid: boolean; reason?: string } {
  const n = name.toUpperCase().trim();
  if (!ADSET_REGEX.test(n)) return { valid: false, reason: "Format invalid: [PUBLIC]_[REGIUNE]_[PLACEMENT]_[VARSTA]_[INTERES]" };
  return { valid: true };
}

export function validateAdName(name: string): { valid: boolean; reason?: string } {
  const n = name.toUpperCase().trim();
  if (!AD_REGEX.test(n)) return { valid: false, reason: "Format invalid: [PRODUS]_[UNGHI]_[FORMAT]_[CREATIVE-ID]_[YYYYMMDD]" };
  const parts = n.split("_");
  if (!VALID_FORMATS.includes(parts[2])) return { valid: false, reason: `Format reclamă invalid: ${parts[2]}. Valide: ${VALID_FORMATS.join(", ")}` };
  return { valid: true };
}

export function checkNamingViolations(entities: {
  id: string;
  name: string;
  level: "campaign" | "adset" | "ad";
  platform: string;
}[]): NamingViolation[] {
  const violations: NamingViolation[] = [];
  for (const e of entities) {
    let result: { valid: boolean; reason?: string };
    if (e.level === "campaign") result = validateCampaignName(e.name);
    else if (e.level === "adset") result = validateAdsetName(e.name);
    else result = validateAdName(e.name);

    if (!result.valid) {
      violations.push({ entityId: e.id, entityName: e.name, level: e.level, platform: e.platform, reason: result.reason! });
    }
  }
  return violations;
}
