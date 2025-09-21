"use client";

import { DeleteConfirmationDialog } from "@/components/dialogs";
import { Badge } from "@/components/ui/badge";
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
import { Invoice } from "@/data/invoices";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Printer, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface InvoicesTableProps {
  invoices: Invoice[];
  onView?: (invoice: Invoice) => void;
  onPrint?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
}

export function InvoicesTable({
  invoices,
  onView,
  onPrint,
  onDelete,
}: InvoicesTableProps) {
  const router = useRouter();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoices.map((invoice) => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices((prev) => [...prev, invoiceId]);
    } else {
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
    }
  };

  const handleBulkDelete = () => {
    selectedInvoices.forEach((invoiceId) => {
      const invoice = invoices.find((i) => i.id === invoiceId);
      if (invoice) {
        onDelete?.(invoice);
      }
    });
    setSelectedInvoices([]);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
  };

  const cancelDeleteInvoice = () => {
    setInvoiceToDelete(null);
  };

  const confirmDeleteInvoice = () => {
    if (invoiceToDelete) {
      const invoice = invoices.find((i) => i.id === invoiceToDelete);
      if (invoice) {
        onDelete?.(invoice);
      }
      setInvoiceToDelete(null);
    }
  };

  const isAllSelected =
    invoices.length > 0 && selectedInvoices.length === invoices.length;
  const isIndeterminate =
    selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  const columns: ColumnDef<Invoice>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all invoices"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedInvoices.includes(row.original.id)}
          onCheckedChange={(checked) =>
            handleSelectInvoice(row.original.id, checked as boolean)
          }
          aria-label={`Select invoice ${row.original.number}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    createSortableColumn("number", "Invoice Number"),
    createSortableColumn("clientName", "Client Name"),
    createSortableColumn("projectName", "Project"),
    {
      accessorKey: "date",
      header: "Issue Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {new Date(dueDate).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const total = row.getValue("total") as number;
        const currency = row.original.currency;
        return (
          <div className="font-medium">
            {currency === "USD" ? "$" : currency}
            {total.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Invoice["status"];
        return (
          <Badge
            variant={
              status === "Paid"
                ? "default"
                : status === "Unpaid"
                ? "secondary"
                : status === "Overdue"
                ? "destructive"
                : "outline"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(invoice)}
              className="h-8 px-2"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrint?.(invoice)}
              className="h-8 px-2"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
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
                  onClick={() => navigator.clipboard.writeText(invoice.id)}
                >
                  Copy invoice ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onView?.(invoice)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Invoice
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPrint?.(invoice)}
                  className="cursor-pointer"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">
                  {selectedInvoices.length} invoice
                  {selectedInvoices.length !== 1 ? "s" : ""} selected
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={invoices}
        searchKey="number"
        searchPlaceholder="Search invoices..."
      />

      {/* Delete Invoice Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={!!invoiceToDelete}
        itemName={invoiceToDelete || ""}
        itemType="invoice"
        onClose={cancelDeleteInvoice}
        onConfirm={confirmDeleteInvoice}
      />
    </div>
  );
}
