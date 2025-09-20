"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EcommerceMetric,
  OrderData,
  ordersData,
  productsData,
} from "@/data/ecommerce";
import {
  Calendar,
  DollarSign,
  Download,
  Eye,
  Package,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SectionCards } from "./SectionCards";
import { OrdersFilters, OrdersBulkActions, OrderStatusBadge } from "./index";
import { DeleteConfirmationDialog } from "@/components/dialogs";

export default function OrdersPage() {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "value":
        return b.orderValue - a.orderValue;
      case "customer":
        return a.customer.localeCompare(b.customer);
      default:
        return 0;
    }
  });

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter((order) => order.id !== orderToDelete));
      setOrderToDelete(null);
    }
  };

  const cancelDeleteOrder = () => {
    setOrderToDelete(null);
  };

  const handleExportOrders = () => {
    console.log("Exporting orders...");
    // Implement export functionality
  };

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(sortedOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length > 0) {
      setOrderToDelete(selectedOrders.join(", ")); // Show selected order IDs
    }
  };

  const confirmBulkDelete = () => {
    if (selectedOrders.length > 0) {
      setOrders(orders.filter((order) => !selectedOrders.includes(order.id)));
      setSelectedOrders([]);
      setOrderToDelete(null);
    }
  };

  const isAllSelected =
    sortedOrders.length > 0 && selectedOrders.length === sortedOrders.length;
  const isIndeterminate =
    selectedOrders.length > 0 && selectedOrders.length < sortedOrders.length;

  // Calculate summary stats and create metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderValue, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;

  // Create order metrics for SectionCards
  const orderMetrics: EcommerceMetric[] = [
    {
      id: "total-orders",
      title: "Total Orders",
      value: totalOrders,
      change: `+${Math.floor(totalOrders * 0.15)} this week`,
      changeType: "positive",
      icon: Package,
      description: "Total number of orders placed",
    },
    {
      id: "total-revenue",
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(0)}K`,
      change: `+${Math.floor(totalRevenue * 0.12)}% vs last month`,
      changeType: "positive",
      icon: DollarSign,
      description: "Total revenue from all orders",
    },
    {
      id: "pending-orders",
      title: "Pending Orders",
      value: pendingOrders,
      change:
        pendingOrders > 0
          ? `-${Math.floor(pendingOrders * 0.2)} this week`
          : "No change",
      changeType: pendingOrders > 0 ? "negative" : "neutral",
      icon: Calendar,
      description: "Orders awaiting processing",
    },
    {
      id: "delivered-orders",
      title: "Delivered Orders",
      value: deliveredOrders,
      change: `+${Math.floor(deliveredOrders * 0.25)} this week`,
      changeType: "positive",
      icon: User,
      description: "Successfully delivered orders",
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Orders Management"
        subtitle="View and manage all customer orders"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Ecommerce", href: "/apps/ecommerce" },
          { label: "Orders" },
        ]}
        primaryAction={{
          label: "Export Orders",
          icon: <Download className="h-4 w-4" />,
        }}
      />

      {/* Order Metrics using SectionCards */}
      <SectionCards metrics={orderMetrics} />

      {/* Filters and Search */}
      <OrdersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Bulk Actions */}
      <OrdersBulkActions
        selectedOrders={selectedOrders}
        totalOrders={sortedOrders.length}
        onSelectAll={handleSelectAll}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleExportOrders}
      />

      {/* Orders Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Orders ({filteredOrders.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Order Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOrder(order.id, checked as boolean)
                        }
                        aria-label={`Select order ${order.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/apps/ecommerce/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/avatars/${order.customer
                              .toLowerCase()
                              .replace(" ", "-")}.jpg`}
                          />
                          <AvatarFallback>
                            {order.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{order.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="relative">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                              <ImageComponentOptimized
                                src={product?.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>

                            {index === 1 && order.products.length > 2 && (
                              <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                +{order.products.length - 2}
                              </div>
                            )}
                          </div>
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {order.products.length} item
                          {order.products.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.orderValue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          shallow={true}
                          href="/apps/ecommerce/orders/[id]"
                          as={`/apps/ecommerce/orders/${order?.id}`}
                          passHref
                          style={{ textDecoration: "none" }}
                          className="cursor-pointer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No orders have been placed yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Order Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={!!orderToDelete}
        itemName={orderToDelete || ""}
        itemType="order"
        onClose={cancelDeleteOrder}
        onConfirm={confirmDeleteOrder}
      />
    </div>
  );
}
