"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Settings, Users } from "lucide-react";
import { AccessEntry, getRoleColor } from "@/data/files";

interface AccessSharingTabProps {
  accessList: AccessEntry[];
  formatDateShort: (dateString: string) => string;
}

export default function AccessSharingTab({
  accessList,
  formatDateShort,
}: AccessSharingTabProps) {
  return (
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
            {accessList.map((access) => (
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
                      <p className="text-sm font-medium">{access.user.name}</p>
                      <p className="text-xs text-gray-500">
                        {access.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getRoleColor(access.role)}`}>
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
  );
}
