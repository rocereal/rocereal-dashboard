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
import { LucideIcon } from "lucide-react";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: LucideIcon;
  iconColor?: string;
  size?: "sm" | "md" | "lg";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  icon: Icon,
  iconColor = "text-red-500",
  size = "md",
}: ConfirmationDialogProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={sizeClasses[size]}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              confirmVariant === "destructive"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                : confirmVariant === "outline"
                ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                : confirmVariant === "secondary"
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                : confirmVariant === "ghost"
                ? "hover:bg-accent hover:text-accent-foreground"
                : confirmVariant === "link"
                ? "text-primary underline-offset-4 hover:underline"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-configured variants for common use cases
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "item",
  additionalInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  additionalInfo?: string;
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${itemType}`}
      description={
        <div className="space-y-2">
          <div>
            Are you sure you want to delete {itemType.toLowerCase()}{" "}
            <span className="font-medium text-foreground">{itemName}</span>?
          </div>
          <div className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the{" "}
            {itemType.toLowerCase()} and remove all associated data from our
            servers.
          </div>
          {additionalInfo && (
            <div className="text-sm text-muted-foreground">
              {additionalInfo}
            </div>
          )}
        </div>
      }
      confirmText={`Delete ${itemType}`}
      cancelText="Cancel"
      confirmVariant="destructive"
      iconColor="text-red-500"
    />
  );
}

export function WarningConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Continue",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText="Cancel"
      confirmVariant="default"
      iconColor="text-yellow-500"
    />
  );
}

export function SuccessConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "OK",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText="Cancel"
      confirmVariant="default"
      iconColor="text-green-500"
    />
  );
}
