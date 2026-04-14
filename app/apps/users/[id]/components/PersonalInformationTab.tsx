/**
 * Personal Information Tab Component
 * Displays and allows editing of user's personal information, emergency contacts, and addresses
 * Provides form inputs for personal details and manages dynamic lists of contacts and addresses
 * Used within the user details tabs interface for comprehensive profile management
 */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/data/users-data";
import { User as UserIcon } from "lucide-react";

interface PersonalInformationTabProps {
  user: User;
  formatDate: (dateString: string) => string;
}

export function PersonalInformationTab({ user }: PersonalInformationTabProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={
                  (typeof user.avatar === "string"
                    ? user.avatar
                    : user.avatar?.src) ||
                  `/avatars/${user.firstName
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`
                }
                alt={user.firstName}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user.lastName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={user.metadata.phone || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    defaultValue={user.metadata.dateOfBirth || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    defaultValue={user.metadata.gender || ""}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
