/**
 * Users Page Component
 * Main users management interface with filtering, metrics, and user actions
 * Displays user metrics, provides search and filter functionality, and manages user operations
 * Includes user table with selection and action capabilities
 */

"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { userActions, userMetrics, users } from "@/data/users-data";
import { User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { UserFilters, UserMetricsComponent, UsersTable } from "./(components)";
import Link from "next/link";

/**
 * UsersPage component for managing users
 * Provides comprehensive user management interface with filtering, metrics display, and user actions
 * Handles user search, filtering by status/role/plan, and various user operations
 * @returns JSX element representing the users management page
 */
export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  /**
   * Memoized filtered users list based on search term and filter criteria
   * Filters users by name/email search and status/role/plan filters
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        !statusFilter || statusFilter === "all" || user.status === statusFilter;
      const matchesRole =
        !roleFilter || roleFilter === "all" || user.role === roleFilter;
      const matchesPlan =
        !planFilter || planFilter === "all" || user.plan === planFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesPlan;
    });
  }, [searchTerm, statusFilter, roleFilter, planFilter]);

  /**
   * Handles user actions from the table (view, edit, reset-password, suspend, activate, delete)
   * @param userId - The ID of the user to perform the action on
   * @param action - The action to perform (view, edit, reset-password, suspend, activate, delete)
   */
  const handleAction = (userId: string, action: string) => {
    const user = users.find((u) => u.id === userId);

    switch (action) {
      case "view":
        router.push(`/apps/users/${userId}`);
        break;
      case "edit":
        console.log("Edit user:", user);
        // Open edit modal or navigate to edit page
        break;
      case "reset-password":
        if (
          confirm(
            `Are you sure you want to reset the password for ${user?.firstName} ${user?.lastName}?`
          )
        ) {
          console.log("Reset password for user:", user);
          // Implement password reset logic
        }
        break;
      case "suspend":
        if (
          confirm(
            `Are you sure you want to suspend ${user?.firstName} ${user?.lastName}?`
          )
        ) {
          console.log("Suspend user:", user);
          // Implement suspension logic
        }
        break;
      case "activate":
        console.log("Activate user:", user);
        // Implement activation logic
        break;
      case "delete":
        if (
          confirm(
            `Are you sure you want to permanently delete ${user?.firstName} ${user?.lastName}? This action cannot be undone.`
          )
        ) {
          console.log("Delete user:", user);
          // Implement deletion logic
        }
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  /**
   * Clears all filters and resets the search term and selected users
   * Resets the interface to show all users without any filtering
   */
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setRoleFilter("");
    setPlanFilter("");
    setSelectedUsers([]);
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="User Management"
        subtitle="Manage users, view profiles, and monitor user activity and metadata"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Users" }]}
      />

      {/* Metrics Overview */}
      <UserMetricsComponent metrics={userMetrics} />

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        planFilter={planFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        onPlanFilterChange={setPlanFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Users Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Users ({filteredUsers.length})</h2>
          <Link href="/apps/users/add-user">
            <Button>
              <UserIcon className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No users found matching your filters.
            </p>
          </div>
        ) : (
          <UsersTable
            users={filteredUsers}
            actions={userActions}
            onAction={handleAction}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
          />
        )}
      </div>
    </div>
  );
}
