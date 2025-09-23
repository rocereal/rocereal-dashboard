"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

/**
 * Props for OrderDeleteDialog component
 * @param isOpen - Whether the dialog is open
 * @param orderToDelete - The ID or name of the order to delete
 * @param onCancel - Callback function when cancel is clicked
 * @param onConfirm - Callback function when delete is confirmed
 */
interface OrderDeleteDialogProps {
  isOpen: boolean;
  orderToDelete: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Order Delete Dialog Component
 * Confirmation dialog for deleting orders with warning message
 * Uses AlertDialog to prevent accidental deletions
 * Shows order ID and irreversible action warning
 * @param isOpen - Whether the dialog is open
 * @param orderToDelete - The ID or name of the order to delete
 * @param onCancel - Callback function when cancel is clicked
 * @param onConfirm - Callback function when delete is confirmed
 * @returns The JSX element representing the delete confirmation dialog
 */
export function OrderDeleteDialog({
  isOpen,
  orderToDelete,
  onCancel,
  onConfirm,
}: OrderDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Order
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete order{" "}
              <span className="font-medium text-foreground">
                {orderToDelete}
              </span>
              ?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              order and remove all associated data from our servers.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
