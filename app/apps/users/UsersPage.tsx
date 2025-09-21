"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { users, userMetrics, userActions, User } from "@/data/users/users-data";
import { UserMetricsComponent, UserFilters, UsersTable } from "./components";
import { User as UserIcon } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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
          <Button onClick={() => router.push("/apps/users/add")}>
            <UserIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
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
