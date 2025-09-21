import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { productsData } from "@/data/ecommerce";
import {
  ArrowLeft,
  Edit,
  FileText,
  Download,
  Eye,
  Share,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../(components)/ProductTabs";
import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Products Details",
  "Manage your product catalog, inventory, and pricing."
);

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Find the product by ID
  const product = productsData.find((p) => p.id === slug);

  if (!product) {
    return (
      <div className="flex flex-col space-y-6">
        <DashboardHeader
          title="Product Not Found"
          subtitle="The requested product could not be found"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Ecommerce", href: "/apps/ecommerce" },
            { label: "Products", href: "/apps/ecommerce/products" },
            { label: "Not Found" },
          ]}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found.</p>
          <Link href="/apps/ecommerce/products">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardHeader
          title={product.name}
          subtitle={`SKU: ${product.sku} • Category: ${product.category}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Ecommerce", href: "/apps/ecommerce" },
            { label: "Products", href: "/apps/ecommerce/products" },
            { label: product.name },
          ]}
        />
        <div className="flex items-center flex-wrap gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}
