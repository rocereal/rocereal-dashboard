"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface InventorySettingsProps {
  productData: {
    trackInventory: boolean;
    allowBackorders: boolean;
  };
  onChange: (field: string, value: boolean) => void;
}

export function InventorySettings({
  productData,
  onChange,
}: InventorySettingsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Inventory Settings</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h5 className="font-medium">Track Inventory</h5>
            <p className="text-sm text-muted-foreground">
              Automatically track stock levels and quantities
            </p>
          </div>
          <Checkbox
            checked={productData.trackInventory}
            onCheckedChange={(value) =>
              onChange("trackInventory", value as boolean)
            }
            className="rounded"
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h5 className="font-medium">Allow Backorders</h5>
            <p className="text-sm text-muted-foreground">
              Allow customers to order products that are out of stock
            </p>
          </div>
          <Checkbox
            checked={productData.allowBackorders}
            onCheckedChange={(value) =>
              onChange("allowBackorders", value as boolean)
            }
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
}
