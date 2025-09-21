"use client";

import { TabsContent } from "@/components/ui/tabs";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { FileDetails, VersionHistory, AccessEntry } from "@/data/files";
import FileDetailsTab from "./FileDetailsTab";
import VersionHistoryTab from "./VersionHistoryTab";
import AccessSharingTab from "./AccessSharingTab";
import ActivityTab from "./ActivityTab";

interface FileTabsProps {
  file: FileDetails;
  versionHistory: VersionHistory[];
  accessList: AccessEntry[];
  formatDate: (dateString: string) => string;
  formatDateShort: (dateString: string) => string;
  getPermissionIcon: (permissions: string) => React.ReactElement;
  getRoleColor: (role: string) => string;
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
  formatDate,
  formatDateShort,
  getPermissionIcon,
  getRoleColor,
}: FileTabsProps) {
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
