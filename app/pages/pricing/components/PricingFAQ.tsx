/**
 * Pricing FAQ Component
 * Frequently asked questions section for pricing and plan information
 * Displays expandable accordion interface with questions and answers
 * Provides comprehensive information about pricing, billing, and plan features
 * Used in pricing pages to address common customer concerns and objections
 * @param faqs - Array of FAQ objects containing questions and answers
 * @returns JSX element representing the pricing FAQ accordion section
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingFAQ } from "@/data/pricing-plans";

interface PricingFAQProps {
  faqs: PricingFAQ[];
}

/**
 * PricingFAQComponent for displaying frequently asked questions about pricing
 * Renders expandable accordion with questions and detailed answers
 * Provides comprehensive information to address customer concerns
 * Uses accordion UI for space-efficient FAQ presentation
 * @param faqs - Array of FAQ data with question and answer pairs
 * @returns JSX element representing the FAQ accordion section
 */
export function PricingFAQComponent({ faqs }: PricingFAQProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Everything you need to know about our pricing and plans
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
