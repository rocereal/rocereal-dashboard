"use client";

import { BulkActions } from "@/components/tables/BulkActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { RecentStudent } from "@/data/education";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Eye, Mail, MoreHorizontal } from "lucide-react";

interface RecentStudentsTableProps {
  students: RecentStudent[];
}

/**
 * Recent Students Table Component
 * Displays a comprehensive table of recently enrolled students with sorting, filtering, and bulk actions
 * Includes columns for student info, course, enrollment date, progress, certificates, status, and actions
 * Provides functionality for selecting, viewing, editing, and managing student records
 * @param students - Array of recent student objects to display in the table
 * @returns The JSX element representing the recent students data table
 */
export function RecentStudentsTable({ students }: RecentStudentsTableProps) {
  const columns: ColumnDef<RecentStudent>[] = [
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
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  (typeof student.avatar === "string"
                    ? student.avatar
                    : student.avatar?.src) ||
                  `/avatars/${student.name.toLowerCase().replace(" ", "-")}.jpg`
                }
                alt={student.name}
              />
              <AvatarFallback>
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-muted-foreground">
                {student.email}
              </div>
            </div>
          </div>
        );
      },
    },
    createSortableColumn("course", "Course"),
    {
      accessorKey: "enrollmentDate",
      header: "Enrollment Date",
      cell: ({ row }) => {
        const date = row.getValue("enrollmentDate") as string;
        return (
          <div className="text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "certificates",
      header: "Certificates",
      cell: ({ row }) => {
        const certificates = row.getValue("certificates") as number;
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{certificates}</span>
            {certificates > 0 && <span className="text-yellow-500">🏆</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        /**
         * Get Status Color Function
         * Returns appropriate CSS classes for status badges based on student status
         * @param status - The status string of the student
         * @returns CSS class string for the status badge styling
         */
        const getStatusColor = (status: string) => {
          switch (status) {
            case "active":
              return "bg-green-100 text-green-800 border-green-200";
            case "completed":
              return "bg-blue-100 text-blue-800 border-blue-200";
            case "inactive":
              return "bg-gray-100 text-gray-800 border-gray-200";
            default:
              return "bg-gray-100 text-gray-800 border-gray-200";
          }
        };

        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;

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
                onClick={() => {
                  navigator.clipboard.writeText(student.id);
                  showToast({
                    title: `Copied ${student.id}`,
                    description: "Customer ID copied to clipboard",
                    button: {
                      label: "Close",
                      onClick: () => console.log("Undo clicked"),
                    },
                  });
                }}
              >
                Copy student name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuItem>Edit student</DropdownMenuItem>
              <DropdownMenuItem>View progress</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Remove student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const bulkActions = (
    selectedRows: RecentStudent[],
    table: Table<RecentStudent>
  ) => (
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
        console.log("Exporting selected students:", selectedRows);
      }}
      itemName="student"
    />
  );

  return (
    <DataTable
      columns={columns}
      data={students}
      searchKey="name"
      searchPlaceholder="Search students..."
      bulkActions={bulkActions}
    />
  );
}
