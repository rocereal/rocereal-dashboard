"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const pageViews = [
  {
    title: "Centered Authentication",
    description: "Smart scheduling with team collaboration features",
    icon: BarChart3,
    features: ["Event Scheduling", "Team Calendar", "Meeting Rooms"],
    lightpreview: "/images/Light Calendar Dashboard.png",
    darkpreview: "/images/Dark Calendar Dashboard.png",
    link: "/apps/calendar",
  },
  {
    title: "Minimal Authentication",
    description: "Project management with kanban boards and timelines",
    icon: Users,
    features: ["Kanban Boards", "Task Tracking", "Team Projects"],
    lightpreview: "/images/Light Tasks Dashboard.png",
    darkpreview: "/images/Dark Tasks Dashboard.png",
    link: "/apps/tasks",
  },
  {
    title: "Split-Left Authentication",
    description: "Unified messaging with video calls and file sharing",
    icon: TrendingUp,
    features: ["Video Calls", "File Sharing", "Team Chat"],
    lightpreview: "/images/Light Messenger Dashboard.png",
    darkpreview: "/images/Dark Messenger Dashboard.png",
    link: "/apps/messenger",
  },
  {
    title: "Split-Right Authentication",
    description: "Professional email management and communication",
    icon: TrendingUp,
    features: ["Email Templates", "Contact Management", "Inbox Organization"],
    lightpreview: "/images/Light Email Dashboard.png",
    darkpreview: "/images/Dark Email Dashboard.png",
    link: "/apps/email",
  },
  {
    title: "Centered Onboarding",
    description: "Secure file storage and collaboration platform",
    icon: TrendingUp,
    features: ["Cloud Storage", "File Sharing", "Version History"],
    lightpreview: "/images/Light Files Dashboard.png",
    darkpreview: "/images/Dark Files Dashboard.png",
    link: "/apps/files",
  },
  {
    title: "Minimal Authentication",
    description: "Streamlined invoicing and payment management",
    icon: TrendingUp,
    features: ["Invoice Creation", "Payment Tracking", "Client Portal"],
    lightpreview: "/images/Light Invoice Management.png",
    darkpreview: "/images/Dark Invoice Management.png",
    link: "/apps/invoice",
  },
  {
    title: "Split-Left Authentication",
    description: "Complete online store management solution",
    icon: TrendingUp,
    features: ["Product Catalog", "Order Management", "Sales Analytics"],
    lightpreview: "/images/Light E-commerce Performance Dashboard.png",
    darkpreview: "/images/Dark E-commerce Performance Dashboard.png",
    link: "/apps/ecommerce/products",
  },
  {
    title: "Split-Right Authentication",
    description: "Property management and listing platform",
    icon: TrendingUp,
    features: ["Property Listings", "Market Analysis", "Client Database"],
    lightpreview: "/images/Light Real Estate Management.png",
    darkpreview: "/images/Dark Real Estate Management.png",
    link: "/apps/real-estate",
  },
  {
    title: "Contact",
    description: "Educational platform for courses and training",
    icon: TrendingUp,
    features: ["Course Builder", "Student Progress", "Certification"],
    lightpreview: "/images/Light Learning Performance Dashboard.png",
    darkpreview: "/images/Dark Learning Performance Dashboard.png",
    link: "/apps/lms",
  },
  {
    title: "FAQ",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "404",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "Maintenance",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "404",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "Onboarding Split-Left",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "Onboarding Split-Right",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "Pricing Classic",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "Pricing Classic-Icons",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
];

export default function PageViews() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageViews.map((view, index) => (
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

            <CardContent className="flex flex-col justify-between align-start items-start py-6">
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
              <div className="flex flex-wrap gap-1">
                {view.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
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
