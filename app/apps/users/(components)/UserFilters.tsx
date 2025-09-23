/**
 * User Filters Component
 * Provides search and filter controls for the users table
 * Includes search by name/email and filters by status, role, and plan
 * Allows clearing all active filters
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

/**
 * Props for the UserFilters component
 * @param searchTerm - Current search term for filtering users
 * @param statusFilter - Current status filter value
 * @param roleFilter - Current role filter value
 * @param planFilter - Current plan filter value
 * @param onSearchChange - Callback when search term changes
 * @param onStatusFilterChange - Callback when status filter changes
 * @param onRoleFilterChange - Callback when role filter changes
 * @param onPlanFilterChange - Callback when plan filter changes
 * @param onClearFilters - Callback to clear all filters
 */
interface UserFiltersProps {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  planFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onPlanFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

/**
 * UserFilters component for filtering and searching users
 * Renders search input and select dropdowns for status, role, and plan filters
 * Shows clear filters button when any filters are active
 * @param searchTerm - Current search term
 * @param statusFilter - Current status filter
 * @param roleFilter - Current role filter
 * @param planFilter - Current plan filter
 * @param onSearchChange - Function to call when search changes
 * @param onStatusFilterChange - Function to call when status filter changes
 * @param onRoleFilterChange - Function to call when role filter changes
 * @param onPlanFilterChange - Function to call when plan filter changes
 * @param onClearFilters - Function to call when clearing filters
 * @returns JSX element representing the user filters interface
 */
export function UserFilters({
  searchTerm,
  statusFilter,
  roleFilter,
  planFilter,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onPlanFilterChange,
  onClearFilters,
}: UserFiltersProps) {
  const hasActiveFilters =
    searchTerm || statusFilter || roleFilter || planFilter;

  return (
    <div className="bg-card rounded-lg border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Plan Filter */}
        <div>
          <Label htmlFor="plan">Plan</Label>
          <Select value={planFilter} onValueChange={onPlanFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
