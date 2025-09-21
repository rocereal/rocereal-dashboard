"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Save, X } from "lucide-react";
import { useState } from "react";
import {
  BasicInfoForm,
  DescriptionForm,
  ImageUpload,
  ImagePreview,
  PricingForm,
  CostTaxForm,
  PricingPreview,
  StockManagement,
  InventorySettings,
  InventoryStatus,
  SEOFields,
  SEOPreview,
} from "./index";

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

export default function AddProductForm() {
  const [productData, setProductData] = useState<ProductData>({
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
    images: [],
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
interface TabProps {
  productData: ProductData;
  setProductData: React.Dispatch<React.SetStateAction<ProductData>>;
}

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
        <BasicInfoForm
          productData={{
            name: productData.name,
            sku: productData.sku,
            category: productData.category,
          }}
          onChange={handleInputChange}
        />

        <DescriptionForm
          description={productData.description}
          onChange={(value) => handleInputChange("description", value)}
        />
      </div>
    </div>
  );
}

// Images Tab Component
function ImagesTab({ productData, setProductData }: TabProps) {
  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files);
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
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

        <ImageUpload onImageUpload={handleImageUpload} />

        <ImagePreview images={productData.images} onRemoveImage={removeImage} />
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
        <PricingForm
          productData={{
            price: productData.price,
            comparePrice: productData.comparePrice,
          }}
          onChange={handleInputChange}
        />

        <CostTaxForm
          productData={{
            costPrice: productData.costPrice,
            taxRate: productData.taxRate,
          }}
          onChange={handleInputChange}
        />
      </div>

      <PricingPreview
        productData={{
          price: productData.price,
          comparePrice: productData.comparePrice,
          costPrice: productData.costPrice,
        }}
      />
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
        <StockManagement
          productData={{
            stock: productData.stock,
            lowStockThreshold: productData.lowStockThreshold,
          }}
          onChange={handleInputChange}
        />

        <InventorySettings
          productData={{
            trackInventory: productData.trackInventory,
            allowBackorders: productData.allowBackorders,
          }}
          onChange={handleInputChange}
        />
      </div>

      <InventoryStatus
        productData={{
          stock: productData.stock,
          lowStockThreshold: productData.lowStockThreshold,
          trackInventory: productData.trackInventory,
          allowBackorders: productData.allowBackorders,
        }}
      />
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
          Search Engine Optimization
        </h4>
        <p className="text-sm text-muted-foreground">
          Configure how your product appears in search engines and social media
        </p>
      </div>

      <SEOFields
        productData={{
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription,
          urlSlug: productData.urlSlug,
        }}
        onChange={handleInputChange}
      />

      <SEOPreview
        productData={{
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription,
          urlSlug: productData.urlSlug,
          name: productData.name,
          description: productData.description,
        }}
      />
    </div>
  );
}
