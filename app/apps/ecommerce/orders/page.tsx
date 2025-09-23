import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import OrdersPageComponent from "../(components)/OrdersPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Orders Management",
  "View and manage customer orders."
);

/**
 * Orders Page Component
 * This is the main page component for the orders management section
 * It sets up the metadata for the orders dashboard and renders the OrdersPageComponent
 * which contains the full orders interface including order listing, details, and management features
 * @returns The JSX element representing the orders page
 */
export default function OrdersPage() {
  return <OrdersPageComponent />;
}
