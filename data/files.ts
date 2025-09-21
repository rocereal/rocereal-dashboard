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
  icon: LucideIcon;
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
export const mockFileDetails: FileDetails = {
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
  icon: FileText,
  color: "text-red-600",
  description:
    "Comprehensive project proposal for the new marketing campaign including budget breakdown and timeline.",
  tags: ["project", "proposal", "marketing", "budget"],
};

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
