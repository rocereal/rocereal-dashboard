"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
  collapsible: boolean;
}>({
  openItems: [],
  toggleItem: () => {},
  type: "single",
  collapsible: true,
});

const Accordion: React.FC<AccordionProps> = ({
  type = "single",
  collapsible = true,
  children,
  className,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (type === "single") {
        if (prev.includes(value)) {
          return collapsible ? [] : prev;
        }
        return [value];
      } else {
        if (prev.includes(value)) {
          return prev.filter((item) => item !== value);
        }
        return [...prev, value];
      }
    });
  };

  return (
    <AccordionContext.Provider
      value={{ openItems, toggleItem, type, collapsible }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  children,
  className,
}) => {
  return <div className={cn("border-b", className)}>{children}</div>;
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className,
  onClick,
}) => {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const value = React.useContext(AccordionItemContext);

  const isOpen = openItems.includes(value);

  const handleClick = () => {
    toggleItem(value);
    onClick?.();
  };

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline",
        className
      )}
      onClick={handleClick}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
};

const AccordionItemContext = React.createContext<string>("");

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
}) => {
  const { openItems } = React.useContext(AccordionContext);
  const value = React.useContext(AccordionItemContext);
  const isOpen = openItems.includes(value);

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
};

// Wrapper component to provide context
const AccordionItemWithContext: React.FC<AccordionItemProps> = ({
  value,
  children,
  className,
}) => {
  return (
    <AccordionItemContext.Provider value={value}>
      <AccordionItem value={value} className={className}>
        {children}
      </AccordionItem>
    </AccordionItemContext.Provider>
  );
};

export {
  Accordion,
  AccordionItemWithContext as AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
