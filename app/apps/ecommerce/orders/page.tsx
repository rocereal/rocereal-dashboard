import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import OrdersPageComponent from "./(components)/OrdersPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Orders Management",
  "View and manage customer orders."
);

export default function OrdersPage() {
  return <OrdersPageComponent />;
}
