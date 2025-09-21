"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, User } from "lucide-react";
import { FileDetails } from "@/data/files";

interface FileDetailsTabProps {
  file: FileDetails;
  formatDate: (dateString: string) => string;
  getPermissionIcon: (permissions: string) => React.ReactElement;
}

export default function FileDetailsTab({
  file,
  formatDate,
  getPermissionIcon,
}: FileDetailsTabProps) {
  return (
    <div className="space-y-6">
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
                  <span className="text-sm capitalize">{file.permissions}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Created
                </Label>
                <p className="text-sm mt-1">{formatDate(file.createdDate)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Modified
                </Label>
                <p className="text-sm mt-1">{formatDate(file.modifiedDate)}</p>
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
                <p className="text-sm text-gray-500">{file.owner.email}</p>
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
    </div>
  );
}
