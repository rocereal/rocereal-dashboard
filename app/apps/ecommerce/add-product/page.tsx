import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddProductForm from "../(components)/AddProductForm";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Add Product",
  "Create a new product for your catalog."
);

/**
 * Add Product Page Component
 * This is the main page component for adding new products to the catalog
 * It sets up the metadata for the add product page and renders the AddProductForm component
 * which contains the comprehensive form for creating new products with all necessary fields
 * @returns The JSX element representing the add product page
 */
export default function AddProductPage() {
  return <AddProductForm />;
}
