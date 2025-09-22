"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { DeleteConfirmationDialog } from "@/components/dialogs";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EcommerceMetric, ordersData } from "@/data/ecommerce";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Mail,
  MoreHorizontal,
  Package,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SectionCards } from "./SectionCards";
import { OrdersBulkActions, OrdersFilters, OrderStatusBadge } from "./index";

export default function OrdersPage() {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

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

  const handleBulkDelete = (selectedOrderIds: string[]) => {
    if (selectedOrderIds.length > 0) {
      setOrderToDelete(selectedOrderIds.join(", ")); // Show selected order IDs
    }
  };

  // Column definitions for DataTable
  const columns: ColumnDef<(typeof ordersData)[0]>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Link
            href={`/apps/ecommerce/orders/${order.id}`}
            className="text-primary hover:underline font-medium"
          >
            {order.id}
          </Link>
        );
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => {
        const order = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "orderValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="font-medium">${order.orderValue.toFixed(2)}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        return <OrderStatusBadge status={order.status} />;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-muted-foreground">
            {new Date(order.date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View order details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Contact customer
              </DropdownMenuItem>
              <DropdownMenuItem>Download invoice</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteOrder(order.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Bulk actions function for DataTable
  const bulkActions = (selectedRows: typeof ordersData, table: any) => (
    <OrdersBulkActions
      selectedOrders={selectedRows.map((order) => order.id)}
      totalOrders={sortedOrders.length}
      onSelectAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      onBulkDelete={handleBulkDelete}
      onBulkExport={handleExportOrders}
    />
  );

  // Calculate summary stats and create metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderValue, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
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

      {/* Orders Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Orders ({filteredOrders.length})
            </h3>
          </div>

          <DataTable
            columns={columns}
            data={sortedOrders}
            searchKey="customer"
            searchPlaceholder="Search orders..."
            bulkActions={bulkActions}
          />

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
