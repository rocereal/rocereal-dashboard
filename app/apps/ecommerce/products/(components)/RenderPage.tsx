"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Product, productsData } from "@/data/ecommerce";
import { FileText, Package, Plus } from "lucide-react";
import { useState } from "react";
import { ProductsTable } from "./ProductsTable";
import { SectionCards } from "./SectionCards";

export default function RenderPage() {
  const [products, setProducts] = useState(productsData);

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
    // Implement edit functionality
  };

  const handleDelete = (product: Product) => {
    console.log("Delete product:", product);
    // Implement delete functionality with confirmation
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(products.filter((p) => p.id !== product.id));
    }
  };

  const handleView = (product: Product) => {
    console.log("View product:", product);
    // Implement view details functionality
  };

  // Create metrics for SectionCards
  const productMetrics = [
    {
      id: "total-products",
      title: "Total Products",
      value: products.length,
      change: "+2 this week",
      changeType: "positive" as const,
      icon: Package,
      description: "Total number of products in catalog",
    },
    {
      id: "active-products",
      title: "Active Products",
      value: products.filter((p) => p.status === "active").length,
      change: "+1 this week",
      changeType: "positive" as const,
      icon: Package,
      description: "Products currently active and available",
    },
    {
      id: "low-stock",
      title: "Low Stock",
      value: products.filter((p) => p.stock < 10 && p.stock > 0).length,
      change: "-1 this week",
      changeType: "positive" as const,
      icon: Package,
      description: "Products with stock below 10 units",
    },
    {
      id: "out-of-stock",
      title: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
      change: "0 this week",
      changeType: "neutral" as const,
      icon: Package,
      description: "Products with zero stock",
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Products Management"
        subtitle="Manage your product catalog, inventory, and pricing"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Ecommerce", href: "/apps/ecommerce" },
          { label: "Products" },
        ]}
        primaryAction={{
          label: "Add Product",
          icon: <Plus className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Export Report",
          icon: <FileText className="h-4 w-4" />,
        }}
      />

      {/* Products Stats Cards */}
      <SectionCards metrics={productMetrics} />

      {/* Products Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Catalog</h3>
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      </div>
    </div>
  );
}
