/**
 * FAQ Render Page Component
 * Main render component for the FAQ page combining search, accordion, and contact CTA
 * Provides searchable FAQ interface with filtering capabilities
 * Displays frequently asked questions in expandable accordion format
 * Includes contact call-to-action for additional support
 */

"use client";

import { faqData } from "@/data/faq";
import { useState } from "react";
import Header from "../(components)/ContactHeader";
import FAQAccordion from "./(components)/FAQAccordion";
import FAQContactCTA from "./(components)/FAQContactCTA";
import FAQSearch from "./(components)/FAQSearch";

/**
 * FAQPage component for rendering the complete FAQ interface
 * Combines search functionality, FAQ accordion, and contact CTA
 * Manages search state and filters FAQ data based on user input
 * @returns JSX element representing the full FAQ page layout
 */
export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  /**
   * Handles FAQ search functionality
   * Filters FAQ data based on search term matching questions and answers
   * @param term - The search term entered by the user
   */
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredFAQs(faqData);
    } else {
      const filtered = faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(term.toLowerCase()) ||
          faq.answer.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFAQs(filtered);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Header
          title=" Frequently Asked Questions"
          subtitle=" Find answers to common questions about our services. Can't find what
        you're looking for? Contact us."
        />
        <FAQSearch searchTerm={searchTerm} onSearchChange={handleSearch} />
        <FAQAccordion faqs={filteredFAQs} />
        <FAQContactCTA />
      </div>
    </div>
  );
}
