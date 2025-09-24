"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function HeaderNav({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    isSection?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <div className="flex items-center space-x-1">
      {items.map((item, index) => {
        // Skip section headers for header navigation
        if (item.isSection) {
          return null;
        }

        const hasItems = item.items && item.items.length > 0;
        const isItemActive = item.url
          ? pathname === item.url || item.isActive
          : false;

        if (hasItems) {
          return (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 px-3",
                    isItemActive && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {item.items!.map((subItem, subIndex) => {
                  const isSubItemActive = pathname === subItem.url;
                  return (
                    <DropdownMenuItem
                      key={subIndex}
                      onClick={() => handleNavigation(subItem.url)}
                      className={cn(
                        "cursor-pointer",
                        isSubItemActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      {subItem.title}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        } else if (item.url) {
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.url!)}
              className={cn(
                "h-9 px-3",
                isItemActive && "bg-accent text-accent-foreground"
              )}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.title}
            </Button>
          );
        }

        return null;
      })}
    </div>
  );
}
