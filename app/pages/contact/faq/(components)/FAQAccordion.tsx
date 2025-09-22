import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQItem } from "@/data/faq";

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {faqs.length > 0
              ? `${faqs.length} FAQ${faqs.length > 1 ? "s" : ""} found`
              : "No FAQs found"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faqs.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="w-full cursor-pointer"
            >
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No FAQs match your search. Try different keywords or contact us
                directly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
