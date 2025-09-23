import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import OrderDetailsPage from "../../(components)/OrderDetailsPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Order Details",
  "View detailed information about a customer order."
);

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

/**
 * Order Details Page Component
 * This is the dynamic page component for viewing individual order details
 * It extracts the order ID from the URL parameters and passes it to the OrderDetailsPage component
 * Renders comprehensive order information including items, customer details, and order status
 * @param params - Promise containing the route parameters, specifically the order ID
 * @returns The JSX element representing the order details page
 */
export default async function OrderPage({ params }: OrderDetailsProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  return <OrderDetailsPage orderId={orderId} />;
}
