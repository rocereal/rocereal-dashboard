"use client";

import { DeleteConfirmationDialog } from "@/components/dialogs";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { BulkActions } from "@/components/tables/BulkActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createSortableColumn, DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/components/ui/sonner";
import { ordersData, Product } from "@/data/ecommerce";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
}

/**
 * Products Table Component
 * Displays a comprehensive table of products with sorting, filtering, and bulk actions
 * Includes columns for product image, name, SKU, category, price, stock, status, and actions
 * Provides functionality for selecting, viewing, editing, and deleting products
 * @param products - Array of product objects to display in the table
 * @returns The JSX element representing the products data table
 */
export function ProductsTable({ products }: ProductsTableProps) {
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orders, setOrders] = useState(ordersData);

  /**
   * Handle Delete Order Function
   * Sets the order ID to be deleted, triggering the confirmation dialog
   * @param orderId - The ID of the order to be deleted
   */
  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  /**
   * Confirm Delete Order Function
   * Confirms the deletion of the selected order and removes it from the orders list
   * Resets the orderToDelete state after deletion
   */
  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter((order) => order.id !== orderToDelete));
      setOrderToDelete(null);
    }
  };

  /**
   * Cancel Delete Order Function
   * Cancels the deletion process by resetting the orderToDelete state
   */
  const cancelDeleteOrder = () => {
    setOrderToDelete(null);
  };

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        const productName = row.getValue("name") as string;

        return (
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 rounded-md overflow-hidden border">
              <ImageComponentOptimized
                src={image}
                alt={productName}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          </div>
        );
      },
    },
    createSortableColumn("name", "Product Name"),
    createSortableColumn("sku", "SKU"),
    createSortableColumn("category", "Category"),
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <div className="font-medium">${price.toFixed(2)}</div>;
      },
    },
    createSortableColumn("stock", "Stock"),
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Product["status"];
        return (
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "inactive"
                ? "secondary"
                : "destructive"
            }
          >
            {status.replace("-", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <>
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
                  onClick={() => {
                    navigator.clipboard.writeText(product.id);
                    showToast({
                      title: `Copied ${product.id}`,
                      description: "Product ID copied to clipboard",
                      button: {
                        label: "Close",
                        onClick: () => console.log("Undo clicked"),
                      },
                    });
                  }}
                >
                  Copy product ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link
                  shallow={true}
                  href="/apps/ecommerce/products/[id]"
                  as={`/apps/ecommerce/products/${product?.id}`}
                  passHref
                  style={{ textDecoration: "none" }}
                  className="cursor-pointer"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </DropdownMenuItem>
                </Link>

                <Link
                  shallow={true}
                  href="/apps/ecommerce/products/[id]"
                  as={`/apps/ecommerce/products/${product?.id}?tab=edit`}
                  passHref
                  style={{ textDecoration: "none" }}
                  className="cursor-pointer"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit product
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteOrder(product.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const bulkActions = (selectedRows: Product[], table: Table<Product>) => (
    <BulkActions
      selectedItems={selectedRows}
      isAllSelected={table.getIsAllPageRowsSelected()}
      onSelectAll={(checked) => table.toggleAllPageRowsSelected(checked)}
      onBulkDelete={() => {
        // For now, just clear selection. In a real app, you'd delete the selected items.
        table.setRowSelection({});
      }}
      onExport={() => {
        // Placeholder for export functionality
        console.log("Exporting selected products:", selectedRows);
      }}
      itemName="product"
    />
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Search products..."
        bulkActions={bulkActions}
      />

      {/* Delete Order Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={!!orderToDelete}
        itemName={orderToDelete || ""}
        itemType="product"
        onClose={cancelDeleteOrder}
        onConfirm={confirmDeleteOrder}
      />
    </>
  );
}
