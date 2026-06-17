import { COUNTY_CENTERS } from "./countyMapper";

// Coordinates for common Romanian cities (lat, lng)
const CITY_COORDS: Record<string, [number, number]> = {
  // Sibiu county
  "vestem": [45.7205, 24.2824], "sibiu": [45.7983, 24.1256],
  "selimbar": [45.7489, 24.1503], "cisnadie": [45.7178, 24.1497],
  "avrig": [45.7065, 24.3843], "medias": [46.1582, 24.3519],
  "ocna sibiului": [45.8742, 24.0503], "agnita": [46.0018, 24.6608],
  "rusinari": [45.7461, 24.1658], "talmaciu": [45.6808, 24.2861],
  "cristian": [45.7667, 24.0500], "rasinari": [45.7461, 24.1658],
  "sura mare": [45.8056, 24.1978], "orlat": [45.7706, 23.9983],
  "boita": [45.6736, 24.2511], "gura raului": [45.5897, 23.9814],
  "poplaca": [45.7242, 24.0086],

  // Cluj
  "cluj-napoca": [46.7712, 23.6236], "cluj napoca": [46.7712, 23.6236],
  "turda": [46.5667, 23.7833], "dej": [47.1333, 23.8667],
  "campia turzii": [46.5500, 23.8833], "gherla": [47.0333, 23.9000],
  "huedin": [46.8739, 22.9439], "floresti": [46.7428, 23.5064],

  // Brașov
  "brasov": [45.6427, 25.5887], "sacele": [45.6203, 25.6922],
  "codlea": [45.7047, 25.4464], "rasnov": [45.5953, 25.4619],
  "zarnesti": [45.5667, 25.3500], "fagaras": [45.8433, 24.9747],

  // Alba
  "alba iulia": [46.0733, 23.5797], "blaj": [46.1728, 23.9164],
  "sebes": [45.9589, 23.5675], "aiud": [46.3086, 23.7222],
  "cugir": [45.8422, 23.3675], "zlatna": [46.1167, 23.2167],

  // Mureș
  "targu mures": [46.5386, 24.5575], "sighisoara": [46.2197, 24.7939],
  "reghin": [46.7797, 24.7111], "ludus": [46.4806, 24.0897],

  // Timiș
  "timisoara": [45.7489, 21.2087], "lugoj": [45.6908, 21.9028],

  // Arad
  "arad": [46.1753, 21.3136],

  // Hunedoara
  "deva": [45.8833, 22.9000], "hunedoara": [45.7500, 22.9167],
  "petrosani": [45.4186, 23.3731], "orastie": [45.8333, 23.2000],

  // Prahova
  "ploiesti": [44.9365, 26.0224],

  // București
  "bucuresti": [44.4268, 26.1025], "bucharest": [44.4268, 26.1025],

  // Iași
  "iasi": [47.1569, 27.5897],

  // Constanța
  "constanta": [44.1598, 28.6348],

  // Bacău
  "bacau": [46.5670, 26.9146],

  // Galați
  "galati": [45.4353, 28.0081],

  // Dolj
  "craiova": [44.3302, 23.7949],

  // Bihor
  "oradea": [47.0722, 21.9215],

  // Satu Mare
  "satu mare": [47.7920, 22.8756],

  // Maramureș
  "baia mare": [47.6561, 23.5681],

  // Bistrița-Năsăud
  "bistrita": [47.1314, 24.5000],

  // Neamț
  "piatra neamt": [46.9244, 26.3714],

  // Suceava
  "suceava": [47.6514, 26.2556],

  // Vrancea
  "focsani": [45.6994, 27.1869],

  // Argeș
  "pitesti": [44.8565, 24.8692],

  // Dâmbovița
  "targoviste": [44.9275, 25.4565],

  // Giurgiu
  "giurgiu": [43.9036, 25.9697],

  // Vâlcea
  "ramnicu valcea": [45.1047, 24.3692],

  // Gorj
  "targu jiu": [44.9322, 23.2794],

  // Caraș-Severin
  "resita": [45.2994, 21.8889], "caransebes": [45.4167, 22.2167],

  // Sibiu area extras (origin point for many deliveries)
  "copsa mica": [46.1003, 24.2267],
};

function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/ș|ş/g, "s")
    .replace(/ț|ţ/g, "t")
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/\s+/g, " ");
}

export function getCityCoords(city: string): [number, number] | null {
  if (!city) return null;
  const norm = normalizeCity(city);
  if (CITY_COORDS[norm]) return CITY_COORDS[norm]!;
  // Partial match
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (norm.includes(key) || key.includes(norm)) return coords;
  }
  return null;
}

export function getCountyCoords(county: string): [number, number] | null {
  return COUNTY_CENTERS[county] ?? null;
}

export function haversineKm(
  lat1: number, lng1: number, lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Estimate road distance: straight-line × 1.35 (typical Romania road factor)
export function approxRoadKm(fromCity: string, toCity: string): number | null {
  const c1 = getCityCoords(fromCity);
  const c2 = getCityCoords(toCity);
  if (!c1 || !c2) return null;
  const aerial = haversineKm(c1[0], c1[1], c2[0], c2[1]);
  return Math.round(aerial * 1.35);
}

// Get coords for a city, with county center fallback
export function resolveCoords(city: string, county?: string): [number, number] | null {
  const cityCoords = getCityCoords(city);
  if (cityCoords) return cityCoords;
  if (county) return getCountyCoords(county) ?? null;
  return null;
}
