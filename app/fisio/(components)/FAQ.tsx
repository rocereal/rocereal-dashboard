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
    question: "What technologies is Fisio built with?",
    answer:
      "Fisio is built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. It includes modern libraries like Radix UI for components, TanStack Table for data tables, Recharts for visualizations, and Motion for animations.",
  },
  {
    id: "item-2",
    question: "Is Fisio responsive and mobile-friendly?",
    answer:
      "Yes, Fisio is fully responsive and optimized for all devices including mobile phones, tablets, and desktops. All components are built with mobile-first design principles.",
  },
  {
    id: "item-3",
    question: "Does Fisio support light and dark themes?",
    answer:
      "Absolutely! Fisio includes both light and dark theme modes. Users can toggle between themes, and the template automatically adapts all components and pages to the selected theme.",
  },
  {
    id: "item-4",
    question: "How many dashboard variants does Fisio include?",
    answer:
      "Fisio includes 6 comprehensive dashboard variants: AI Analytics, CRM, Crypto, E-commerce, Education, and Finance dashboards. Each dashboard is fully functional with relevant charts, tables, and features.",
  },
  {
    id: "item-5",
    question: "What authentication options are available?",
    answer:
      "Fisio provides 4 different authentication layouts: Centered, Minimal, Split-Left, and Split-Right designs. Each includes login, register, forgot password, and reset password pages.",
  },
  {
    id: "item-6",
    question: "Is the code well-documented and easy to customize?",
    answer:
      "Yes, Fisio comes with detailed documentation, clean code structure, and TypeScript support. All components are modular and reusable, making customization straightforward for developers.",
  },
  {
    id: "item-7",
    question: "Does Fisio include charts and data visualization?",
    answer:
      "Yes, Fisio includes 8 different chart types built with Recharts, including bar charts, line charts, pie charts, radar charts, and more. All charts are responsive and customizable.",
  },
  {
    id: "item-8",
    question: "What pages and components are included?",
    answer:
      "Fisio includes 70+ pages covering dashboards, authentication, settings, onboarding, e-commerce, learning management, real estate, and utility pages. Plus 99 reusable components for maximum flexibility.",
  },
  {
    id: "item-9",
    question: "Is Fisio SEO-friendly and performant?",
    answer:
      "Yes, Fisio is built with Next.js for optimal SEO and performance. It includes proper meta tags, semantic HTML, fast loading times, and follows web accessibility standards.",
  },
  {
    id: "item-10",
    question: "Do you provide support and updates?",
    answer:
      "Yes, we provide dedicated support and regular updates. The template includes detailed documentation, and our support team is available to help with any questions or customization needs.",
  },
];

interface FAQProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FAQ({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about Fisio dashboard template",
  className = "",
}: FAQProps) {
  return (
    <section className={`py-6 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col text-start py-8 gap-2">
          <h2 className="text-base">{title}</h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

        <Card className="border shadow-none">
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
