"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 h-9 bg-secondary dark:bg-secondary"
      />
    </div>
  );
}
