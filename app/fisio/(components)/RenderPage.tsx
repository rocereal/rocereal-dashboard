"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  FileText,
  Globe,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { CircularFloatingText, HeroSection } from "./Hero";
import PagesViews from "./PageTabs";
import TechStack from "./TechStack";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Navbar } from "./ResizableNavbar";
import { NavbarLanding } from "./Navbar";

/**
 * Fisio Dashboard Landing Page Component
 * Promotional landing page for the Fisio dashboard with hero section,
 * feature cards, and call-to-action buttons
 * @returns The JSX element representing the Fisio dashboard landing page
 */
export default function RenderPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Get deep insights into your business metrics with powerful analytics and reporting tools.",
      image: "/assets/images/background_one.jpg",
      cta: "View Analytics",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Seamlessly collaborate with your team members with real-time updates and shared workspaces.",
      image: "/assets/images/background_two.jpg",
      cta: "Explore Collaboration",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Manage your calendar efficiently with intelligent scheduling and automated reminders.",
      image: "/assets/images/background_three.jpg",
      cta: "Schedule Now",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and advanced access controls.",
      image: "/assets/images/background_four.jpg",
      cta: "Learn Security",
    },
    {
      icon: TrendingUp,
      title: "Performance Monitoring",
      description:
        "Monitor your application's performance with real-time metrics and alerts.",
      image: "/assets/images/background_five.jpg",
      cta: "Monitor Performance",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with users worldwide with multi-language support and global infrastructure.",
      image: "/assets/images/background_six.jpg",
      cta: "Go Global",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* 👇 CIRCULAR FLOATING TEXT LAYOUT BELOW IMAGE */}
      <div className="mt-12 hidden sm:flex absolute top-12 left-0 w-full h-[100vh] z-20 justify-center items-center">
        <CircularFloatingText
          items={[
            "📊 Analytics",
            "💬 128 Comments",
            "↑ 245",
            "✅ Completed",
            "⭐ Favorites",
            "👥 1.2k Users",
            "⚡ Fast Reports",
            "💼 Projects",
            "🔔 Alerts",
            "📈 Growth",
          ]}
        />
      </div>

      <NavbarLanding />
      {/* Hero Section */}
      <HeroSection />

      {/* Tech Stack Section */}
      <TechStack />

      <PagesViews />
    </div>
  );
}
