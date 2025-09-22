"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Lock, Globe } from "lucide-react";
import {
  mockUsersForSharing,
  permissionOptions,
  getRoleColor,
} from "@/data/files";
import { mockContacts } from "@/data/contacts";

interface AccessSharingSectionProps {
  permissions: "private" | "shared" | "public";
  onPermissionsChange: (permissions: "private" | "shared" | "public") => void;
  selectedUsers: string[];
  onUserToggle: (userId: string) => void;
  userRoles: Record<string, "viewer" | "editor">;
  onRoleChange: (userId: string, role: "viewer" | "editor") => void;
}

export default function AccessSharingSection({
  permissions,
  onPermissionsChange,
  selectedUsers,
  onUserToggle,
  userRoles,
  onRoleChange,
}: AccessSharingSectionProps) {
  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "private":
        return <Lock className="h-4 w-4" />;
      case "shared":
        return <Users className="h-4 w-4" />;
      case "public":
        return <Globe className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Access & Sharing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Level */}
        <div className="space-y-3">
          <Label>Permission Level</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {permissionOptions.map((option) => (
              <div
                key={option.value}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  permissions === option.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 dark:border-secondary"
                }`}
                onClick={() =>
                  onPermissionsChange(
                    option.value as "private" | "shared" | "public"
                  )
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  {getPermissionIcon(option.value)}
                  <span className="font-medium">{option.label}</span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Sharing (only show for shared permission) */}
        {permissions === "shared" && (
          <div className="space-y-4">
            <Label>Share with Users</Label>
            <div className="space-y-3">
              {mockContacts.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap gap-4 items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => onUserToggle(user.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          (typeof user.avatar === "string"
                            ? user.avatar
                            : user.avatar?.src) ||
                          `/avatars/${user.name
                            .toLowerCase()
                            .replace(" ", "-")}.jpg`
                        }
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  {selectedUsers.includes(user.id) && (
                    <Select
                      value={userRoles[user.id] || "viewer"}
                      onValueChange={(value: "viewer" | "editor") =>
                        onRoleChange(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer" className="bg-secondary">
                          Viewer
                        </SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>

            {selectedUsers.length > 0 && (
              <div className="p-3 bg-secondary border rounded-md">
                <p className="text-sm ">
                  <Users className="h-4 w-4 inline mr-1" />
                  File will be shared with {selectedUsers.length} user
                  {selectedUsers.length > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
