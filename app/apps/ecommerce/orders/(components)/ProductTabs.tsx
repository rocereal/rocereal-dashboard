"use client";

import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Product,
  ProductPurchase,
  getProductPurchases,
} from "@/data/ecommerce";
import { ColumnDef } from "@tanstack/react-table";
import {
  BarChart3,
  Info,
  Package,
  Save,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";

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
function ProductOverviewTab({ product }: { product: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Image</h3>
          <div className="aspect-square max-w-sm rounded-lg overflow-hidden border">
            <img
              src={product.image.src || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-sm">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                SKU
              </label>
              <p className="text-sm">{product.sku}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <p className="text-sm">{product.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Price
              </label>
              <p className="text-lg font-semibold">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Stock
              </label>
              <p className="text-sm">{product.stock} units</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <p className="text-sm capitalize">
                {product.status.replace("-", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <Separator />

      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Created
            </label>
            <p className="text-sm">
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Last Updated
            </label>
            <p className="text-sm">
              {new Date(product.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductImagesTab({ product }: { product: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This tab would contain image upload and
          management functionality for product photos, thumbnails, and
          galleries.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-lg overflow-hidden border">
            <img
              src={product.image.src || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
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

function ProductEditTab({ product }: { product: any }) {
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price.toString(),
    stock: product.stock.toString(),
    status: product.status,
    description: product.description,
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
      description: product.description,
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
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Basic Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                type="text"
                placeholder="Enter SKU"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                  <SelectItem value="Sports & Fitness">
                    Sports & Fitness
                  </SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Home & Office">Home & Office</SelectItem>
                  <SelectItem value="Sports & Outdoors">
                    Sports & Outdoors
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-semibold">Pricing & Inventory</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-semibold">Description</h4>
        <Textarea
          placeholder="Enter product description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}

function ProductAnalyticsTab({ product }: { product: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Note:</strong> This tab would display sales analytics, views,
          conversion rates, and performance metrics for the product.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Views</span>
          </div>
          <div className="text-2xl font-bold mt-2">1,234</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Sales</span>
          </div>
          <div className="text-2xl font-bold mt-2">89</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">Conversion</span>
          </div>
          <div className="text-2xl font-bold mt-2">7.2%</div>
          <p className="text-xs text-muted-foreground">+2.1% from last month</p>
        </div>
      </div>
    </div>
  );
}

function ProductPurchasesTab({ product }: { product: any }) {
  const purchases = getProductPurchases(product.id);

  const columns: ColumnDef<ProductPurchase>[] = [
    createSortableColumn("customer", "Customer"),
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
  ];

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

function ProductSettingsTab({ product }: { product: any }) {
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
      {/* SEO Settings */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            SEO & Metadata
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure how your product appears in search engines and social
            media
          </p>
        </div>

        <div className="space-y-6">
          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle" className="flex items-center gap-2">
              Meta Title
              <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
            <Input
              id="metaTitle"
              type="text"
              placeholder="Enter meta title"
              value={seoData.metaTitle}
              onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
              maxLength={60}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <p>
                Appears in browser tabs, search results, and social media links.
                Keep it under 60 characters for best results.
              </p>
              <span>{seoData.metaTitle.length}/60</span>
            </div>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label
              htmlFor="metaDescription"
              className="flex items-center gap-2"
            >
              Meta Description
              <Info className="h-4 w-4 text-muted-foreground" />
            </Label>
            <Textarea
              id="metaDescription"
              placeholder="Enter meta description"
              value={seoData.metaDescription}
              onChange={(e) =>
                handleSeoChange("metaDescription", e.target.value)
              }
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <p>
                Appears under the title in search results. Write a compelling
                summary that encourages clicks. Keep it under 160 characters.
              </p>
              <span>{seoData.metaDescription.length}/160</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Settings */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Product Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure product behavior and visibility
          </p>
        </div>

        <div className="space-y-6">
          {/* Product Visibility */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Product Visibility</h4>
              <p className="text-sm text-muted-foreground">
                Control whether this product is visible to customers on your
                store
              </p>
            </div>
            <Switch
              checked={settings.visibility}
              onCheckedChange={(value) =>
                handleSettingChange("visibility", value)
              }
            />
          </div>

          {/* SEO Optimization */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">SEO Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Enable search engine optimization features for this product
              </p>
            </div>
            <Switch
              checked={settings.seoOptimization}
              onCheckedChange={(value) =>
                handleSettingChange("seoOptimization", value)
              }
            />
          </div>

          {/* Inventory Tracking */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Inventory Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Automatically track and update product stock levels
              </p>
            </div>
            <Switch
              checked={settings.inventoryTracking}
              onCheckedChange={(value) =>
                handleSettingChange("inventoryTracking", value)
              }
            />
          </div>

          {/* Low Stock Alerts */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Low Stock Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications when product stock is running low
              </p>
            </div>
            <Switch
              checked={settings.lowStockAlerts}
              onCheckedChange={(value) =>
                handleSettingChange("lowStockAlerts", value)
              }
            />
          </div>

          {/* Featured Product */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Featured Product</h4>
              <p className="text-sm text-muted-foreground">
                Display this product prominently on your homepage and featured
                sections
              </p>
            </div>
            <Switch
              checked={settings.featuredProduct}
              onCheckedChange={(value) =>
                handleSettingChange("featuredProduct", value)
              }
            />
          </div>

          {/* Allow Reviews */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h4 className="font-medium">Customer Reviews</h4>
              <p className="text-sm text-muted-foreground">
                Allow customers to leave reviews and ratings for this product
              </p>
            </div>
            <Switch
              checked={settings.allowReviews}
              onCheckedChange={(value) =>
                handleSettingChange("allowReviews", value)
              }
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 ">
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
