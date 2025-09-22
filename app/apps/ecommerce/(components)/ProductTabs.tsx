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

interface productProps {
  product: Product;
}

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

  const handleSave = () => {
    console.log("Saving product:", productData);
    // Here you would typically save the data to your backend
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Edit Product</h2>
          <p className="text-sm text-muted-foreground">
            Update the product information below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <TabsWithIcons
        tabs={tabs}
        className="!w-full lg:!w-full border bg-card rounded-md p-8"
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
