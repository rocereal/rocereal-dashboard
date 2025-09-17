"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingConfigButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingConfigButton({
  onClick,
  isOpen,
}: FloatingConfigButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
      aria-label="Open configuration panel"
    >
      <Settings
        className={`h-5 w-5 transition-transform duration-200 ${
          isOpen ? "rotate-90" : ""
        }`}
      />
    </Button>
  );
}
