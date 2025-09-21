"use client";

import { useState } from "react";
import { faqData } from "@/data/faq";
import FAQHeader from "./(components)/FAQHeader";
import FAQSearch from "./(components)/FAQSearch";
import FAQAccordion from "./(components)/FAQAccordion";
import FAQContactCTA from "./(components)/FAQContactCTA";
import Header from "../(components)/ContactHeader";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

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
