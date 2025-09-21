"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  Edit,
  Eye,
  FileText,
  Lock,
  Share,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FileDetails,
  VersionHistory,
  AccessEntry,
  mockFileDetails,
  mockVersionHistory,
  mockAccessList,
  formatDate,
  formatDateShort,
} from "@/data/files";
import FileTabs from "../(components)/FileTabs";

// Utility functions
const getPermissionIcon = (permissions: string) => {
  switch (permissions) {
    case "private":
      return <Lock className="h-4 w-4" />;
    case "shared":
      return <Users className="h-4 w-4" />;
    case "public":
      return <Lock className="h-4 w-4" />;
    default:
      return <Lock className="h-4 w-4" />;
  }
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
    <div className="min-h-screen space-y-4">
      {/* Header */}
      <div className=" border-b px-2 lg:px-6 py-4 rounded-md border">
        <div className="mx-auto">
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

          <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
            <div className="flex items-start gap-4">
              <file.icon className={cn("h-12 w-12", file.color)} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{file.name}</h1>
                  {file.starred && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
                {file.description && (
                  <p className="text-gray-600  dark:text-muted-foreground mt-1">
                    {file.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-muted-background">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.fileType}</span>
                  <span>•</span>
                  <span>Modified {formatDateShort(file.modifiedDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
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
      <div className="mx-auto p-6 rounded-md border">
        <FileTabs
          file={file}
          versionHistory={mockVersionHistory}
          accessList={mockAccessList}
          formatDate={formatDate}
          formatDateShort={formatDateShort}
          getPermissionIcon={getPermissionIcon}
          getRoleColor={getRoleColor}
        />
      </div>
    </div>
  );
}
