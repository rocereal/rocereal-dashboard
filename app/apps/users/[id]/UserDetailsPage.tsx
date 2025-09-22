"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { users } from "@/data/users-data";
import { Calendar, Clock, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { UserDetailsTabs } from "./components/UserDetailsTabs";

interface UserDetailsPageProps {
  userId: string;
}

export default function UserDetailsPage({ userId }: UserDetailsPageProps) {
  const user = useMemo(() => {
    return users.find((u) => u.id === userId);
  }, [userId]);

  if (!user) {
    notFound();
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-red-100 text-red-800",
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    user: "bg-green-100 text-green-800",
    viewer: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`User ID: ${user.id}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Users", href: "/apps/users" },
          { label: "User Details" },
        ]}
      />

      {/* User Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start space-x-4">
            <Avatar className="w-20 h-20">
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
            <div className="flex-1 flex-wrap space-y-2">
              <div className="flex flex-wrap items-center space-x-2">
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <Badge className={statusColors[user.status]}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
                <Badge className={roleColors[user.role]}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.metadata.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{user.metadata.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 items-center text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                {user.lastLogin && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Last login {formatDateTime(user.lastLogin)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <UserDetailsTabs
        user={user}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />
    </div>
  );
}
