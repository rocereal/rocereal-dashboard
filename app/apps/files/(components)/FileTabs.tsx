"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import {
  FileDetails,
  VersionHistory,
  AccessEntry,
  formatDate,
  formatDateShort,
} from "@/data/files";
import { FileText, Lock, Users } from "lucide-react";
import FileDetailsTab from "./FileDetailsTab";
import VersionHistoryTab from "./VersionHistoryTab";
import AccessSharingTab from "./AccessSharingTab";
import ActivityTab from "./ActivityTab";

interface FileTabsProps {
  file: FileDetails;
  versionHistory: VersionHistory[];
  accessList: AccessEntry[];
}

const fileTabs = [
  {
    id: "details",
    label: "Details",
    iconName: "FileText",
    description: "File information and metadata",
  },
  {
    id: "history",
    label: "Version History",
    iconName: "History",
    description: "File version history and changes",
  },
  {
    id: "access",
    label: "Access & Sharing",
    iconName: "Users",
    description: "File permissions and sharing settings",
  },
  {
    id: "activity",
    label: "Activity",
    iconName: "Activity",
    description: "Recent file activity and interactions",
  },
];

export default function FileTabs({
  file,
  versionHistory,
  accessList,
}: FileTabsProps) {
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

  return (
    <TabsWithIcons
      tabs={fileTabs}
      defaultValue="details"
      variant="underline"
      className="space-y-6"
    >
      <TabsContent value="details">
        <FileDetailsTab
          file={file}
          formatDate={formatDate}
          getPermissionIcon={getPermissionIcon}
        />
      </TabsContent>

      <TabsContent value="history">
        <VersionHistoryTab
          versionHistory={versionHistory}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="access">
        <AccessSharingTab
          accessList={accessList}
          formatDateShort={formatDateShort}
        />
      </TabsContent>

      <TabsContent value="activity">
        <ActivityTab
          activities={[
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
          ]}
        />
      </TabsContent>
    </TabsWithIcons>
  );
}
