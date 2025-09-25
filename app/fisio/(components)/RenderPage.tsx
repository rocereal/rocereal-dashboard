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
  CheckCircle,
  Code,
  Database,
  FileText,
  Globe,
  Palette,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { CircularFloatingText, HeroSection } from "./Hero";
import PagesViews from "./PageTabs";
import TechStack from "./TechStack";
import { TechStackChecklist } from "./TechStackChecklist";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Navbar } from "./ResizableNavbar";
import { NavbarLanding } from "./Navbar";
import { Features } from "./Features";

/**
 * Fisio Dashboard Landing Page Component
 * Promotional landing page for the Fisio dashboard with hero section,
 * feature cards, and call-to-action buttons
 * @returns The JSX element representing the Fisio dashboard landing page
 */
export default function RenderPage() {
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
      <section id="hero">
        <HeroSection />
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack">
        <TechStack />
      </section>

      {/* Views Section */}
      <section id="views">
        <PagesViews />
      </section>

      {/* Technology Section */}
      <section id="technology">
        <TechStackChecklist />
      </section>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>
    </div>
  );
}
