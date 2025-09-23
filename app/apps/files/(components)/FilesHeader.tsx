"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Download,
  FolderPlus,
  Grid3X3,
  Home,
  List,
  MoreVertical,
  RefreshCw,
  Search,
  Share,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";

/**
 * Props for FilesHeader component
 * @param sidebarOpen - Whether the sidebar is currently open
 * @param onSidebarToggle - Callback function to toggle sidebar visibility
 * @param currentPath - Current directory path being displayed
 * @param onPathChange - Callback function when navigating to a different path
 * @param viewMode - Current view mode (grid or list)
 * @param onViewModeChange - Callback function when view mode changes
 * @param selectedFiles - Array of selected file IDs
 * @param onSelectionChange - Callback when file selection changes
 */
interface FilesHeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  currentPath: string;
  onPathChange: (path: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedFiles: string[];
  onSelectionChange: (files: string[]) => void;
}

/**
 * Files Header Component
 * Navigation header for the files application with breadcrumbs, search, and action buttons
 * Provides file management controls including view toggles, selection actions, and navigation
 * Responsive design that adapts between mobile and desktop layouts
 * Includes breadcrumb navigation, search functionality, and bulk file operations
 * Shows current directory information and last update status
 * @param sidebarOpen - Whether the sidebar is currently open
 * @param onSidebarToggle - Callback function to toggle sidebar visibility
 * @param currentPath - Current directory path being displayed
 * @param onPathChange - Callback function when navigating to a different path
 * @param viewMode - Current view mode (grid or list)
 * @param onViewModeChange - Callback function when view mode changes
 * @param selectedFiles - Array of selected file IDs
 * @param onSelectionChange - Callback when file selection changes
 * @returns The JSX element representing the files application header
 */
export default function FilesHeader({
  onSidebarToggle,
  currentPath,
  onPathChange,
  viewMode,
  onViewModeChange,
  selectedFiles,
}: FilesHeaderProps) {
  const pathSegments = currentPath.split("/").filter(Boolean);

  const handleBreadcrumbClick = (index: number) => {
    const newPath = "/" + pathSegments.slice(0, index + 1).join("/");
    onPathChange(newPath);
  };

  const handleCreateFolder = () => {
    // TODO: Implement create folder functionality
    console.log("Create folder");
  };

  const handleUpload = () => {
    // TODO: Implement upload functionality
    console.log("Upload files");
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log("Download selected files");
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete selected files");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share selected files");
  };

  return (
    <div className="border-b px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row items-start lg:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={onSidebarToggle}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPathChange("/")}
              className="p-2"
            >
              <Home className="h-4 w-4" />
            </Button>

            {pathSegments.length > 0 && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {pathSegments.map((segment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBreadcrumbClick(index)}
                      className="text-sm px-2 py-1 h-auto font-medium text-gray-700 hover:text-primary"
                    >
                      {segment}
                    </Button>
                    {index < pathSegments.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Selection Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {selectedFiles.length} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* View Toggle */}
          <div className="hidden lg:flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "h-8 w-8 p-0",
                viewMode === "grid" && "bg-card shadow-sm"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "h-8 w-8 p-0",
                viewMode === "list" && "bg-card shadow-sm"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative flex md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              className="w-64 pl-10 pr-4 py-2"
            />
          </div>

          {/* Main Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCreateFolder}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>

            <Link href="/apps/files/add-file">
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Info Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600 dark:text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            {currentPath === "/"
              ? "Home"
              : pathSegments[pathSegments.length - 1] || "Files"}
          </span>
          <span>•</span>
          <span>24 items</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="ghost" size="sm" className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
}
