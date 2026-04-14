"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { UserDetailsTabs } from "./components/UserDetailsTabs";
import type { User } from "@/data/users-data";

interface UserDetailsPageProps {
  userId: string;
}

type DbUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

function dbUserToUser(u: DbUser): User {
  const [firstName = "", ...rest] = (u.name ?? u.email).split(" ");
  return {
    id: u.id,
    email: u.email,
    firstName,
    lastName: rest.join(" "),
    avatar: u.image ?? "",
    role: (u.role as User["role"]) || "user",
    status: "active",
    plan: "free",
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    metadata: {
      timezone: "Europe/Bucharest",
      language: "ro",
      theme: "light",
      notifications: { email: true, push: false, sms: false, marketing: false },
      privacy: { profileVisibility: "team", dataSharing: false, analytics: false },
      totalLogins: 0,
      lastActive: u.updatedAt,
      sessionDuration: 0,
      featuresUsed: [],
      twoFactorEnabled: false,
      lastPasswordChange: u.updatedAt,
      loginAttempts: 0,
      securityQuestions: false,
      integrations: [],
    },
  };
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  manager: "bg-blue-100 text-blue-800",
  user: "bg-green-100 text-green-800",
  viewer: "bg-gray-100 text-gray-800",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" });

const formatDateTime = (d: string) =>
  new Date(d).toLocaleString("ro-RO", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function UserDetailsPage({ userId }: UserDetailsPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setUser(dbUserToUser(data));
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Se incarca...</div>;
  }

  if (notFound || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <p className="text-xl font-semibold">Utilizatorul nu a fost gasit</p>
        <p className="text-muted-foreground">ID: {userId}</p>
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`ID: ${user.id}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Utilizatori", href: "/apps/users" },
          { label: "Detalii utilizator" },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar as string} alt={user.firstName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center space-x-2">
                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                <Badge className="bg-green-100 text-green-800">Activ</Badge>
                <Badge className={roleColors[user.role] ?? "bg-gray-100 text-gray-800"}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Inregistrat {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Actualizat {formatDateTime(user.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserDetailsTabs user={user} formatDate={formatDate} formatDateTime={formatDateTime} />
    </div>
  );
}
