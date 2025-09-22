"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { users } from "@/data/users-data";
import {
  Activity,
  Bell,
  Briefcase,
  Calendar,
  Clock,
  CreditCard,
  Link as LinkIcon,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import { useMemo } from "react";

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
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
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
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
              <div className="flex items-center space-x-4 text-sm">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.metadata.dateOfBirth && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date of Birth</span>
                <span>{formatDate(user.metadata.dateOfBirth)}</span>
              </div>
            )}
            {user.metadata.gender && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender</span>
                <span className="capitalize">
                  {user.metadata.gender.replace("_", " ")}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone</span>
              <span>{user.metadata.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language</span>
              <span>{user.metadata.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theme</span>
              <span className="capitalize">{user.metadata.theme}</span>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Professional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.metadata.jobTitle && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Job Title</span>
                <span>{user.metadata.jobTitle}</span>
              </div>
            )}
            {user.metadata.department && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span>{user.metadata.department}</span>
              </div>
            )}
            {user.metadata.company && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company</span>
                <span>{user.metadata.company}</span>
              </div>
            )}
            {user.metadata.industry && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span>{user.metadata.industry}</span>
              </div>
            )}
            {user.metadata.experience && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span>{user.metadata.experience}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity & Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Activity & Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Logins</span>
              <span>{user.metadata.totalLogins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Active</span>
              <span>{formatDateTime(user.metadata.lastActive)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Avg. Session Duration
              </span>
              <span>{user.metadata.sessionDuration} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Features Used</span>
              <span>{user.metadata.featuresUsed.length}</span>
            </div>
            {user.metadata.featuresUsed.length > 0 && (
              <div className="space-y-2">
                <span className="text-muted-foreground text-sm">Features:</span>
                <div className="flex flex-wrap gap-1">
                  {user.metadata.featuresUsed.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security & Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Two-Factor Auth</span>
              <Badge
                variant={user.metadata.twoFactorEnabled ? "default" : "outline"}
                className={
                  user.metadata.twoFactorEnabled
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {user.metadata.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Security Questions</span>
              <Badge
                variant={
                  user.metadata.securityQuestions ? "default" : "outline"
                }
                className={
                  user.metadata.securityQuestions
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {user.metadata.securityQuestions ? "Set" : "Not Set"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Last Password Change
              </span>
              <span>{formatDate(user.metadata.lastPasswordChange)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Login Attempts</span>
              <span>{user.metadata.loginAttempts}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription & Billing */}
        {(user.metadata.subscriptionId ||
          user.metadata.billingCycle ||
          user.metadata.paymentMethod) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Subscription & Billing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <Badge variant="outline" className="capitalize">
                  {user.plan}
                </Badge>
              </div>
              {user.metadata.subscriptionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscription ID</span>
                  <span className="font-mono text-sm">
                    {user.metadata.subscriptionId}
                  </span>
                </div>
              )}
              {user.metadata.billingCycle && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="capitalize">
                    {user.metadata.billingCycle}
                  </span>
                </div>
              )}
              {user.metadata.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">
                    {user.metadata.paymentMethod}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notifications & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications & Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">
                Notification Preferences:
              </span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Email</span>
                  <Badge
                    variant={
                      user.metadata.notifications.email ? "default" : "outline"
                    }
                    className={
                      user.metadata.notifications.email
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {user.metadata.notifications.email ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Push</span>
                  <Badge
                    variant={
                      user.metadata.notifications.push ? "default" : "outline"
                    }
                    className={
                      user.metadata.notifications.push
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {user.metadata.notifications.push ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>SMS</span>
                  <Badge
                    variant={
                      user.metadata.notifications.sms ? "default" : "outline"
                    }
                    className={
                      user.metadata.notifications.sms
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {user.metadata.notifications.sms ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Marketing</span>
                  <Badge
                    variant={
                      user.metadata.notifications.marketing
                        ? "default"
                        : "outline"
                    }
                    className={
                      user.metadata.notifications.marketing
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {user.metadata.notifications.marketing ? "On" : "Off"}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">
                Privacy Settings:
              </span>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Profile Visibility</span>
                  <span className="capitalize">
                    {user.metadata.privacy.profileVisibility}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data Sharing</span>
                  <Badge
                    variant={
                      user.metadata.privacy.dataSharing ? "default" : "outline"
                    }
                    className={
                      user.metadata.privacy.dataSharing
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {user.metadata.privacy.dataSharing ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Analytics</span>
                  <Badge
                    variant={
                      user.metadata.privacy.analytics ? "default" : "outline"
                    }
                    className={
                      user.metadata.privacy.analytics
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {user.metadata.privacy.analytics ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links & Integrations */}
        {(user.metadata.socialLinks ||
          user.metadata.integrations.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="w-5 h-5" />
                <span>Social Links & Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.metadata.socialLinks && (
                <div className="space-y-2">
                  <span className="text-muted-foreground text-sm">
                    Social Links:
                  </span>
                  <div className="space-y-1 text-sm">
                    {user.metadata.socialLinks.linkedin && (
                      <div className="flex items-center space-x-2">
                        <span className="w-16">LinkedIn</span>
                        <a
                          href={user.metadata.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {user.metadata.socialLinks.linkedin}
                        </a>
                      </div>
                    )}
                    {user.metadata.socialLinks.twitter && (
                      <div className="flex items-center space-x-2">
                        <span className="w-16">Twitter</span>
                        <a
                          href={user.metadata.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {user.metadata.socialLinks.twitter}
                        </a>
                      </div>
                    )}
                    {user.metadata.socialLinks.github && (
                      <div className="flex items-center space-x-2">
                        <span className="w-16">GitHub</span>
                        <a
                          href={user.metadata.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {user.metadata.socialLinks.github}
                        </a>
                      </div>
                    )}
                    {user.metadata.socialLinks.website && (
                      <div className="flex items-center space-x-2">
                        <span className="w-16">Website</span>
                        <a
                          href={user.metadata.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {user.metadata.socialLinks.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {user.metadata.integrations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-muted-foreground text-sm">
                    Integrations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {user.metadata.integrations.map((integration) => (
                      <Badge
                        key={integration}
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {integration.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
