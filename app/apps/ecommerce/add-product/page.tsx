import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import AddProductForm from "../(components)/AddProductForm";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Add Product",
  "Create a new product for your catalog."
);

export default function AddProductPage() {
  return <AddProductForm />;
}
