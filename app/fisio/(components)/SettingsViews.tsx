"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Settings, Shield, ArrowRight } from "lucide-react";

const settingsViews = [
  {
    title: "User Management",
    description: "Manage users, roles, and permissions",
    icon: Users,
    features: ["Role-based access", "User invitations", "Permission matrix"],
    preview: "/assets/images/background_four.jpg",
  },
  {
    title: "System Configuration",
    description: "Configure system settings and integrations",
    icon: Settings,
    features: ["API integrations", "System preferences", "Backup settings"],
    preview: "/assets/images/background_five.jpg",
  },
  {
    title: "Security Settings",
    description: "Advanced security controls and monitoring",
    icon: Shield,
    features: ["Two-factor auth", "Security logs", "Access controls"],
    preview: "/assets/images/background_six.jpg",
  },
];

export default function SettingsViews() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-2">Settings Views</h3>
      <p className="text-muted-foreground mb-6">
        Comprehensive settings and configuration options.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsViews.map((view, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-32 overflow-hidden rounded-t-lg">
              <img
                src={view.preview}
                alt={view.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <view.icon className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{view.title}</CardTitle>
              <CardDescription>{view.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {view.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button className="w-full" size="sm">
                Configure
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
