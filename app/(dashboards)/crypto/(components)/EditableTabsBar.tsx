"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Pencil,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Tab {
  id: string;
  label: string;
}

interface EditableTabsBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onTabsChange: (tabs: Tab[]) => void;
}

export function EditableTabsBar({
  tabs,
  activeTab,
  onTabChange,
  onTabsChange,
}: EditableTabsBarProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  // Open rename dialog for active tab
  const openEdit = () => {
    const current = tabs.find((t) => t.id === activeTab);
    if (current) {
      setEditValue(current.label);
      setEditDialogOpen(true);
    }
  };

  useEffect(() => {
    if (editDialogOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editDialogOpen]);

  const saveEdit = () => {
    if (!editValue.trim()) return;
    onTabsChange(
      tabs.map((t) =>
        t.id === activeTab ? { ...t, label: editValue.trim() } : t
      )
    );
    setEditDialogOpen(false);
  };

  // Move active tab left
  const moveLeft = () => {
    if (activeIndex <= 0) return;
    const newTabs = [...tabs];
    [newTabs[activeIndex - 1], newTabs[activeIndex]] = [
      newTabs[activeIndex],
      newTabs[activeIndex - 1],
    ];
    onTabsChange(newTabs);
  };

  // Move active tab right
  const moveRight = () => {
    if (activeIndex >= tabs.length - 1) return;
    const newTabs = [...tabs];
    [newTabs[activeIndex], newTabs[activeIndex + 1]] = [
      newTabs[activeIndex + 1],
      newTabs[activeIndex],
    ];
    onTabsChange(newTabs);
  };

  return (
    <>
      <div className="flex items-center justify-between border-b">
        {/* Tab list */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap transition-colors
                  ${
                    isActive
                      ? "bg-muted rounded-t-md font-medium text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {tab.label}
                {!isActive && (
                  <Star className="h-3 w-3 opacity-40 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 pl-2 flex-shrink-0 pb-1">
          {/* Pencil – rename active tab */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={openEdit}
            title="Redenumeste tab-ul activ"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          {/* Three dots – reorder */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                title="Reordoneaza tab-urile"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Reordoneaza tab-urile
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={moveLeft}
                disabled={activeIndex <= 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Muta la stanga
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={moveRight}
                disabled={activeIndex >= tabs.length - 1}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Muta la dreapta
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Ordine curenta
              </DropdownMenuLabel>
              {tabs.map((tab, i) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`gap-2 text-xs ${
                    tab.id === activeTab ? "font-semibold text-primary" : ""
                  }`}
                >
                  <span className="text-muted-foreground w-4">{i + 1}.</span>
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Redenumeste tab-ul</DialogTitle>
          </DialogHeader>
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") setEditDialogOpen(false);
            }}
            placeholder="Nume tab..."
          />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(false)}
            >
              Anuleaza
            </Button>
            <Button size="sm" onClick={saveEdit}>
              Salveaza
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
