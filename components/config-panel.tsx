"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme-provider";
import { useLayoutConfig } from "@/lib/layout-config";
import { FloatingConfigButton } from "./floating-config-button";
import { Moon, Sun, Monitor, RotateCcw, X } from "lucide-react";

export function ConfigPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { config, updateConfig, resetConfig } = useLayoutConfig();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const handleLayoutChange = (key: keyof typeof config, value: any) => {
    updateConfig({ [key]: value });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <FloatingConfigButton onClick={() => setIsOpen(true)} isOpen={isOpen} />
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex items-center gap-2">
              <span>Configuration</span>
            </AlertDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Theme Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("light")}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("dark")}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("system")}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          <Separator />

          {/* Color Theme Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Color Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={config.colorTheme === "teal" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLayoutChange("colorTheme", "teal")}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                Teal
              </Button>
              <Button
                variant={config.colorTheme === "blue" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLayoutChange("colorTheme", "blue")}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Blue
              </Button>
              <Button
                variant={config.colorTheme === "orange" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLayoutChange("colorTheme", "orange")}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                Orange
              </Button>
              <Button
                variant={
                  config.colorTheme === "neutral" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleLayoutChange("colorTheme", "neutral")}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                Neutral
              </Button>
              <Button
                variant={config.colorTheme === "green" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLayoutChange("colorTheme", "green")}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                Green
              </Button>
            </div>
          </div>

          <Separator />

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={() => {
              resetConfig(); // Reset layout config
              setTheme("system"); // Reset theme to system default
            }}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
