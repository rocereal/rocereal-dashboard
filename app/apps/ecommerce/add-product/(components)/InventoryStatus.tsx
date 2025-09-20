"use client";

interface InventoryStatusProps {
  productData: {
    stock: string;
    lowStockThreshold: string;
    trackInventory: boolean;
    allowBackorders: boolean;
  };
}

export function InventoryStatus({ productData }: InventoryStatusProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h5 className="text-sm font-medium mb-2">Inventory Status</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Current Stock:</span>
          <div className="font-medium">{productData.stock || "0"} units</div>
        </div>
        <div>
          <span className="text-muted-foreground">Low Stock Alert:</span>
          <div className="font-medium">
            {productData.lowStockThreshold
              ? `${productData.lowStockThreshold} units`
              : "Not set"}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Tracking:</span>
          <div className="font-medium">
            {productData.trackInventory ? "Enabled" : "Disabled"}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Backorders:</span>
          <div className="font-medium">
            {productData.allowBackorders ? "Allowed" : "Not allowed"}
          </div>
        </div>
      </div>
    </div>
  );
}
