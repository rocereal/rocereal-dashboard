"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2 } from "lucide-react";

/**
 * Props for OrdersBulkActions component
 * @param selectedOrders - Array of selected order IDs
 * @param totalOrders - Total number of orders available
 * @param onSelectAll - Callback to select/deselect all orders
 * @param onBulkDelete - Callback to delete selected orders
 * @param onBulkExport - Callback to export selected orders
 */
interface OrdersBulkActionsProps {
  selectedOrders: string[];
  totalOrders: number;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: (selectedOrderIds: string[]) => void;
  onBulkExport: () => void;
}

/**
 * Orders Bulk Actions Component
 * Provides bulk operations for selected orders including export and delete
 * Shows selection count and select all checkbox when orders are selected
 * Only renders when there are selected orders
 * @param selectedOrders - Array of selected order IDs
 * @param totalOrders - Total number of orders available
 * @param onSelectAll - Callback to select/deselect all orders
 * @param onBulkDelete - Callback to delete selected orders
 * @param onBulkExport - Callback to export selected orders
 * @returns The JSX element representing the bulk actions bar or null if no selection
 */
export function OrdersBulkActions({
  selectedOrders,
  totalOrders,
  onSelectAll,
  onBulkDelete,
  onBulkExport,
}: OrdersBulkActionsProps) {
  const isAllSelected =
    totalOrders > 0 && selectedOrders.length === totalOrders;

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
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(selectedOrders)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
