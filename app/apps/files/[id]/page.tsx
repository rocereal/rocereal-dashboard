"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowLeft,
  Download,
  Edit,
  Eye,
  FileText,
  History,
  Lock,
  Settings,
  Share,
  Shield,
  Star,
  Trash2,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FileDetails {
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

interface VersionHistory {
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

interface AccessEntry {
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
const mockFileDetails: FileDetails = {
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

const mockVersionHistory: VersionHistory[] = [
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

const mockAccessList: AccessEntry[] = [
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

export default function FileDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.id as string;

  const [file, setFile] = useState<FileDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const foundFile = mockFileDetails.id === fileId ? mockFileDetails : null;
    setFile(foundFile);
    setLoading(false);
  }, [fileId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
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

  const getPermissionIcon = (permissions: string) => {
    switch (permissions) {
      case "private":
        return <Lock className="h-4 w-4" />;
      case "shared":
        return <Users className="h-4 w-4" />;
      case "public":
        return <Shield className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading file details...</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">File not found</h2>
          <p className="text-gray-600 mb-4">
            The file you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/apps/files")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Files
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/apps/files")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Files
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <file.icon className={cn("h-12 w-12", file.color)} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{file.name}</h1>
                  {file.starred && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
                {file.description && (
                  <p className="text-gray-600 mt-1">{file.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.fileType}</span>
                  <span>•</span>
                  <span>Modified {formatDateShort(file.modifiedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Version History
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Access & Sharing
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    File Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        File Name
                      </Label>
                      <p className="text-sm mt-1">{file.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        File Type
                      </Label>
                      <p className="text-sm mt-1">{file.fileType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Size
                      </Label>
                      <p className="text-sm mt-1">{file.size}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Permissions
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getPermissionIcon(file.permissions)}
                        <span className="text-sm capitalize">
                          {file.permissions}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Created
                      </Label>
                      <p className="text-sm mt-1">
                        {formatDate(file.createdDate)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Modified
                      </Label>
                      <p className="text-sm mt-1">
                        {formatDate(file.modifiedDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Owner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={file.owner.avatar} />
                      <AvatarFallback>
                        {file.owner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{file.owner.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.owner.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            {file.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {file.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Version History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Modified By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVersionHistory.map((version) => (
                      <TableRow key={version.id}>
                        <TableCell className="font-medium">
                          {version.version}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={version.modifiedBy.avatar} />
                              <AvatarFallback className="text-xs">
                                {version.modifiedBy.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {version.modifiedBy.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {version.modifiedBy.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(version.modifiedDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {version.size}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {version.changes}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access & Sharing Tab */}
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access & Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Granted</TableHead>
                      <TableHead>Last Access</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAccessList.map((access) => (
                      <TableRow key={access.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={access.user.avatar} />
                              <AvatarFallback>
                                {access.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {access.user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {access.user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn("text-xs", getRoleColor(access.role))}
                          >
                            {access.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDateShort(access.grantedDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDateShort(access.lastAccess)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 pt-6 border-t">
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Share with more people
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Downloaded",
                      user: "John Doe",
                      time: "2 hours ago",
                      avatar: "/avatars/john.jpg",
                    },
                    {
                      action: "Shared with",
                      user: "Jane Smith",
                      time: "1 day ago",
                      avatar: "/avatars/jane.jpg",
                    },
                    {
                      action: "Modified",
                      user: "John Doe",
                      time: "2 days ago",
                      avatar: "/avatars/john.jpg",
                    },
                    {
                      action: "Created",
                      user: "John Doe",
                      time: "1 week ago",
                      avatar: "/avatars/john.jpg",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.avatar} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium">this file</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
