"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card dark:bg-card">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={
            theme === "light"
              ? "bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
              : "bg-transparent cursor-pointer hover:!bg-secondary hover:dark:!text-white"
          }
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={
            theme === "dark"
              ? "bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
              : "bg-transparent cursor-pointer hover:!bg-secondary hover:dark:!text-white"
          }
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className={
            theme === "system"
              ? "bg-transparent cursor-pointer hover:!bg-secondary/50 hover:dark:!text-white"
              : "bg-transparent cursor-pointer hover:!bg-secondary hover:dark:!text-white"
          }
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
