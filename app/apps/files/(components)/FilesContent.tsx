"use client";

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
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  Download,
  Eye,
  FileText,
  Folder,
  Image,
  MoreVertical,
  Music,
  Share,
  Star,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  fileType?: string;
  size?: string;
  modifiedDate: string;
  icon: LucideIcon;
  color: string;
  starred?: boolean;
}

interface FilesContentProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  viewMode: "grid" | "list";
  selectedFiles: string[];
  onSelectionChange: (files: string[]) => void;
}

// Mock file data
const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modifiedDate: "2024-01-15",
    icon: Folder,
    color: "text-blue-600",
  },
  {
    id: "2",
    name: "Images",
    type: "folder",
    modifiedDate: "2024-01-14",
    icon: Folder,
    color: "text-green-600",
  },
  {
    id: "3",
    name: "Videos",
    type: "folder",
    modifiedDate: "2024-01-13",
    icon: Folder,
    color: "text-red-600",
  },
  {
    id: "4",
    name: "project-proposal.pdf",
    type: "file",
    fileType: "PDF",
    size: "2.4 MB",
    modifiedDate: "2024-01-15",
    icon: FileText,
    color: "text-red-600",
  },
  {
    id: "5",
    name: "vacation-photo.jpg",
    type: "file",
    fileType: "JPG",
    size: "3.2 MB",
    modifiedDate: "2024-01-14",
    icon: Image,
    color: "text-blue-600",
  },
  {
    id: "6",
    name: "presentation.pptx",
    type: "file",
    fileType: "PPTX",
    size: "15.8 MB",
    modifiedDate: "2024-01-13",
    icon: FileText,
    color: "text-orange-600",
  },
  {
    id: "7",
    name: "music-playlist.mp3",
    type: "file",
    fileType: "MP3",
    size: "8.5 MB",
    modifiedDate: "2024-01-12",
    icon: Music,
    color: "text-purple-600",
  },
  {
    id: "8",
    name: "backup-files.zip",
    type: "file",
    fileType: "ZIP",
    size: "245 MB",
    modifiedDate: "2024-01-11",
    icon: Archive,
    color: "text-gray-600",
  },
  {
    id: "9",
    name: "tutorial-video.mp4",
    type: "file",
    fileType: "MP4",
    size: "156 MB",
    modifiedDate: "2024-01-10",
    icon: Video,
    color: "text-red-600",
  },
];

export default function FilesContent({
  currentPath,
  onPathChange,
  viewMode,
  selectedFiles,
  onSelectionChange,
}: FilesContentProps) {
  const router = useRouter();
  const [files] = useState<FileItem[]>(mockFiles);

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      onPathChange(`${currentPath}/${file.name}`.replace("//", "/"));
    } else if (file.type === "file") {
      // Navigate to file details page
      router.push(`/apps/files/${file.id}`);
    }
  };

  const handleFileSelect = (fileId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedFiles, fileId]);
    } else {
      onSelectionChange(selectedFiles.filter((id) => id !== fileId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(files.map((file) => file.id));
    } else {
      onSelectionChange([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileTypeBadge = (fileType?: string) => {
    if (!fileType) return null;

    const colors: Record<string, string> = {
      PDF: "bg-red-100 text-red-700",
      JPG: "bg-blue-100 text-blue-700",
      PNG: "bg-blue-100 text-blue-700",
      PPTX: "bg-orange-100 text-orange-700",
      DOCX: "bg-blue-100 text-blue-700",
      MP3: "bg-purple-100 text-purple-700",
      MP4: "bg-red-100 text-red-700",
      ZIP: "bg-gray-100 text-gray-700",
    };

    return (
      <Badge
        variant="secondary"
        className={cn(
          "text-xs",
          colors[fileType] || "bg-gray-100 text-gray-700"
        )}
      >
        {fileType}
      </Badge>
    );
  };

  const columns: ColumnDef<FileItem>[] = [
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
      header: "Name",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <div className="flex items-center gap-3">
            <file.icon className={cn("h-5 w-5 flex-shrink-0", file.color)} />
            <div
              className="cursor-pointer hover:text-primary font-medium truncate"
              onClick={() => handleFileClick(file)}
            >
              {file.name}
            </div>
            {file.starred && (
              <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const file = row.original;
        return file.type === "folder" ? (
          <Badge variant="outline" className="text-xs">
            Folder
          </Badge>
        ) : (
          getFileTypeBadge(file.fileType)
        );
      },
    },
    createSortableColumn("size", "Size"),
    {
      accessorKey: "modifiedDate",
      header: "Modified",
      cell: ({ row }) => {
        const dateString = row.getValue("modifiedDate") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(dateString)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const file = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleFileClick(file)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Archive className="mr-2 h-4 w-4" />
                Move to Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Force grid view on mobile/tablet, allow list view only on desktop
  const effectiveViewMode = viewMode === "list" ? "list" : "grid";

  // Always show grid view on screens smaller than lg (desktop)
  return (
    <>
      {/* Mobile/Tablet: Always Grid View */}
      <div className="lg:hidden">
        <div className="flex-1 p-6">
          {/* Selection Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedFiles.length === files.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} of ${files.length} selected`
                  : `${files.length} items`}
              </span>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "group relative bg-secondary border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer",
                  selectedFiles.includes(file.id) &&
                    "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => handleFileClick(file)}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={(checked) =>
                      handleFileSelect(file.id, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* File Icon */}
                <div className="flex justify-center mb-3">
                  <file.icon className={cn("h-12 w-12 ", file.color)} />
                </div>

                {/* File Name */}
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900  dark:text-muted-foreground truncate mb-1">
                    {file.name}
                  </h3>

                  {/* File Details */}
                  <div className="text-xs text-gray-500 space-y-1">
                    {file.type === "file" && file.size && (
                      <div>{file.size}</div>
                    )}
                    <div>{formatDate(file.modifiedDate)}</div>
                    {file.fileType && (
                      <div>{getFileTypeBadge(file.fileType)}</div>
                    )}
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Grid or List View */}
      <div className="hidden lg:block">
        {effectiveViewMode === "grid" ? (
          <div className="flex-1 p-6">
            {/* Selection Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedFiles.length === files.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} of ${files.length} selected`
                    : `${files.length} items`}
                </span>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "group relative bg-secondary border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer",
                    selectedFiles.includes(file.id) &&
                      "ring-2 ring-primary bg-primary/5"
                  )}
                  onClick={() => handleFileClick(file)}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={(checked) =>
                        handleFileSelect(file.id, checked as boolean)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* File Icon */}
                  <div className="flex justify-center mb-3">
                    <file.icon className={cn("h-12 w-12 ", file.color)} />
                  </div>

                  {/* File Name */}
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-900  dark:text-muted-foreground truncate mb-1">
                      {file.name}
                    </h3>

                    {/* File Details */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {file.type === "file" && file.size && (
                        <div>{file.size}</div>
                      )}
                      <div>{formatDate(file.modifiedDate)}</div>
                      {file.fileType && (
                        <div>{getFileTypeBadge(file.fileType)}</div>
                      )}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6">
            <DataTable
              columns={columns}
              data={files}
              searchKey="name"
              searchPlaceholder="Search files..."
            />
          </div>
        )}
      </div>
    </>
  );
}
