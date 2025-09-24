/**
 * Invoice Items Section Component
 * Dynamic form section for managing invoice line items in invoice creation
 * Provides functionality to add, edit, and remove invoice items with automatic calculations
 * Displays item details, quantities, prices, tax, and amounts with running totals
 * Used in invoice creation workflow for itemized billing
 * @param items - Array of invoice item objects with description, units, price, tax, and amount
 * @param subtotal - Calculated subtotal of all items before tax
 * @param tax - Calculated total tax amount for all items
 * @param total - Calculated grand total including tax
 * @param onAddItem - Callback function to add a new item to the invoice
 * @param onUpdateItem - Callback function to update an existing item field
 * @param onRemoveItem - Callback function to remove an item from the invoice
 * @returns JSX element representing the invoice items management section
 */

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceItem {
  description: string;
  units: number;
  price: number;
  tax: number;
  amount: number;
}

interface InvoiceItemsSectionProps {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  onAddItem: () => void;
  onUpdateItem: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemoveItem: (index: number) => void;
}

/**
 * InvoiceItemsSection component for managing invoice line items
 * Renders dynamic form for adding/editing invoice items with automatic calculations
 * Displays itemized billing with descriptions, quantities, pricing, and totals
 * Provides add/remove functionality for comprehensive invoice item management
 * @param items - Array of current invoice items
 * @param subtotal - Current subtotal value
 * @param tax - Current tax total value
 * @param total - Current grand total value
 * @param onAddItem - Function called to add new item
 * @param onUpdateItem - Function called to update item field
 * @param onRemoveItem - Function called to remove item
 * @returns JSX element representing the invoice items section
 */
export function InvoiceItemsSection({
  items,
  subtotal,
  tax,
  total,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: InvoiceItemsSectionProps) {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between py-4">
        <h3 className="text-lg font-semibold w-full lg:w-fit">Invoice Items</h3>
        <Button
          type="button"
          onClick={onAddItem}
          size="sm"
          className="w-full lg:w-fit"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No items added yet. Click &quot;Add Item&quot; to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border-0 lg:border rounded-lg p-0 lg:p-4"
            >
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    onUpdateItem(index, "description", e.target.value)
                  }
                  placeholder="Item description"
                  required
                />
              </div>
              <div>
                <Label>Units</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.units}
                  onChange={(e) =>
                    onUpdateItem(
                      index,
                      "units",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    onUpdateItem(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  required
                />
              </div>
              <div>
                <Label>Tax</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.tax.toFixed(2)}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={item.amount.toFixed(2)}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="flex justify-end pt-4">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold border-0  pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
