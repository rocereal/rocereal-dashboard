// =============================================
// DUMMY DATA pentru Dashboard-ul Financiar
// =============================================

export const topAgenti = [
  { name: "Daniela Ionescu", procent: 119, avatar: "DI" },
  { name: "Carmen Mihai", procent: 107, avatar: "CM" },
  { name: "Eric Popescu", procent: 106, avatar: "EP" },
  { name: "Andrei Stan", procent: 98, avatar: "AS" },
  { name: "Maria Stoica", procent: 91, avatar: "MS" },
];

export const prognozaOwnerData = [
  { name: "Jeffrey Jones", valoare: 1050000 },
  { name: "Daniela Ionescu", valoare: 820000 },
  { name: "John Smith", valoare: 510000 },
  { name: "Raphael D.", valoare: 280000 },
];

export const profitabilitateCanalData = [
  { canal: "Facebook", profitBrut: 25760, cost: 7850, roas: 3.28 },
  { canal: "Google",   profitBrut: 45840, cost: 10450, roas: 4.39 },
  { canal: "TikTok",  profitBrut: 21360, cost: 6450,  roas: 3.31 },
];

export const prognozaTrimestru = [
  { luna: "Ian 2024", actual: 950000, prognoza: 0 },
  { luna: "Feb 2024", actual: 1100000, prognoza: 0 },
  { luna: "Mar 2024", actual: 0, prognoza: 280000 },
];

export const cereriDeschise = [
  { data: "19.03.2024", companie: "Tractor Inc.", valoare: 250000 },
  { data: "19.03.2024", companie: "Tractor Inc.", valoare: 250000 },
  { data: "19.03.2024", companie: "Tractor Inc.", valoare: 250000 },
  { data: "19.03.2024", companie: "Tractor Inc.", valoare: 250000 },
  { data: "19.03.2024", companie: "Tractor Inc.", valoare: 250000 },
];

export const vanzariDupaMotiv = [
  { name: "Pret", value: 2400000, color: "#0e7490" },
  { name: "Solutie", value: 734000, color: "#14b8a6" },
  { name: "Personalitate", value: 420000, color: "#f97316" },
  { name: "Performanta", value: 180000, color: "#94a3b8" },
];

export const vanzariDupaSursa = [
  { name: "Website", value: 2400000, color: "#0e7490" },
  { name: "Prospectare", value: 734000, color: "#14b8a6" },
  { name: "Evenimente", value: 420000, color: "#f97316" },
  { name: "Lead cumparat", value: 180000, color: "#94a3b8" },
];

export const financiarMetrics = [
  { label: "Vandut luna aceasta", valoare: "2M EUR", trend: "+12%", pozitiv: true },
  { label: "Pipeline activ", valoare: "8.4M EUR", trend: "+5%", pozitiv: true },
  { label: "Rata conversie", valoare: "36%", trend: "-2%", pozitiv: false },
  { label: "Activitati restante", valoare: "11", trend: "Trebuie: 0", pozitiv: false },
];
