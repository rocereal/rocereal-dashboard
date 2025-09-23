"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Product data structure for form management
 * Contains all fields required for product creation and editing
 */
interface ProductData {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: string;
  comparePrice: string;
  costPrice: string;
  taxRate: string;
  stock: string;
  lowStockThreshold: string;
  trackInventory: boolean;
  allowBackorders: boolean;
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  images: File[];
}

/**
 * Props for InventoryTab component
 * @param productData - The current product data state
 * @param setProductData - Function to update the product data state
 */
interface InventoryTabProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

/**
 * Inventory Tab Component
 * Manages product inventory settings and stock levels within the add product form
 * Includes stock quantity, low stock alerts, inventory tracking, and backorder settings
 * Displays real-time inventory status with color-coded indicators
 * @param productData - The current product data state
 * @param setProductData - Function to update the product data state
 * @returns The JSX element representing the inventory tab interface
 */
export function InventoryTab({
  productData,
  setProductData,
}: InventoryTabProps) {
  /**
   * Handle Input Change
   * Updates the product data state when form inputs change
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const stock = parseInt(productData.stock) || 0;
  const lowStockThreshold = parseInt(productData.lowStockThreshold) || 10;

  /**
   * Get Stock Status
   * Determines the current stock status based on quantity and threshold
   * @returns Object with status text and color class
   */
  const getStockStatus = () => {
    if (stock === 0) return { status: "Out of Stock", color: "text-red-600" };
    if (stock <= lowStockThreshold)
      return { status: "Low Stock", color: "text-yellow-600" };
    return { status: "In Stock", color: "text-green-600" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Management */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Stock Management</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Current Stock *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={productData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Number of units currently available
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                placeholder="10"
                value={productData.lowStockThreshold}
                onChange={(e) =>
                  handleInputChange("lowStockThreshold", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Alert when stock falls below this number
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Settings */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Inventory Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h5 className="font-medium">Track Inventory</h5>
                <p className="text-sm text-muted-foreground">
                  Automatically track and update product stock levels
                </p>
              </div>
              <Switch
                checked={productData.trackInventory}
                onCheckedChange={(value) =>
                  handleInputChange("trackInventory", value)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h5 className="font-medium">Allow Backorders</h5>
                <p className="text-sm text-muted-foreground">
                  Allow customers to order products that are out of stock
                </p>
              </div>
              <Switch
                checked={productData.allowBackorders}
                onCheckedChange={(value) =>
                  handleInputChange("allowBackorders", value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h4 className="text-md font-semibold mb-4">Inventory Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Stock</div>
            <div className="text-2xl font-bold">{stock}</div>
            <div className="text-xs text-muted-foreground">units available</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Stock Status</div>
            <div className={`text-lg font-medium ${stockStatus.color}`}>
              {stockStatus.status}
            </div>
            <div className="text-xs text-muted-foreground">
              {stock === 0
                ? "Product is unavailable"
                : stock <= lowStockThreshold
                ? `Low stock alert at ${lowStockThreshold}`
                : "Product is available"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Inventory Tracking
            </div>
            <div className="text-lg font-medium">
              {productData.trackInventory ? "Enabled" : "Disabled"}
            </div>
            <div className="text-xs text-muted-foreground">
              {productData.trackInventory
                ? "Stock levels are automatically updated"
                : "Stock levels are manually managed"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Backorders</div>
            <div className="text-lg font-medium">
              {productData.allowBackorders ? "Allowed" : "Not Allowed"}
            </div>
            <div className="text-xs text-muted-foreground">
              {productData.allowBackorders
                ? "Customers can order out-of-stock items"
                : "Out-of-stock items cannot be ordered"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Low Stock Alert</div>
            <div className="text-lg font-medium">{lowStockThreshold}</div>
            <div className="text-xs text-muted-foreground">
              Alert threshold for low inventory
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Availability</div>
            <div
              className={`text-lg font-medium ${
                stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock > 0 ? "Available" : "Unavailable"}
            </div>
            <div className="text-xs text-muted-foreground">
              {stock > 0
                ? "Product can be purchased"
                : productData.allowBackorders
                ? "Available for backorder"
                : "Cannot be purchased"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
