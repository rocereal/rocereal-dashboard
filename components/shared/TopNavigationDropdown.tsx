"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Calendar,
  Mail,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  BookOpen,
  TrendingUp,
  ChevronDown,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationGroups = [
  {
    label: "Main",
    items: [
      {
        id: "home",
        label: "Home",
        icon: Home,
        href: "/",
        badge: null,
      },
      {
        id: "dashboard",
        label: "Dashboard",
        icon: BarChart3,
        href: "/dashboard",
        badge: null,
      },
    ],
  },
  {
    label: "Applications",
    items: [
      {
        id: "calendar",
        label: "Calendar",
        icon: Calendar,
        href: "/apps/calendar",
        badge: null,
      },
      {
        id: "tasks",
        label: "Tasks",
        icon: FileText,
        href: "/apps/tasks",
        badge: "12",
      },
      {
        id: "files",
        label: "Files",
        icon: FileText,
        href: "/apps/files",
        badge: null,
      },
      {
        id: "messenger",
        label: "Messenger",
        icon: MessageSquare,
        href: "/apps/messenger",
        badge: "3",
      },
      {
        id: "email",
        label: "Email",
        icon: Mail,
        href: "/apps/email",
        badge: "5",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        id: "crm",
        label: "CRM",
        icon: Users,
        href: "/(dashboards)/crm",
        badge: null,
      },
      {
        id: "crypto",
        label: "Crypto",
        icon: TrendingUp,
        href: "/(dashboards)/crypto",
        badge: null,
      },
      {
        id: "ecommerce",
        label: "E-commerce",
        icon: ShoppingCart,
        href: "/(dashboards)/ecommerce",
        badge: null,
      },
      {
        id: "finance",
        label: "Finance",
        icon: CreditCard,
        href: "/(dashboards)/finance",
        badge: null,
      },
      {
        id: "education",
        label: "Education",
        icon: BookOpen,
        href: "/(dashboards)/education",
        badge: null,
      },
    ],
  },
];

export function TopNavigationDropdown() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active item based on current pathname
  const getActiveItem = () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (item.href === "/") {
          if (pathname === "/") return item.id;
        } else if (pathname.startsWith(item.href)) {
          return item.id;
        }
      }
    }
    return null;
  };

  const activeItem = getActiveItem();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center space-x-4">
          {navigationGroups.map((group, groupIndex) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 h-8 px-3"
                >
                  <span className="hidden sm:inline">{group.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {group.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  const isActive = activeItem === item.id;

                  return (
                    <div key={item.id}>
                      <DropdownMenuItem
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-4 w-4 flex items-center justify-center p-0 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      {itemIndex < group.items.length - 1 && (
                        <DropdownMenuSeparator />
                      )}
                    </div>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          {/* Settings - Always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation("/settings")}
            className="flex items-center gap-2 h-8 px-3 ml-auto"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
