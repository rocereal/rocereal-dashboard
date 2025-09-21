"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, History } from "lucide-react";
import { VersionHistory } from "@/data/files";

interface VersionHistoryTabProps {
  versionHistory: VersionHistory[];
  formatDate: (dateString: string) => string;
}

export default function VersionHistoryTab({
  versionHistory,
  formatDate,
}: VersionHistoryTabProps) {
  return (
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
            {versionHistory.map((version) => (
              <TableRow key={version.id}>
                <TableCell className="font-medium">{version.version}</TableCell>
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
                <TableCell className="text-sm">{version.size}</TableCell>
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
  );
}
