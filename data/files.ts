import { type LucideIcon, FileText, Lock, Users, Shield } from "lucide-react";

export interface FileDetails {
  id: string;
  name: string;
  type: "folder" | "file";
  fileType?: string;
  size?: string;
  createdDate: string;
  modifiedDate: string;
  owner: {
    name: string;
    email: string;
    avatar: string;
  };
  permissions: "private" | "shared" | "public";
  starred: boolean;
  iconName: string;
  color: string;
  description?: string;
  tags: string[];
}

export interface VersionHistory {
  id: string;
  version: string;
  modifiedBy: {
    name: string;
    email: string;
    avatar: string;
  };
  modifiedDate: string;
  size: string;
  changes: string;
}

export interface AccessEntry {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  role: "owner" | "editor" | "viewer";
  grantedDate: string;
  lastAccess: string;
}

// Mock data
export const mockFilesData: FileDetails[] = [
  {
    id: "1",
    name: "annual-report-2024.docx",
    type: "file",
    fileType: "Word Document",
    size: "5.2 MB",
    createdDate: "2024-01-01T08:00:00Z",
    modifiedDate: "2024-01-20T16:45:00Z",
    owner: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "/avatars/sarah.jpg",
    },
    permissions: "private",
    starred: false,
    iconName: "FileText",
    color: "text-blue-600",
    description:
      "Annual company report for 2024 with financial summaries and strategic initiatives.",
    tags: ["report", "annual", "finance", "strategy"],
  },
  {
    id: "2",
    name: "design-assets",
    type: "folder",
    fileType: "Folder",
    size: "45.8 MB",
    createdDate: "2024-01-05T10:15:00Z",
    modifiedDate: "2024-01-18T12:30:00Z",
    owner: {
      name: "Mike Chen",
      email: "mike.chen@company.com",
      avatar: "/avatars/mike.jpg",
    },
    permissions: "shared",
    starred: true,
    iconName: "FileText",
    color: "text-yellow-600",
    description:
      "Design assets folder containing logos, icons, and brand guidelines.",
    tags: ["design", "assets", "brand", "graphics"],
  },
  {
    id: "3",
    name: "meeting-notes.xlsx",
    type: "file",
    fileType: "Excel Spreadsheet",
    size: "1.8 MB",
    createdDate: "2024-01-08T14:20:00Z",
    modifiedDate: "2024-01-16T09:10:00Z",
    owner: {
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      avatar: "/avatars/emma.jpg",
    },
    permissions: "shared",
    starred: false,
    iconName: "FileText",
    color: "text-green-600",
    description:
      "Meeting notes and action items from quarterly planning sessions.",
    tags: ["meeting", "notes", "planning", "quarterly"],
  },
  {
    id: "4",
    name: "project-proposal.pdf",
    type: "file",
    fileType: "PDF",
    size: "2.4 MB",
    createdDate: "2024-01-10T09:30:00Z",
    modifiedDate: "2024-01-15T14:20:00Z",
    owner: {
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/avatars/john.jpg",
    },
    permissions: "shared",
    starred: true,
    iconName: "FileText",
    color: "text-red-600",
    description:
      "Comprehensive project proposal for the new marketing campaign including budget breakdown and timeline.",
    tags: ["project", "proposal", "marketing", "budget"],
  },
  {
    id: "5",
    name: "presentation.pptx",
    type: "file",
    fileType: "PowerPoint",
    size: "8.7 MB",
    createdDate: "2024-01-12T11:00:00Z",
    modifiedDate: "2024-01-19T15:25:00Z",
    owner: {
      name: "David Brown",
      email: "david.brown@company.com",
      avatar: "/avatars/david.jpg",
    },
    permissions: "public",
    starred: false,
    iconName: "FileText",
    color: "text-orange-600",
    description:
      "Client presentation for the new product launch with market analysis and projections.",
    tags: ["presentation", "client", "product", "launch"],
  },
];

export const mockFileDetails = mockFilesData[3]; // Default to the 4th item for backward compatibility

export const mockVersionHistory: VersionHistory[] = [
  {
    id: "1",
    version: "v1.3",
    modifiedBy: {
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/avatars/john.jpg",
    },
    modifiedDate: "2024-01-15T14:20:00Z",
    size: "2.4 MB",
    changes: "Updated budget section and added timeline",
  },
  {
    id: "2",
    version: "v1.2",
    modifiedBy: {
      name: "Jane Smith",
      email: "jane.smith@company.com",
      avatar: "/avatars/jane.jpg",
    },
    modifiedDate: "2024-01-14T11:45:00Z",
    size: "2.2 MB",
    changes: "Added executive summary and objectives",
  },
  {
    id: "3",
    version: "v1.1",
    modifiedBy: {
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/avatars/john.jpg",
    },
    modifiedDate: "2024-01-12T16:30:00Z",
    size: "1.8 MB",
    changes: "Initial draft with basic structure",
  },
];

export const mockAccessList: AccessEntry[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john.doe@company.com",
      avatar: "/avatars/john.jpg",
    },
    role: "owner",
    grantedDate: "2024-01-10T09:30:00Z",
    lastAccess: "2024-01-15T14:20:00Z",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      email: "jane.smith@company.com",
      avatar: "/avatars/jane.jpg",
    },
    role: "editor",
    grantedDate: "2024-01-11T10:15:00Z",
    lastAccess: "2024-01-14T11:45:00Z",
  },
  {
    id: "3",
    user: {
      name: "Bob Johnson",
      email: "bob.johnson@company.com",
      avatar: "/avatars/bob.jpg",
    },
    role: "viewer",
    grantedDate: "2024-01-12T13:20:00Z",
    lastAccess: "2024-01-13T09:10:00Z",
  },
];

// Utility functions
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-700";
    case "editor":
      return "bg-blue-100 text-blue-700";
    case "viewer":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Mock data for file creation
export const mockUsersForSharing = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "/avatars/sarah.jpg",
    role: "Editor",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    avatar: "/avatars/mike.jpg",
    role: "Viewer",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    avatar: "/avatars/emma.jpg",
    role: "Editor",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@company.com",
    avatar: "/avatars/david.jpg",
    role: "Viewer",
  },
];

export const mockFoldersForUpload = [
  { id: "root", name: "Root", path: "/" },
  { id: "docs", name: "Documents", path: "/Documents" },
  { id: "projects", name: "Projects", path: "/Projects" },
  { id: "shared", name: "Shared", path: "/Shared" },
];

export const permissionOptions = [
  {
    value: "private",
    label: "Private",
    description: "Only you can access",
  },
  {
    value: "shared",
    label: "Shared",
    description: "Share with specific people",
  },
  {
    value: "public",
    label: "Public",
    description: "Anyone can view",
  },
] as const;
