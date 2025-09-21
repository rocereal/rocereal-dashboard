"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Info, Plus, Save, Search, Upload, X } from "lucide-react";
import { useState } from "react";

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

interface TabProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

export default function AddProductForm() {
  const [productData, setProductData] = useState({
    // Information tab
    name: "",
    sku: "",
    category: "",
    description: "",

    // Pricing tab
    price: "",
    comparePrice: "",
    costPrice: "",
    taxRate: "",

    // Inventory tab
    stock: "",
    lowStockThreshold: "",
    trackInventory: true,
    allowBackorders: false,

    // SEO tab
    metaTitle: "",
    metaDescription: "",
    urlSlug: "",

    // Images tab
    images: [] as File[],
  });

  const tabs = [
    {
      id: "information",
      label: "Information",
      iconName: "Package",
      content: (
        <InformationTab
          productData={productData}
          setProductData={setProductData}
        />
      ),
    },
    {
      id: "images",
      label: "Product Images",
      iconName: "Image",
      content: (
        <ImagesTab productData={productData} setProductData={setProductData} />
      ),
    },
    {
      id: "pricing",
      label: "Pricing",
      iconName: "DollarSign",
      content: (
        <PricingTab productData={productData} setProductData={setProductData} />
      ),
    },
    {
      id: "inventory",
      label: "Inventory",
      iconName: "Archive",
      content: (
        <InventoryTab
          productData={productData}
          setProductData={setProductData}
        />
      ),
    },
    {
      id: "seo",
      label: "SEO",
      iconName: "Search",
      content: (
        <SEOTab productData={productData} setProductData={setProductData} />
      ),
    },
  ];

  const handleSave = () => {
    console.log("Saving product:", productData);
    // Here you would typically save the data to your backend
  };

  const handleCancel = () => {
    // Reset form or navigate back
    console.log("Cancelling product creation");
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Add New Product"
        subtitle="Create a new product for your catalog"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Ecommerce", href: "/apps/ecommerce" },
          { label: "Products", href: "/apps/ecommerce/products" },
          { label: "Add Product" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Product Details</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the information below to create your new product.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </div>

      <TabsWithIcons
        tabs={tabs}
        className="!w-full lg:!w-full border rounded-md p-8"
        grid="!grid !grid-cols-5"
      >
        <TabsContent value="information" className="space-y-4 pt-4">
          <InformationTab
            productData={productData}
            setProductData={setProductData}
          />
        </TabsContent>

        <TabsContent value="images" className="space-y-4 pt-4">
          <ImagesTab
            productData={productData}
            setProductData={setProductData}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 pt-4">
          <PricingTab
            productData={productData}
            setProductData={setProductData}
          />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4 pt-4">
          <InventoryTab
            productData={productData}
            setProductData={setProductData}
          />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 pt-4">
          <SEOTab productData={productData} setProductData={setProductData} />
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}

// Information Tab Component
function InformationTab({ productData, setProductData }: TabProps) {
  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Basic Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter product name"
                value={productData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                type="text"
                placeholder="Enter SKU"
                value={productData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={productData.category}
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
          <h4 className="text-md font-semibold">Description</h4>
          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={productData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Provide a detailed description of your product to help customers
              understand its features and benefits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Images Tab Component
function ImagesTab({ productData, setProductData }: TabProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Product Images</h4>
        <p className="text-sm text-muted-foreground">
          Upload high-quality images of your product. The first image will be
          used as the main product image.
        </p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <h5 className="text-lg font-medium">Upload Product Images</h5>
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, WebP. Maximum 5MB per image.
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </div>

        {/* Image Preview */}
        {productData.images.length > 0 && (
          <div className="space-y-4">
            <h5 className="text-sm font-medium">
              Uploaded Images ({productData.images.length})
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productData.images.map((image: File, index: number) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <ImageComponentOptimized
                      src={URL.createObjectURL(image)}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-2 left-2">Main</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Pricing Tab Component
function PricingTab({ productData, setProductData }: TabProps) {
  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Pricing Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare at Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productData.comparePrice}
                  onChange={(e) =>
                    handleInputChange("comparePrice", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Original price to show as a comparison (for sales/discounts)
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-semibold">Cost & Tax</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productData.costPrice}
                  onChange={(e) =>
                    handleInputChange("costPrice", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your cost for this product (for profit calculations)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={productData.taxRate}
                onChange={(e) => handleInputChange("taxRate", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tax rate as a percentage (e.g., 8.25 for 8.25%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h5 className="text-sm font-medium mb-2">Pricing Preview</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Selling Price:</span>
            <div className="font-medium">${productData.price || "0.00"}</div>
          </div>
          {productData.comparePrice && (
            <div>
              <span className="text-muted-foreground">Compare Price:</span>
              <div className="font-medium line-through text-muted-foreground">
                ${productData.comparePrice}
              </div>
            </div>
          )}
          {productData.costPrice && (
            <div>
              <span className="text-muted-foreground">Cost:</span>
              <div className="font-medium">${productData.costPrice}</div>
            </div>
          )}
          {productData.price && productData.costPrice && (
            <div>
              <span className="text-muted-foreground">Margin:</span>
              <div className="font-medium">
                {(
                  ((parseFloat(productData.price) -
                    parseFloat(productData.costPrice)) /
                    parseFloat(productData.price)) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inventory Tab Component
function InventoryTab({ productData, setProductData }: TabProps) {
  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Status */}
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
    </div>
  );
}

// SEO Tab Component
function SEOTab({ productData, setProductData }: TabProps) {
  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Engine Optimization
        </h4>
        <p className="text-sm text-muted-foreground">
          Configure how your product appears in search engines and social media
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
            value={productData.metaTitle}
            onChange={(e) => handleInputChange("metaTitle", e.target.value)}
            maxLength={60}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>
              Appears in browser tabs, search results, and social media links.
              Keep it under 60 characters for best results.
            </p>
            <span>{productData.metaTitle.length}/60</span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="metaDescription" className="flex items-center gap-2">
            Meta Description
            <Info className="h-4 w-4 text-muted-foreground" />
          </Label>
          <Textarea
            id="metaDescription"
            placeholder="Enter meta description"
            value={productData.metaDescription}
            onChange={(e) =>
              handleInputChange("metaDescription", e.target.value)
            }
            rows={3}
            maxLength={160}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>
              Appears under the title in search results. Write a compelling
              summary that encourages clicks. Keep it under 160 characters.
            </p>
            <span>{productData.metaDescription.length}/160</span>
          </div>
        </div>

        {/* URL Slug */}
        <div className="space-y-2">
          <Label htmlFor="urlSlug">URL Slug</Label>
          <div className="flex">
            <span className="w-32 inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
              /products/
            </span>
            <Input
              id="urlSlug"
              type="text"
              placeholder="product-name"
              value={productData.urlSlug}
              onChange={(e) => handleInputChange("urlSlug", e.target.value)}
              className="!rounded-l-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            The URL-friendly version of your product name. Leave blank to
            auto-generate from the product name.
          </p>
        </div>
      </div>

      {/* SEO Preview */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h5 className="text-sm font-medium mb-3">Search Result Preview</h5>
        <div className="space-y-2">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {productData.metaTitle || productData.name || "Your Product Title"}
          </div>
          <div className="text-green-700 text-sm">
            yourstore.com/products/{productData.urlSlug || "product-name"}
          </div>
          <div className="text-gray-600 text-sm">
            {productData.metaDescription ||
              productData.description?.substring(0, 160) ||
              "Your product description will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}
