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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Invoice Items</h3>
        <Button type="button" onClick={onAddItem} size="sm">
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
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end p-4 border rounded-lg"
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
              <div className="flex gap-2">
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
              <div className="flex justify-between py-2 text-lg font-bold border-t pt-2">
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
