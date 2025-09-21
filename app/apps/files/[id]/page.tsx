import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  formatDateShort,
  mockAccessList,
  mockFilesData,
  mockVersionHistory,
} from "@/data/files";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  Edit,
  Eye,
  FileText,
  Share,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import FileTabs from "../(components)/FileTabs";

export const metadata = {
  title: "File Details | Files",
  description: "View and manage file details, permissions, and version history",
};

export default async function FileDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const fileId = resolvedParams.id;

  // Find the file by ID
  const file = mockFilesData.find((f) => f.id === fileId);

  if (!file) {
    return (
      <div className="flex flex-col space-y-6">
        <DashboardHeader
          title="File Not Found"
          subtitle="The requested file could not be found"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Files", href: "/apps/files" },
            { label: "Not Found" },
          ]}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">File not found.</p>
          <Link href="/apps/files">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Files
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={file.name}
        subtitle={`${file.fileType} • ${file.size} • ${file.permissions}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Files", href: "/apps/files" },
          { label: file.name },
        ]}
        primaryAction={{
          label: "Download",
          icon: <Download className="h-4 w-4" />,
        }}
        secondaryAction={{
          label: "Share",
          icon: <Share className="h-4 w-4" />,
        }}
      />

      {/* File Header */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="flex items-start gap-4">
            <FileText className={cn("h-16 w-16", file.color)} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{file.name}</h1>
                {file.starred && (
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                )}
              </div>
              {file.description && (
                <p className="text-gray-600 dark:text-muted-foreground mb-4">
                  {file.description}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{file.fileType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{file.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Modified {formatDateShort(file.modifiedDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3">
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

      {/* File Details Tabs */}
      <FileTabs
        file={file}
        versionHistory={mockVersionHistory}
        accessList={mockAccessList}
      />
    </div>
  );
}
