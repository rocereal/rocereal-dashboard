"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { OrderData, ordersData, Product, productsData } from "@/data/ecommerce";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CustomerInformation,
  OrderItemsCard,
  OrderStatusHeader,
  OrderSummaryCard,
  OrderTimeline,
  PaymentInformation,
  ShippingAddress,
} from "./index";

/**
 * Props for OrderDetailsPage component
 * @param orderId - The unique identifier of the order to display
 */
interface OrderDetailsPageProps {
  orderId: string;
}

/**
 * Enhanced order item structure with full product details
 * @param name - The name of the product
 * @param image - The image URL of the product
 * @param product - The full product object from the database
 * @param quantity - The quantity ordered
 * @param price - The unit price of the item
 */
interface EnhancedOrderItem {
  name: string;
  image: string;
  product: Product | undefined;
  quantity: number;
  price: number;
}

/**
 * Enhanced order data structure with detailed items
 * Extends the base OrderData with enhanced item information
 * @param items - Array of enhanced order items with full product details
 */
interface EnhancedOrderData extends OrderData {
  items: EnhancedOrderItem[];
}

/**
 * Order Details Page Component
 * Comprehensive order details page displaying complete order information including items, timeline, customer details, and actions
 * Fetches and enhances order data with product details, handles loading states, and provides order management actions
 * Displays order in a responsive grid layout with status header, items list, timeline, and customer information cards
 * @param orderId - The unique identifier of the order to display
 * @returns The JSX element representing the complete order details page
 */
export default function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const [order, setOrder] = useState<EnhancedOrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the order by ID
    const foundOrder = ordersData.find((o) => o.id === orderId);

    if (foundOrder) {
      // Enhance order with product details
      const enhancedOrder = {
        ...foundOrder,
        items: foundOrder.products.map((orderProduct) => {
          const product = productsData.find((p) =>
            orderProduct.name
              .toLowerCase()
              .includes(p.name.toLowerCase().split(" ")[0])
          );
          return {
            name: orderProduct.name,
            image:
              typeof orderProduct.image === "string"
                ? orderProduct.image
                : orderProduct.image.src,
            product: product,
            quantity: 1, // Default quantity, could be enhanced with real data
            price: product?.price || 0,
          };
        }),
      };
      setOrder(enhancedOrder);
    }
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  /**
   * Handle Print Order
   * Initiates the printing of the order invoice
   * Currently a placeholder for print functionality implementation
   */
  const handlePrintOrder = () => {
    // Implement invoice print
  };

  /**
   * Handle Download Invoice
   * Downloads the order invoice as a file
   * Currently logs the action and is a placeholder for download implementation
   */
  const handleDownloadInvoice = () => {
    console.log("Downloading invoice for order:", orderId);
    // Implement invoice download
  };

  /**
   * Handle Update Status
   * Updates the status of the order
   * Currently logs the action and is a placeholder for status update implementation
   * @param newStatus - The new status to set for the order
   */
  const handleUpdateStatus = (newStatus: string) => {
    console.log("Updating order status to:", newStatus);
    // Implement status update
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={`Order ${order.id}`}
        subtitle={`Order placed on ${new Date(
          order.date
        ).toLocaleDateString()}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Ecommerce", href: "/apps/ecommerce" },
          { label: "Orders", href: "/apps/ecommerce/orders" },
          { label: order.id },
        ]}
      />

      {/* Order Status and Actions */}
      <OrderStatusHeader
        order={order}
        onPrintOrder={handlePrintOrder}
        onDownloadInvoice={handleDownloadInvoice}
        onUpdateStatus={handleUpdateStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsCard items={order.items} orderValue={order.orderValue} />

          {/* Order Timeline */}
          <OrderTimeline order={order} />
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <CustomerInformation customer={order.customer} />

          {/* Shipping Information */}
          <ShippingAddress customer={order.customer} />

          {/* Payment Information */}
          <PaymentInformation orderId={order.id} />

          {/* Order Summary */}
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}
