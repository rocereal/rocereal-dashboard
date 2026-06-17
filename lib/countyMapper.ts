// Maps Romanian localities to their county (județ)

const LOCALITY_TO_COUNTY: Record<string, string> = {
  // Sibiu
  "sibiu": "Sibiu", "șelimbăr": "Sibiu", "selimbar": "Sibiu",
  "mediaș": "Sibiu", "medias": "Sibiu", "cisnădie": "Sibiu", "cisnadie": "Sibiu",
  "copșa mică": "Sibiu", "copsa mica": "Sibiu", "porumbacu": "Sibiu",
  "porumbacu de jos": "Sibiu", "porumbacu de sus": "Sibiu",
  "racovița": "Sibiu", "racovita": "Sibiu", "orlat": "Sibiu",
  "boița": "Sibiu", "boita": "Sibiu", "gura râului": "Sibiu", "gura raului": "Sibiu",
  "avrig": "Sibiu", "ocna sibiului": "Sibiu", "agnita": "Sibiu",
  "dumbrăveni": "Sibiu", "dumbraveni": "Sibiu", "talmaciu": "Sibiu", "tălmaciu": "Sibiu",
  "cristian": "Sibiu", "poplaca": "Sibiu", "rășinari": "Sibiu", "rasinari": "Sibiu",
  "sadu": "Sibiu", "cârța": "Sibiu", "carta": "Sibiu",
  "vestem": "Sibiu", "șura mare": "Sibiu", "sura mare": "Sibiu",
  "șura mică": "Sibiu", "sura mica": "Sibiu",

  // Cluj
  "cluj": "Cluj", "cluj-napoca": "Cluj", "cluj napoca": "Cluj",
  "turda": "Cluj", "câmpia turzii": "Cluj", "campia turzii": "Cluj",
  "dej": "Cluj", "gherla": "Cluj", "huedin": "Cluj",
  "florești": "Cluj", "floresti": "Cluj", "baciu": "Cluj",
  "apahida": "Cluj", "colun": "Cluj",

  // București
  "bucurești": "București", "bucuresti": "București", "bucharest": "București",
  "ilfov": "Ilfov", "voluntari": "Ilfov", "pipera": "Ilfov",
  "bragadiru": "Ilfov", "chitila": "Ilfov", "pantelimon": "Ilfov",

  // Alba
  "alba iulia": "Alba", "aiud": "Alba", "blaj": "Alba",
  "sebeș": "Alba", "sebes": "Alba", "cugir": "Alba",
  "câmpeni": "Alba", "campeni": "Alba", "zlatna": "Alba",
  "abrud": "Alba", "ocna mureș": "Alba", "ocna mures": "Alba",

  // Mureș
  "târgu mureș": "Mureș", "targu mures": "Mureș", "tg. mures": "Mureș",
  "sighișoara": "Mureș", "sighisoara": "Mureș", "reghin": "Mureș",
  "luduș": "Mureș", "ludus": "Mureș", "iernut": "Mureș",

  // Brașov
  "brașov": "Brașov", "brasov": "Brașov", "săcele": "Brașov", "sacele": "Brașov",
  "codlea": "Brașov", "râșnov": "Brașov", "rasnov": "Brașov",
  "zărnești": "Brașov", "zarnesti": "Brașov", "fagaras": "Brașov", "făgăraș": "Brașov",

  // Timiș
  "timișoara": "Timiș", "timisoara": "Timiș", "timișoata": "Timiș",
  "lugoj": "Timiș", "sânnicolau mare": "Timiș", "sannicolau mare": "Timiș",
  "jimbolia": "Timiș", "deta": "Timiș", "satchinez": "Timiș",
  "recaș": "Timiș", "recas": "Timiș",

  // Arad
  "arad": "Arad", "ineu": "Arad", "lipova": "Arad",
  "curtici": "Arad", "nădlac": "Arad", "nadlac": "Arad",

  // Hunedoara
  "deva": "Hunedoara", "hunedoara": "Hunedoara", "petrosani": "Hunedoara", "petroșani": "Hunedoara",
  "orăștie": "Hunedoara", "orastie": "Hunedoara", "brad": "Hunedoara",
  "vulcan": "Hunedoara", "lupeni": "Hunedoara",

  // Bacău
  "bacău": "Bacău", "bacau": "Bacău", "onești": "Bacău", "onesti": "Bacău",
  "moinești": "Bacău", "moinesti": "Bacău", "costache negri": "Galați",

  // Galați
  "galați": "Galați", "galati": "Galați", "tecuci": "Galați",

  // Iași
  "iași": "Iași", "iasi": "Iași", "pașcani": "Iași", "pascani": "Iași",

  // Prahova
  "ploiești": "Prahova", "ploiesti": "Prahova", "câmpina": "Prahova", "campina": "Prahova",

  // Dolj
  "craiova": "Dolj", "calafat": "Dolj",

  // Constanța
  "constanța": "Constanța", "constanta": "Constanța", "mangalia": "Constanța",

  // Argeș
  "pitești": "Argeș", "pitesti": "Argeș", "câmpulung": "Argeș", "campulung": "Argeș",
  "curtea de argeș": "Argeș", "curtea de arges": "Argeș",

  // Bihor
  "oradea": "Bihor", "beiuș": "Bihor", "beius": "Bihor",
  "marghita": "Bihor", "salonta": "Bihor",

  // Satu Mare
  "satu mare": "Satu Mare", "carei": "Satu Mare",

  // Maramureș
  "baia mare": "Maramureș", "sighetu marmației": "Maramureș",
  "sighetul marmației": "Maramureș",

  // Bistrița-Năsăud
  "bistrița": "Bistrița-Năsăud", "bistrita": "Bistrița-Năsăud",
  "năsăud": "Bistrița-Năsăud", "nasaud": "Bistrița-Năsăud",

  // Neamț
  "piatra neamț": "Neamț", "piatra neamt": "Neamț",
  "roman": "Neamț", "tg. neamț": "Neamț",

  // Suceava
  "suceava": "Suceava", "fălticeni": "Suceava", "falticeni": "Suceava",
  "rădăuți": "Suceava", "radauti": "Suceava",

  // Vrancea
  "focșani": "Vrancea", "focsani": "Vrancea",

  // Buzău
  "buzău": "Buzău", "buzau": "Buzău",

  // Dâmbovița
  "târgoviște": "Dâmbovița", "targoviste": "Dâmbovița",

  // Giurgiu
  "giurgiu": "Giurgiu",

  // Teleorman
  "alexandria": "Teleorman", "turnu măgurele": "Teleorman",

  // Olt
  "slatina": "Olt", "caracal": "Olt",

  // Vâlcea
  "râmnicu vâlcea": "Vâlcea", "ramnicu valcea": "Vâlcea", "rm. vâlcea": "Vâlcea",

  // Gorj
  "târgu jiu": "Gorj", "targu jiu": "Gorj",

  // Mehedinți
  "drobeta-turnu severin": "Mehedinți", "turnu severin": "Mehedinți",

  // Caraș-Severin
  "reșița": "Caraș-Severin", "resita": "Caraș-Severin",
  "caransebeș": "Caraș-Severin", "caransebes": "Caraș-Severin",

  // Posoloaca (special mapping)
  "posoloaca": "Bacău",
};

export function detectCounty(locality: string): string {
  if (!locality) return "Necunoscut";
  const normalized = locality.toLowerCase().trim();

  // Direct match
  const direct = LOCALITY_TO_COUNTY[normalized];
  if (direct) return direct;

  // Partial match — check if any known locality is contained in the input
  for (const [key, county] of Object.entries(LOCALITY_TO_COUNTY)) {
    if (normalized.includes(key) || key.includes(normalized)) return county;
  }

  return "Necunoscut";
}

// County coordinates for map markers (approx center of each county)
export const COUNTY_CENTERS: Record<string, [number, number]> = {
  "Alba": [46.07, 23.58], "Arad": [46.17, 21.31], "Argeș": [44.85, 24.87],
  "Bacău": [46.57, 26.91], "Bihor": [47.05, 22.00], "Bistrița-Năsăud": [47.13, 24.50],
  "Botoșani": [47.75, 26.67], "Brașov": [45.65, 25.61], "Brăila": [45.27, 27.96],
  "București": [44.43, 26.10], "Buzău": [45.15, 26.82], "Caraș-Severin": [45.30, 22.20],
  "Cluj": [46.77, 23.59], "Constanța": [44.18, 28.65], "Covasna": [45.87, 26.18],
  "Călărași": [44.20, 27.33], "Dâmbovița": [44.93, 25.46], "Dolj": [44.32, 23.80],
  "Galați": [45.45, 28.05], "Giurgiu": [43.90, 25.97], "Gorj": [44.95, 23.34],
  "Harghita": [46.35, 25.80], "Hunedoara": [45.71, 22.91], "Ialomița": [44.60, 27.37],
  "Iași": [47.16, 27.59], "Ilfov": [44.55, 26.20], "Maramureș": [47.66, 24.09],
  "Mehedinți": [44.63, 22.65], "Mureș": [46.54, 24.56], "Neamț": [46.93, 26.37],
  "Olt": [44.43, 24.37], "Prahova": [45.13, 26.02], "Satu Mare": [47.79, 22.89],
  "Sălaj": [47.19, 23.06], "Sibiu": [45.80, 24.15], "Suceava": [47.63, 25.94],
  "Teleorman": [43.89, 25.14], "Timiș": [45.75, 21.22], "Tulcea": [45.18, 29.00],
  "Vâlcea": [45.10, 24.37], "Vaslui": [46.64, 27.73], "Vrancea": [45.70, 27.18],
};
