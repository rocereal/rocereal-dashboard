"use client";

import { Switch } from "@/components/ui/switch";

interface ProductSettingsProps {
  settings: {
    visibility: boolean;
    seoOptimization: boolean;
    inventoryTracking: boolean;
    lowStockAlerts: boolean;
    featuredProduct: boolean;
    allowReviews: boolean;
  };
  onChange: (setting: string, value: boolean) => void;
}

export function ProductSettings({ settings, onChange }: ProductSettingsProps) {
  const settingItems = [
    {
      key: "visibility",
      title: "Product Visibility",
      description:
        "Control whether this product is visible to customers on your store",
    },
    {
      key: "seoOptimization",
      title: "SEO Optimization",
      description:
        "Enable search engine optimization features for this product",
    },
    {
      key: "inventoryTracking",
      title: "Inventory Tracking",
      description: "Automatically track and update product stock levels",
    },
    {
      key: "lowStockAlerts",
      title: "Low Stock Alerts",
      description: "Receive notifications when product stock is running low",
    },
    {
      key: "featuredProduct",
      title: "Featured Product",
      description:
        "Display this product prominently on your homepage and featured sections",
    },
    {
      key: "allowReviews",
      title: "Customer Reviews",
      description:
        "Allow customers to leave reviews and ratings for this product",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Product Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure product behavior and visibility
        </p>
      </div>

      <div className="space-y-6">
        {settingItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-1">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <Switch
              checked={settings[item.key as keyof typeof settings]}
              onCheckedChange={(value) => onChange(item.key, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
