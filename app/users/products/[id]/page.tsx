import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { productsData } from "@/data/ecommerce";
import { ArrowLeft, Edit, FileText } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../(components)/ProductTabs";

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
      <DashboardHeader
        title={product.name}
        subtitle={`SKU: ${product.sku} • Category: ${product.category}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Ecommerce", href: "/apps/ecommerce" },
          { label: "Products", href: "/apps/ecommerce/products" },
          { label: product.name },
        ]}
        primaryAction={{
          label: "Edit Product",
          icon: <Edit className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "View in Store",
          icon: <FileText className="h-4 w-4" />,
        }}
      />

      <ProductTabs product={product} />
    </div>
  );
}
