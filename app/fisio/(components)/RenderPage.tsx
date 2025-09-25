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
import { HeroSection } from "./Hero";
import PagesViews from "./PageTabs";
import TechStack from "./TechStack";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Tech Stack Section */}
      <TechStack />

      <PagesViews />
      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful Features for
              <span className="text-primary"> Modern Workflows</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your business efficiently, from
              analytics to team collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md"
                onMouseEnter={() => setIsHovered(`feature-${index}`)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageComponentOptimized
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full transition-all duration-300 ${
                      isHovered === `feature-${index}`
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {feature.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses already using Fisio to streamline their
            operations and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => (window.location.href = "/contact")}
            >
              <FileText className="mr-2 w-5 h-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
