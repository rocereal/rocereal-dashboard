"use client";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (url: string) => {
    router.push(url);
    setIsOpen(false);
  };

  const hasItems = item.items && item.items.length > 0;
  const isItemActive = item.url
    ? pathname === item.url || item.isActive
    : false;

  if (hasItems) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 px-3 hover:bg-accent hover:text-accent-foreground",
              isItemActive && "bg-accent text-accent-foreground"
            )}
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            {item.title}
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 flex flex-col"
          sideOffset={depth > 0 ? 2 : 4}
          alignOffset={depth > 0 ? -2 : 0}
        >
          {item.items!.map((subItem, subIndex) => (
            <NavItem key={subIndex} item={subItem} depth={depth + 1} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (item.url) {
    // For top-level items with URLs, render as regular button
    if (depth === 0) {
      return (
        <Link href={item.url!}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 px-3 hover:bg-accent hover:text-accent-foreground",
              isItemActive && "bg-accent text-accent-foreground"
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
        <DropdownMenuItem asChild className="w-full cursor-pointer">
          <Link
            href={item.url!}
            className={cn(
              "flex items-center w-full px-2 py-2 text-sm",
              isItemActive && "bg-accent text-accent-foreground"
            )}
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span className="flex-1">{item.title}</span>
          </Link>
        </DropdownMenuItem>
      );
    }
  }

  return null;
}

export function HeaderNav({ items }: HeaderNavProps) {
  return (
    <div className="flex items-center space-x-1">
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
