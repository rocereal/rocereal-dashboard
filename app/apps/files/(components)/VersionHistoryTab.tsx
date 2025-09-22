"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSortableColumn, DataTable } from "@/components/ui/data-table";
import { Download, History } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { VersionHistory } from "@/data/files";

interface VersionHistoryTabProps {
  versionHistory: VersionHistory[];
  formatDate: (dateString: string) => string;
}

export default function VersionHistoryTab({
  versionHistory,
  formatDate,
}: VersionHistoryTabProps) {
  const columns: ColumnDef<VersionHistory>[] = [
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("version")}</div>
      ),
    },
    {
      accessorKey: "modifiedBy",
      header: "Modified By",
      cell: ({ row }) => {
        const modifiedBy = row.getValue(
          "modifiedBy"
        ) as VersionHistory["modifiedBy"];
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  (typeof modifiedBy.avatar === "string"
                    ? modifiedBy.avatar
                    : modifiedBy.avatar?.src) ||
                  `/avatars/${modifiedBy.name
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`
                }
                alt={modifiedBy.name}
              />
              <AvatarFallback className="text-xs">
                {modifiedBy.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{modifiedBy.name}</p>
              <p className="text-xs text-muted-foreground">
                {modifiedBy.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "modifiedDate",
      header: "Date",
      cell: ({ row }) => {
        const dateString = row.getValue("modifiedDate") as string;
        return <div className="text-sm">{formatDate(dateString)}</div>;
      },
    },
    createSortableColumn("size", "Size"),
    {
      accessorKey: "changes",
      header: "Changes",
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate">
          {row.getValue("changes")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={versionHistory}
          searchKey="version"
          searchPlaceholder="Search versions..."
        />
      </CardContent>
    </Card>
  );
}
