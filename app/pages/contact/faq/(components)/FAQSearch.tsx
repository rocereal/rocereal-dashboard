/**
 * FAQ Search Component
 * Search input field for filtering FAQ questions and answers
 * Provides real-time search functionality with search icon
 * Used in FAQ pages to help users find relevant information quickly
 * @param searchTerm - Current search term value
 * @param onSearchChange - Callback function called when search term changes
 * @returns JSX element representing the FAQ search input
 */

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FAQSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

/**
 * FAQSearch component for filtering FAQ content
 * Renders search input with icon for real-time FAQ filtering
 * Provides user-friendly interface for finding specific questions
 * @param searchTerm - The current search term entered by the user
 * @param onSearchChange - Function called when search term changes
 * @returns JSX element representing the search input field
 */
export default function FAQSearch({
  searchTerm,
  onSearchChange,
}: FAQSearchProps) {
  return (
    <div className="max-w-md mx-auto mb-12">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
