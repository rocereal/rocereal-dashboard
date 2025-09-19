import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import OrderDetailsPage from "./(components)/OrderDetailsPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Order Details",
  "View detailed information about a customer order."
);

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderDetailsProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  return <OrderDetailsPage orderId={orderId} />;
}
