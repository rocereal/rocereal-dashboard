import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FAQSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

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
