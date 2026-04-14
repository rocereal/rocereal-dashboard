"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { userActions } from "@/data/users-data";
import type { User } from "@/data/users-data";
import { User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { UserFilters, UserMetricsComponent, UsersTable } from "./(components)";
import Link from "next/link";
import { toast } from "sonner";

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

export default function UsersPage() {
  const router = useRouter();
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Eroare la incarcare");
      setDbUsers(await res.json());
    } catch {
      toast.error("Nu s-au putut incarca userii");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const users = useMemo(() => dbUsers.map(dbUserToUser), [dbUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const metrics = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.length,
    inactiveUsers: 0,
    pendingUsers: 0,
    suspendedUsers: 0,
    usersByRole: users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {} as Record<string, number>),
    usersByPlan: { free: users.length },
    averageSessionDuration: 0,
    totalLogins: 0,
    newUsersThisMonth: 0,
    churnRate: 0,
  }), [users]);

  const handleAction = async (userId: string, action: string) => {
    if (action === "view") {
      router.push(`/apps/users/${userId}`);
      return;
    }
    if (action === "delete") {
      if (!confirm("Stergi definitiv acest utilizator?")) return;
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Utilizator sters");
        fetchUsers();
      } else {
        const d = await res.json();
        toast.error(d.error || "Eroare la stergere");
      }
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Gestionare Utilizatori"
        subtitle="Vizualizeaza si administreaza conturile utilizatorilor"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Utilizatori" }]}
      />

      <UserMetricsComponent metrics={metrics} />

      <UserFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        planFilter={planFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        onPlanFilterChange={setPlanFilter}
        onClearFilters={() => {
          setSearchTerm(""); setStatusFilter(""); setRoleFilter(""); setPlanFilter("");
        }}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Utilizatori ({filteredUsers.length})
          </h2>
          <Link href="/apps/users/add-user">
            <Button>
              <UserIcon className="w-4 h-4 mr-2" />
              Adauga utilizator
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Se incarca...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Niciun utilizator gasit.
          </div>
        ) : (
          <UsersTable
            users={filteredUsers}
            actions={userActions}
            onAction={handleAction}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
          />
        )}
      </div>
    </div>
  );
}
