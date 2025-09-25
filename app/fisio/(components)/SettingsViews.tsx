"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const settingsViews = [
  {
    title: "User Management",
    description: "Comprehensive user administration and access control",
    icon: Users,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/settings/users",
  },
  {
    title: "System Settings",
    description: "Configure system preferences and global options",
    icon: BarChart3,
    features: ["System Config", "Global Settings", "Preferences"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/settings/system",
  },
  {
    title: "Security & Privacy",
    description: "Advanced security controls and privacy settings",
    icon: TrendingUp,
    features: ["Security Settings", "Privacy Controls", "Access Management"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/settings/security",
  },
  {
    title: "Notifications",
    description: "Manage notification preferences and alerts",
    icon: Users,
    features: ["Email Alerts", "Push Notifications", "Alert Preferences"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/settings/notifications",
  },
];

export default function SettingsViews() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsViews.map((view, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden gap-4"
          >
            <div className="dark:hidden overflow-hidden rounded-t-lg flex-shrink-0 aspect-video flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <ImageComponentOptimized
                src={view.lightpreview}
                alt={view.title}
                className="object-contain"
                unoptimized={true}
              />
            </div>

            <div className="hidden dark:flex overflow-hidden rounded-t-lg flex-shrink-0 aspect-video items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <ImageComponentOptimized
                src={view.darkpreview}
                alt={view.title}
                className="object-contain"
                unoptimized={true}
              />
            </div>

            <CardContent className="flex flex-col justify-between py-6">
              <div className="flex flex-row justify-between align-center items-center py-6 w-full">
                <h1 className="text-primary font-medium">{view.title}</h1>
                <Link
                  shallow={true}
                  href={view.link}
                  passHref
                  style={{ textDecoration: "none" }}
                  className="cursor-pointer"
                >
                  <Button size="sm" variant={"outline"}>
                    View Demo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {view.features.map((feature, idx) => (
                  <Badge key={idx} variant="default" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
