"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  isSection?: boolean;
  items?: MenuItem[];
};

interface HeaderNavProps {
  items: MenuItem[];
}

function NavItem({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const hasItems = item.items && item.items.length > 0;
  const isItemActive = item.url
    ? pathname === item.url || item.isActive
    : false;

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  if (hasItems) {
    // Top-level dropdown
    if (depth === 0) {
      return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 px-3 hover:bg-accent dark:hover:bg-secondary hover:text-accent-foreground focus:ring-0 focus:outline-none ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none",
                  isItemActive &&
                    "bg-secondary dark:hover:bg-secondary hover:bg-secondary dark:text-white"
                )}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {item.title}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72" sideOffset={4}>
              {item.items!.map((subItem, subIndex) => (
                <NavItem key={subIndex} item={subItem} depth={depth + 1} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    } else {
      // Nested submenu
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center w-full px-2 py-2 text-sm cursor-pointer focus:ring-0 focus:outline-none ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none">
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span className="flex-1">{item.title}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-72">
            {item.items!.map((subItem, subIndex) => (
              <NavItem key={subIndex} item={subItem} depth={depth + 1} />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }
  } else if (item.url) {
    // For top-level items with URLs, render as regular button
    if (depth === 0) {
      return (
        <Link href={item.url!}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 px-3 hover:bg-accent dark:secondary dark:hover:bg-secondary hover:text-accent-foreground focus:ring-0 focus:outline-none ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none",
              isItemActive &&
                "bg-secondary dark:hover:bg-secondary hover:bg-secondary dark:text-white"
            )}
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.title}
          </Button>
        </Link>
      );
    } else {
      // For nested items with URLs, render as DropdownMenuItem directly
      return (
        <DropdownMenuItem
          asChild
          className="w-full cursor-pointer focus:ring-0 focus:outline-none ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none"
        >
          <Link
            href={item.url!}
            className={cn(
              "flex items-center w-full px-2 py-2 text-sm focus:ring-0 focus:outline-none ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none",
              isItemActive &&
                "bg-secondary dark:hover:bg-secondary hover:bg-secondary dark:text-white"
            )}
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4 " />}
            <span className="flex-1">{item.title}</span>
          </Link>
        </DropdownMenuItem>
      );
    }
  }

  return null;
}

export function HeaderNav({ items }: HeaderNavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center space-x-1 transition-opacity duration-200",
        mounted ? "opacity-100" : "opacity-0"
      )}
    >
      {items.map((item, index) => {
        // Skip section headers for header navigation
        if (item.isSection) {
          return null;
        }
        return <NavItem key={index} item={item} />;
      })}
    </div>
  );
}
