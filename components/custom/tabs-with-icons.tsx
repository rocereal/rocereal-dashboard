"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITab } from "@/data/ai";
import { ReactNode } from "react";
import * as Icons from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface TabsWithIconsProps {
  tabs: AITab[];
  defaultValue?: string;
  className?: string;
  grid?: string;
  variant?: "default" | "underline";
  children?: ReactNode;
  onValueChange?: (value: string) => void;
}

export function TabsWithIcons({
  tabs,
  defaultValue,
  variant = "default",
  children,
  className,
  grid,
  onValueChange,
}: TabsWithIconsProps) {
  if (variant === "underline") {
    return (
      <TabsPrimitive.Root
        defaultValue={defaultValue || tabs[0]?.id}
        onValueChange={onValueChange}
        className={cn(className, "w-full")}
      >
        <TabsPrimitive.List
          className={cn(grid, "border-b border-border w-full")}
        >
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = (Icons as any)[tab.iconName];
              return (
                <TabsPrimitive.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "flex items-center space-x-2 border-b-2 border-transparent pb-3 pt-2 font-medium text-muted-background hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
                  )}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsPrimitive.Trigger>
              );
            })}
          </div>
        </TabsPrimitive.List>
        {children}
      </TabsPrimitive.Root>
    );
  }

  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.id}
      onValueChange={onValueChange}
      className={cn(className, "w-full")}
    >
      <TabsList className={cn(grid, "grid w-full grid-cols-4")}>
        {tabs.map((tab) => {
          const IconComponent = (Icons as any)[tab.iconName];
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center space-x-2"
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      {children}
    </Tabs>
  );
}
