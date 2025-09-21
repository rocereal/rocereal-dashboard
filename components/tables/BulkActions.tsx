import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface BulkActionsProps {
  selectedItems: any[];
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
  onExport?: () => void;
  itemName: string;
}

export function BulkActions({
  selectedItems,
  isAllSelected,
  onSelectAll,
  onBulkDelete,
  onExport,
  itemName,
}: BulkActionsProps) {
  return (
    <>
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-secondary border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">
                  {selectedItems.length} {itemName}
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={onBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
