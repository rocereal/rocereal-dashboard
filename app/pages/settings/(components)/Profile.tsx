"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Profile() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
    }
  }, [session]);

  const getInitials = (n: string) =>
    n.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Eroare la salvare"); return; }
      await update({ name: data.name, email: data.email });
      toast.success("Profil actualizat cu succes");
    } catch {
      toast.error("Eroare de retea");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informatii Profil</CardTitle>
          <CardDescription>
            Actualizeaza informatiile tale personale si setarile profilului.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user?.image ?? ""} alt="Profile" />
              <AvatarFallback>{name ? getInitials(name) : "?"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">{name || "—"}</p>
              <p className="text-sm text-muted-foreground">{email || "—"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nume complet</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Numele tau"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplu.ro"
            />
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <Input
              value={(session?.user as { role?: string })?.role ?? "user"}
              disabled
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Se salveaza..." : "Salveaza Modificarile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
