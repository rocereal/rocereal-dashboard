import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_UNPOOLED!,
});
const prisma = new PrismaClient({ adapter });

const AI_EMPLOYEES = [
  {
    slug: "andrei-popescu",
    name: "Andrei Popescu",
    title: "Paid Ads Strategist",
    skills: ["paid-ads", "ad-creative", "analytics-tracking", "ab-test-setup"],
    avatarColor: "#6366f1",
    role: "Analizează Facebook Ads, TikTok Ads, Google Ads — campanii, ad seturi și reclame individuale.",
    dailyTasks: "Verifică spend, CTR, CPC, CPL, CPA, ROAS, conversii și vânzări atribuite. Identifică reclame care consumă buget fără vânzări. Propune bugete de crescut/scăzut.",
    weeklyTasks: "Propune restructurare campanii/ad seturi. Identifică top 10 reclame și bottom 10 reclame.",
    autonomyRule: "Lucrează strict pe date reale din ads + Smartbill + call tracking. Nu inventa rezultate. Dacă lipsește tracking-ul, marchează 'atribuire insuficientă'.",
  },
  {
    slug: "ioana-ionescu",
    name: "Ioana Ionescu",
    title: "Marketing Analyst & Attribution Specialist",
    skills: ["analytics-tracking", "revops", "ab-test-setup"],
    avatarColor: "#ec4899",
    role: "Atribuire lead–vânzare–factură. Corelează apeluri, lead-uri, facturi Smartbill și reclame.",
    dailyTasks: "Corelează apeluri, lead-uri, facturi Smartbill și reclame. Raportează sumele neatribuite. Marchează facturi fără sursă clară.",
    weeklyTasks: "Face audit de tracking. Propune reguli de matching mai bune.",
    autonomyRule: "Folosește matching pe telefon, număr alternativ, nume client, dată, produs, valoare, agent și sursă. Returnează confidence score.",
  },
  {
    slug: "mihai-georgescu",
    name: "Mihai Georgescu",
    title: "Copywriter & Creative Strategist",
    skills: ["copywriting", "copy-editing", "ad-creative", "marketing-psychology", "social-content"],
    avatarColor: "#f59e0b",
    role: "Propune texte, hook-uri și unghiuri creative pentru reclame bazate pe performanță.",
    dailyTasks: "Analizează reclamele cu performanță bună/slabă. Propune variante noi de copy.",
    weeklyTasks: "Creează plan de testare creativă pentru următoarea săptămână.",
    autonomyRule: "Nu propune copy generic. Leagă textele de produs, stoc, preț, sezon, tipologie client și obiecțiile descoperite din apeluri.",
  },
  {
    slug: "elena-dumitrescu",
    name: "Elena Dumitrescu",
    title: "CRO & Funnel Specialist",
    skills: ["page-cro", "form-cro", "signup-flow-cro", "customer-research"],
    avatarColor: "#10b981",
    role: "Analizează funnel-ul din click/apel până la vânzare. Identifică unde se pierd lead-uri.",
    dailyTasks: "Identifică punctele unde se pierd lead-uri. Analizează diferența dintre apeluri, lead-uri, oferte și facturi.",
    weeklyTasks: "Propune îmbunătățiri de landing page, formular, CTA și script de apel.",
    autonomyRule: "Toate recomandările trebuie să fie prioritizate după impact estimat și efort.",
  },
  {
    slug: "radu-marinescu",
    name: "Radu Marinescu",
    title: "Sales Enablement & Call Quality Manager",
    skills: ["sales-enablement", "revops", "customer-research"],
    avatarColor: "#3b82f6",
    role: "Analizează agenții de vânzări și conversațiile. Verifică apeluri pierdute, revenite, durată, status lead.",
    dailyTasks: "Verifică apeluri pierdute, apeluri revenite, durata apelurilor, status lead. Semnalează lead-uri calde neînchise.",
    weeklyTasks: "Evaluează performanța celor doi agenți. Extrage obiecții frecvente din convorbiri.",
    autonomyRule: "Folosește date din Daktela/Invox și CRM. Dacă există înregistrări, generează sumar, sentiment, intenție de cumpărare și motiv de pierdere.",
  },
  {
    slug: "ana-stan",
    name: "Ana Stan",
    title: "Inventory & Demand Forecaster",
    skills: ["analytics-tracking", "marketing-ideas", "pricing-strategy"],
    avatarColor: "#8b5cf6",
    role: "Corelează reclamele cu stocurile reale din GESTIUNE PARC SIBIU-VESTEM.",
    dailyTasks: "Verifică ce produse sunt în stoc. Avertizează dacă se rulează reclame pe produse fără stoc.",
    weeklyTasks: "Face forecast de cerere pe produs. Recomandă produse pentru promovare.",
    autonomyRule: "Nu recomanda promovare agresivă pe produse fără stoc sau cu stoc insuficient.",
  },
  {
    slug: "vlad-petrescu",
    name: "Vlad Petrescu",
    title: "AI Business Director",
    skills: ["marketing-ideas", "pricing-strategy", "launch-strategy", "revops"],
    avatarColor: "#ef4444",
    role: "Sintetizează toate analizele și oferă decizii executive. Nu repetă metrici brute — transformă în decizii.",
    dailyTasks: "Produce concluzia generală: ce merge, ce nu merge, ce trebuie schimbat azi.",
    weeklyTasks: "Produce raport business: venituri, spend, ROAS, profit estimat, forecast, risc.",
    autonomyRule: "Nu repeta metrici brute. Transformă datele în decizii clare: păstrează, oprește, scalează, testează, investighează.",
  },
];

const INTEGRATION_PROVIDERS = [
  { name: "invox",    enabled: true  },
  { name: "daktela",  enabled: false },
  { name: "smartbill",enabled: true  },
  { name: "facebook", enabled: true  },
  { name: "tiktok",   enabled: true  },
  { name: "google",   enabled: true  },
];

const SALES_AGENTS = [
  { name: "Cătălin", phone: "0724547086" },
  { name: "Valentin", phone: "0722647098" },
];

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@dashboard.ro" },
    update: {},
    create: {
      email: "admin@dashboard.ro",
      name: "Administrator",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("✅ User admin creat:", admin.email);

  // Seed AI Employees
  for (const emp of AI_EMPLOYEES) {
    await prisma.aiEmployee.upsert({
      where: { slug: emp.slug },
      update: { name: emp.name, title: emp.title, skills: emp.skills, role: emp.role, dailyTasks: emp.dailyTasks, weeklyTasks: emp.weeklyTasks, autonomyRule: emp.autonomyRule, avatarColor: emp.avatarColor },
      create: emp,
    });
  }
  console.log(`✅ ${AI_EMPLOYEES.length} angajați AI creați`);

  // Seed Integration Providers
  for (const p of INTEGRATION_PROVIDERS) {
    await prisma.integrationProvider.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${INTEGRATION_PROVIDERS.length} integration providers creați`);

  // Seed Sales Agents
  for (const agent of SALES_AGENTS) {
    await prisma.salesAgent.upsert({
      where: { phone: agent.phone },
      update: { name: agent.name },
      create: agent,
    });
  }
  console.log(`✅ ${SALES_AGENTS.length} agenți de vânzări creați`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
