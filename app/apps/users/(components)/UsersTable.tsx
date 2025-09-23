/**
 * Users Table Component
 * Displays users in a sortable, filterable data table with selection and actions
 * Shows user information including avatar, name, role, status, plan, activity, and security settings
 * Provides dropdown actions for user management operations
 */

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
import { User, UserAction } from "@/data/users-data";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, Eye, MoreHorizontal, Shield } from "lucide-react";
import Link from "next/link";

/**
 * Props for the UsersTable component
 * @param users - Array of user objects to display
 * @param actions - Array of available actions for users
 * @param onAction - Callback function when an action is performed on a user
 * @param selectedUsers - Array of selected user IDs
 * @param onSelectionChange - Callback when user selection changes
 */
interface UsersTableProps {
  users: User[];
  actions: UserAction[];
  onAction: (userId: string, action: string) => void;
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
}

/**
 * Color mappings for user status badges
 */
const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
};

/**
 * Color mappings for user role badges
 */
const roleColors = {
  admin: "bg-purple-100 text-purple-800",
  manager: "bg-blue-100 text-blue-800",
  user: "bg-green-100 text-green-800",
  viewer: "bg-gray-100 text-gray-800",
};

export function UsersTable({ users, actions, onAction }: UsersTableProps) {
  /**
   * Generates user initials from first and last name
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @returns Uppercase initials string
   */
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  /**
   * Calculates and formats the time since user's last login
   * @param user - User object containing lastLogin date
   * @returns Formatted string showing time since last activity
   */
  const getLastActive = (user: User) => {
    if (user.lastLogin) {
      const lastLogin = new Date(user.lastLogin);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 day ago";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    }
    return "Never";
  };

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "firstName",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  (typeof user.avatar === "string"
                    ? user.avatar
                    : user.avatar?.src) ||
                  `/avatars/${user.firstName
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`
                }
                alt={user.firstName}
              />

              <AvatarFallback className="text-xs">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as keyof typeof roleColors;
        return (
          <Badge className={roleColors[role]}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return (
          <Badge className={statusColors[status]}>
            {status.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    },
    createSortableColumn("plan", "Plan"),
    {
      accessorKey: "lastLogin",
      header: "Last Active",
      cell: ({ row }) => {
        const user = row.original;
        return <div className="text-sm">{getLastActive(user)}</div>;
      },
    },
    {
      accessorKey: "metadata.totalLogins",
      header: "Login Count",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{user.metadata.totalLogins}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "metadata.twoFactorEnabled",
      header: "2FA",
      cell: ({ row }) => {
        const user = row.original;
        return user.metadata.twoFactorEnabled ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Enabled
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Disabled
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
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
                  navigator.clipboard.writeText(user.id);
                  showToast({
                    title: `Copied ${user.id}`,
                    description: "User ID copied to clipboard",
                    button: {
                      label: "Close",
                      onClick: () => console.log("Undo clicked"),
                    },
                  });
                }}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                shallow={true}
                href="/apps/users/[id]"
                as={`/apps/users/${user?.id}`}
                passHref
                style={{ textDecoration: "none" }}
                className="cursor-pointer"
              >
                <DropdownMenuItem>
                  <Eye className="h-3 w-3 mr-1" />
                  View User
                </DropdownMenuItem>
              </Link>
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => onAction(user.id, action.action)}
                  className={
                    action.variant === "destructive"
                      ? "text-red-600 focus:text-red-600"
                      : ""
                  }
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  /**
   * UsersTable component for displaying users in a data table
   * Renders a comprehensive table with user information, selection checkboxes, and action dropdowns
   * Uses DataTable component with custom column definitions for user display
   * @param users - Array of user objects to display in the table
   * @param actions - Array of available actions for dropdown menus
   * @param onAction - Callback function when an action is selected from dropdown
   * @returns JSX element representing the users data table
   */
  return (
    <div className="bg-card rounded-lg border">
      <div className="p-6">
        <DataTable
          columns={columns}
          data={users}
          searchKey="firstName"
          searchPlaceholder="Search users..."
        />
      </div>
    </div>
  );
}
