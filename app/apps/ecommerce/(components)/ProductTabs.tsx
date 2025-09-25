"use client";

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
import { Product } from "@/data/ecommerce";
import { ProductSettings } from "./ProductSettings";

/**
 * Props for ProductTabs component
 * @param product - The product object to edit
 */
interface productProps {
  product: Product;
}

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
 * Product Tabs Component
 * Provides a tabbed interface for editing product information with multiple sections
 * Organizes product editing into logical tabs: Information, Images, Pricing, Inventory, and SEO
 * Manages complex product data state and provides save/cancel functionality
 * Pre-populates form fields with existing product data for editing
 * @param product - The product object to edit
 * @returns The JSX element representing the complete product editing interface
 */
export const ProductTabs: React.FC<productProps> = ({ product }) => {
  const [productData, setProductData] = useState<ProductData>({
    // Information tab
    name: product.name,
    sku: product.sku,
    category: product.category,
    description: product.description || "",

    // Pricing tab
    price: product.price.toString(),
    comparePrice: "",
    costPrice: "",
    taxRate: "",

    // Inventory tab
    stock: product.stock.toString(),
    lowStockThreshold: "10",
    trackInventory: true,
    allowBackorders: false,

    // SEO tab
    metaTitle: product.name,
    metaDescription: product.description?.substring(0, 160) || "",
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
   * Processes the form submission to save the updated product
   * Currently logs the product data and is a placeholder for backend integration
   * In a real implementation, this would send the data to an API endpoint
   */
  const handleSave = () => {
    console.log("Saving product:", productData);
    // Here you would typically save the data to your backend
  };

  /**
   * Handle Cancel
   * Resets the form data back to the original product values
   * Cancels any unsaved changes and restores the initial state
   */
  const handleCancel = () => {
    setProductData({
      // Information tab
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description || "",

      // Pricing tab
      price: product.price.toString(),
      comparePrice: "",
      costPrice: "",
      taxRate: "",

      // Inventory tab
      stock: product.stock.toString(),
      lowStockThreshold: "10",
      trackInventory: true,
      allowBackorders: false,

      // SEO tab
      metaTitle: product.name,
      metaDescription: product.description?.substring(0, 160) || "",
      urlSlug: "",

      // Images tab
      images: [],
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <p className="text-sm text-muted-foreground">
            Update the product information below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full lg:w-fit"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="w-full lg:w-fit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <TabsWithIcons
        tabs={tabs}
        className="w-full border-0 lg:border rounded-lg p-0 lg:p-4"
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
};
