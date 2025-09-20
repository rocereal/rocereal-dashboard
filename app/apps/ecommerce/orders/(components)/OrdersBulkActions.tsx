"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2 } from "lucide-react";

interface OrdersBulkActionsProps {
  selectedOrders: string[];
  totalOrders: number;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
}

export function OrdersBulkActions({
  selectedOrders,
  totalOrders,
  onSelectAll,
  onBulkDelete,
  onBulkExport,
}: OrdersBulkActionsProps) {
  const isAllSelected =
    totalOrders > 0 && selectedOrders.length === totalOrders;
  const isIndeterminate =
    selectedOrders.length > 0 && selectedOrders.length < totalOrders;

  if (selectedOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">
              {selectedOrders.length} order
              {selectedOrders.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBulkExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
          <Button variant="destructive" size="sm" onClick={onBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
