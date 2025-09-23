"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { AccessEntry, getRoleColor } from "@/data/files";
import { ColumnDef } from "@tanstack/react-table";
import { Settings, Users } from "lucide-react";

/**
 * Props for AccessSharingTab component
 * @param accessList - Array of access entries showing users with file access permissions
 * @param formatDateShort - Function to format date strings for display
 */
interface AccessSharingTabProps {
  accessList: AccessEntry[];
  formatDateShort: (dateString: string) => string;
}

/**
 * Access Sharing Tab Component
 * Displays file access permissions and sharing information in a data table format
 * Shows user avatars, roles, access dates, and provides sharing management options
 * Includes functionality to view current access entries and share with additional users
 * Uses color-coded role badges and formatted date display
 * @param accessList - Array of access entries showing users with file access permissions
 * @param formatDateShort - Function to format date strings for display
 * @returns The JSX element representing the access and sharing management interface
 */
export default function AccessSharingTab({
  accessList,
  formatDateShort,
}: AccessSharingTabProps) {
  const columns: ColumnDef<AccessEntry>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.getValue("user") as AccessEntry["user"];
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  (typeof user.avatar === "string"
                    ? user.avatar
                    : user.avatar?.src) ||
                  `/avatars/${user.name.toLowerCase().replace(" ", "-")}.jpg`
                }
                alt={user.name}
              />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge className={`text-xs ${getRoleColor(role)}`}>{role}</Badge>
        );
      },
    },
    {
      accessorKey: "grantedDate",
      header: "Granted",
      cell: ({ row }) => {
        const dateString = row.getValue("grantedDate") as string;
        return <div className="text-sm">{formatDateShort(dateString)}</div>;
      },
    },
    {
      accessorKey: "lastAccess",
      header: "Last Access",
      cell: ({ row }) => {
        const dateString = row.getValue("lastAccess") as string;
        return <div className="text-sm">{formatDateShort(dateString)}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Access & Sharing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={accessList} />

        <div className="mt-6 pt-6 border-t">
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Share with more people
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
