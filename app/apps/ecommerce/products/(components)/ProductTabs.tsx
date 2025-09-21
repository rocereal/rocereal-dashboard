"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { BulkActions } from "@/components/tables/BulkActions";
import {
  Product,
  ProductPurchase,
  getProductPurchases,
} from "@/data/ecommerce";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Mail, MoreHorizontal, Save, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import {
  BasicInfoForm,
  DescriptionForm,
  PricingInventoryForm,
  ProductDetails,
  ProductMetadata,
  ProductSettings,
  SEOSettings,
} from "./index";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface productProps {
  product: Product;
}

export const ProductTabs: React.FC<productProps> = ({ product }) => {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      iconName: "Package",
      content: <ProductOverviewTab product={product} />,
    },
    {
      id: "edit",
      label: "Edit Details",
      iconName: "Edit",
      content: <ProductSettingsTab product={product} />,
    },
    {
      id: "images",
      label: "Images",
      iconName: "Image",
      content: <ProductImagesTab product={product} />,
    },
    {
      id: "purchases",
      label: "Recent Purchases",
      iconName: "ShoppingCart",
      content: <ProductPurchasesTab product={product} />,
    },
    {
      id: "settings",
      label: "Settings",
      iconName: "Settings",
      content: <ProductSettingsTab product={product} />,
    },
  ];

  return (
    <TabsWithIcons
      tabs={tabs}
      className="!w-full lg:!w-full border rounded-md p-8"
      grid="!grid !grid-cols-5"
    >
      <TabsContent value="overview" className="space-y-4 pt-4">
        <ProductOverviewTab product={product} />
      </TabsContent>

      <TabsContent value="edit" className="space-y-4 pt-4">
        <ProductEditTab product={product} />
      </TabsContent>

      <TabsContent value="images" className="space-y-4 pt-4">
        <ProductImagesTab product={product} />
      </TabsContent>

      <TabsContent value="purchases" className="space-y-4 pt-4">
        <ProductPurchasesTab product={product} />
      </TabsContent>

      <TabsContent value="settings" className="space-y-4 pt-4">
        <ProductSettingsTab product={product} />
      </TabsContent>
    </TabsWithIcons>
  );
};

// Tab Components
function ProductOverviewTab({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Image</h3>
          <div
            className={`aspect-square max-w-sm rounded-lg overflow-hidden border`}
          >
            <ImageComponentOptimized
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>
        </div>

        {/* Product Details */}
        <ProductDetails product={product} />
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <Separator />

      {/* Metadata */}
      <ProductMetadata product={product} />
    </div>
  );
}

function ProductImagesTab({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <Alert variant={"primary"}>
        <AlertDescription>
          <p className="text-sm">
            <strong>Note:</strong> This tab would contain image upload and
            management functionality for product photos, thumbnails, and
            galleries.
          </p>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-lg overflow-hidden border">
            <ImageComponentOptimized
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              {/* <Image className="h-8 w-8 mx-auto mb-2" /> */}
              <p className="text-xs">Add Image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductEditTab({ product }: { product: Product }) {
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price.toString(),
    stock: product.stock.toString(),
    status: product.status,
    description: product.description || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Saving product:", formData);
    // Here you would typically save the data to your backend
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      description: product.description || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Edit Product Details</h3>
          <p className="text-sm text-muted-foreground">
            Make changes to the product information below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInfoForm
          formData={{
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
          }}
          onChange={handleInputChange}
        />

        <PricingInventoryForm
          formData={{
            price: formData.price,
            stock: formData.stock,
            status: formData.status,
          }}
          onChange={handleInputChange}
        />
      </div>

      <DescriptionForm
        description={formData.description}
        onChange={(value) => handleInputChange("description", value)}
      />
    </div>
  );
}

function ProductPurchasesTab({ product }: { product: Product }) {
  const purchases = getProductPurchases(product.id);

  const columns: ColumnDef<ProductPurchase>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as string;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/avatars/${customer.toLowerCase().replace(" ", "-")}.jpg`}
                alt={customer}
              />
              <AvatarFallback>
                {customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{customer}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = row.getValue("quantity") as number;
        return <div className="font-medium">{quantity}</div>;
      },
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => {
        const price = row.getValue("unitPrice") as number;
        return <div className="font-medium">${price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total",
      cell: ({ row }) => {
        const total = row.getValue("totalPrice") as number;
        return <div className="font-semibold">${total.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ProductPurchase["status"];
        return (
          <Badge
            variant={
              status === "delivered"
                ? "default"
                : status === "shipped"
                ? "secondary"
                : status === "processing"
                ? "outline"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) => {
        const date = row.getValue("purchaseDate") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => {
        const orderId = row.getValue("orderId") as string;
        return (
          <div className="text-sm font-mono text-muted-foreground">
            {orderId}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const purchase = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(purchase.orderId)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View order details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Contact customer
              </DropdownMenuItem>
              <DropdownMenuItem>View customer profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Cancel order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const bulkActions = (selectedRows: ProductPurchase[], table: any) => (
    <BulkActions
      selectedItems={selectedRows}
      isAllSelected={table.getIsAllPageRowsSelected()}
      onSelectAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      onBulkDelete={() => {
        // For now, just clear selection. In a real app, you'd delete the selected items.
        table.setRowSelection({});
      }}
      onExport={() => {
        // Placeholder for export functionality
        console.log("Exporting selected purchases:", selectedRows);
      }}
      itemName="purchase"
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Purchases</h3>
          <p className="text-sm text-muted-foreground">
            Recent orders for {product.name}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{purchases.length}</div>
          <div className="text-sm text-muted-foreground">Total purchases</div>
        </div>
      </div>

      {purchases.length > 0 ? (
        <div className="bg-card rounded-lg border">
          <div className="p-6">
            <DataTable
              columns={columns}
              data={purchases}
              searchKey="customer"
              searchPlaceholder="Search purchases..."
              bulkActions={bulkActions}
            />
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">No purchases yet</h4>
          <p className="text-sm text-muted-foreground">
            This product hasn't been purchased yet. Purchases will appear here
            once customers start buying.
          </p>
        </div>
      )}
    </div>
  );
}

function ProductSettingsTab({ product }: { product: Product }) {
  const [settings, setSettings] = useState({
    visibility: true,
    seoOptimization: true,
    inventoryTracking: true,
    lowStockAlerts: true,
    featuredProduct: false,
    allowReviews: true,
  });

  const [seoData, setSeoData] = useState({
    metaTitle: product.name,
    metaDescription: product.description?.substring(0, 160) || "",
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSeoChange = (field: string, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", { settings, seoData });
    // Here you would typically save the settings to your backend
  };

  return (
    <div className="space-y-8">
      <SEOSettings seoData={seoData} onChange={handleSeoChange} />

      <Separator />

      <ProductSettings settings={settings} onChange={handleSettingChange} />

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
