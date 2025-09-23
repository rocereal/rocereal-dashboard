"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Save, X } from "lucide-react";
import { useState } from "react";
import {
  InformationTab,
  ImagesTab,
  PricingTab,
  InventoryTab,
  SEOTab,
} from "./index";
import { ProductSettings } from "./ProductSettings";

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
 * Add Product Form Component
 * Comprehensive form component for creating new products with tabbed interface
 * Organizes product creation into logical sections: Information, Images, Pricing, Inventory, and SEO
 * Manages complex product data state and provides save/cancel functionality
 * Uses tabbed navigation to break down the complex form into manageable sections
 * @returns The JSX element representing the complete add product form
 */
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

  /**
   * Handle Save
   * Processes the form submission to save the new product
   * Currently logs the product data and is a placeholder for backend integration
   * In a real implementation, this would send the data to an API endpoint
   */
  const handleSave = () => {
    console.log("Saving product:", productData);
    // Here you would typically save the data to your backend
  };

  /**
   * Handle Cancel
   * Handles the cancellation of product creation
   * Currently logs the cancellation and is a placeholder for form reset or navigation
   * In a real implementation, this might reset the form or navigate back to the products list
   */
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
        className="!w-full lg:!w-full border  bg-card rounded-md p-8"
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
          <ProductSettings />
        </TabsContent>
      </TabsWithIcons>
    </div>
  );
}
