"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const faqData = [
  {
    id: "item-1",
    question: "Cu ce tehnologii este construit Fisio?",
    answer:
      "Fisio este construit cu Next.js 15, React 19, TypeScript si Tailwind CSS 4. Include librarii moderne precum Radix UI pentru componente, TanStack Table pentru tabele de date, Recharts pentru vizualizari si Motion pentru animatii.",
  },
  {
    id: "item-2",
    question: "Este Fisio responsive si compatibil cu mobilul?",
    answer:
      "Da, Fisio este complet responsive si optimizat pentru toate dispozitivele, inclusiv telefoane mobile, tablete si desktop-uri. Toate componentele sunt construite cu principii de design mobile-first.",
  },
  {
    id: "item-3",
    question: "Suporta Fisio teme luminoase si intunecate?",
    answer:
      "Absolut! Fisio include atat modul luminos cat si cel intunecat. Utilizatorii pot comuta intre teme, iar template-ul adapteaza automat toate componentele si paginile la tema selectata.",
  },
  {
    id: "item-4",
    question: "Cate variante de dashboard include Fisio?",
    answer:
      "Fisio include 6 variante complete de dashboard: AI Analytics, CRM, Crypto, E-commerce, Educatie si Finante. Fiecare dashboard este complet functional cu grafice, tabele si functionalitati relevante.",
  },
  {
    id: "item-5",
    question: "Ce optiuni de autentificare sunt disponibile?",
    answer:
      "Fisio ofera 4 layout-uri diferite de autentificare: Centrat, Minimal, Splituit-Stanga si Splituit-Dreapta. Fiecare include pagini de login, inregistrare, parola uitata si resetare parola.",
  },
  {
    id: "item-6",
    question: "Codul este bine documentat si usor de personalizat?",
    answer:
      "Da, Fisio vine cu documentatie detaliata, structura de cod curata si suport TypeScript. Toate componentele sunt modulare si reutilizabile, facand personalizarea simpla pentru dezvoltatori.",
  },
  {
    id: "item-7",
    question: "Include Fisio grafice si vizualizare de date?",
    answer:
      "Da, Fisio include 8 tipuri diferite de grafice construite cu Recharts, inclusiv grafice cu bare, grafice liniare, grafice circulare, grafice radar si altele. Toate graficele sunt responsive si personalizabile.",
  },
  {
    id: "item-8",
    question: "Ce pagini si componente sunt incluse?",
    answer:
      "Fisio include 70+ pagini acoperind dashboard-uri, autentificare, setari, onboarding, e-commerce, management invatare, imobiliare si pagini utilitare. Plus 99 de componente reutilizabile pentru flexibilitate maxima.",
  },
  {
    id: "item-9",
    question: "Este Fisio optimizat pentru SEO si performanta?",
    answer:
      "Da, Fisio este construit cu Next.js pentru SEO si performanta optima. Include meta tag-uri corecte, HTML semantic, timpi de incarcare rapizi si respecta standardele de accesibilitate web.",
  },
  {
    id: "item-10",
    question: "Oferiti suport si actualizari?",
    answer:
      "Da, oferim suport dedicat si actualizari regulate. Template-ul include documentatie detaliata, iar echipa noastra de suport este disponibila pentru orice intrebari sau nevoi de personalizare.",
  },
];

interface FAQProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FAQ({
  title = "Intrebari Frecvente",
  description = "Gaseste raspunsuri la intrebarile frecvente despre template-ul de dashboard Fisio",
  className = "",
}: FAQProps) {
  return (
    <section className={`py-6 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col text-start py-8 gap-2">
          <h2 className="text-base lg:text-4xl font-bold">{title}</h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="px-6">
            <Accordion
              type="single"
              collapsible
              className="w-full cursor-pointer"
            >
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b cursor-pointer"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-2 cursor-pointer">
                    <span className="font-medium text-base">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
