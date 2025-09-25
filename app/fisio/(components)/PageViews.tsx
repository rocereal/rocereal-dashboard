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
    description: "Clean and centered authentication pages with modern design",
    icon: BarChart3,
    features: ["Secure Login", "Password Recovery", "User Registration"],
    lightpreview: "/images/Light Centered Authentication.png",
    darkpreview: "/images/Dark Centered Authentication.png",
    link: "/pages/authentication/centered/login",
  },
  {
    title: "Minimal Authentication",
    description: "Minimalist authentication design with subtle styling",
    icon: Users,
    features: ["Simple Interface", "Fast Loading", "Clean Aesthetics"],
    lightpreview: "/images/Light Minimal Authentication.png",
    darkpreview: "/images/Dark Minimal Authentication.png",
    link: "/pages/authentication/minimal/login",
  },
  {
    title: "Split-Left Authentication",
    description: "Split-screen authentication with content on the left side",
    icon: TrendingUp,
    features: ["Visual Balance", "Enhanced UX", "Modern Layout"],
    lightpreview: "/images/Light Split-Left Authentication.png",
    darkpreview: "/images/Dark Split-Left Authentication.png",
    link: "/pages/authentication/split-left/login",
  },
  {
    title: "Split-Right Authentication",
    description: "Split-screen authentication with content on the right side",
    icon: TrendingUp,
    features: ["Asymmetric Design", "Visual Hierarchy", "Engaging Layout"],
    lightpreview: "/images/Light Split-Right Authentication.png",
    darkpreview: "/images/Dark Split-Right Authentication.png",
    link: "/pages/authentication/split-right/login",
  },
  {
    title: "Split-Left Onboarding",
    description: "Multi-step onboarding flow with left-aligned content",
    icon: TrendingUp,
    features: ["Guided Setup", "Progress Tracking", "User-Friendly Flow"],
    lightpreview: "/images/Light Split-Left Onboarding.png",
    darkpreview: "/images/Dark Split-Left Onboarding.png",
    link: "/pages/onboarding/split-left/step-one",
  },
  {
    title: "Split-Right Onboarding",
    description: "Multi-step onboarding flow with right-aligned content",
    icon: TrendingUp,
    features: ["Interactive Steps", "Visual Guidance", "Seamless Experience"],
    lightpreview: "/images/Light Split-Right Onboarding.png",
    darkpreview: "/images/Dark Split-Right Onboarding.png",
    link: "/pages/onboarding/split-right/step-one",
  },
  {
    title: "Calendar Dashboard",
    description: "Smart scheduling with team collaboration features",
    icon: BarChart3,
    features: ["Event Scheduling", "Team Calendar", "Meeting Rooms"],
    lightpreview: "/images/Light Calendar Dashboard.png",
    darkpreview: "/images/Dark Calendar Dashboard.png",
    link: "/apps/calendar",
  },
  {
    title: "Tasks Dashboard",
    description: "Project management with kanban boards and timelines",
    icon: Users,
    features: ["Kanban Boards", "Task Tracking", "Team Projects"],
    lightpreview: "/images/Light Tasks Dashboard.png",
    darkpreview: "/images/Dark Tasks Dashboard.png",
    link: "/apps/tasks",
  },
  {
    title: "Messenger Dashboard",
    description: "Unified messaging with video calls and file sharing",
    icon: TrendingUp,
    features: ["Video Calls", "File Sharing", "Team Chat"],
    lightpreview: "/images/Light Messenger Dashboard.png",
    darkpreview: "/images/Dark Messenger Dashboard.png",
    link: "/apps/messenger",
  },
  {
    title: "Email Dashboard",
    description: "Professional email management and communication",
    icon: TrendingUp,
    features: ["Email Templates", "Contact Management", "Inbox Organization"],
    lightpreview: "/images/Light Email Dashboard.png",
    darkpreview: "/images/Dark Email Dashboard.png",
    link: "/apps/email",
  },
  {
    title: "Files Dashboard",
    description: "Secure file storage and collaboration platform",
    icon: TrendingUp,
    features: ["Cloud Storage", "File Sharing", "Version History"],
    lightpreview: "/images/Light Files Dashboard.png",
    darkpreview: "/images/Dark Files Dashboard.png",
    link: "/apps/files",
  },
  {
    title: "Invoice Management",
    description: "Streamlined invoicing and payment management",
    icon: TrendingUp,
    features: ["Invoice Creation", "Payment Tracking", "Client Portal"],
    lightpreview: "/images/Light Invoice Management.png",
    darkpreview: "/images/Dark Invoice Management.png",
    link: "/apps/invoice",
  },
  {
    title: "E-commerce Dashboard",
    description: "Complete online store management solution",
    icon: TrendingUp,
    features: ["Product Catalog", "Order Management", "Sales Analytics"],
    lightpreview: "/images/Light E-commerce Performance Dashboard.png",
    darkpreview: "/images/Dark E-commerce Performance Dashboard.png",
    link: "/apps/ecommerce/products",
  },
  {
    title: "Real Estate Management",
    description: "Property management and listing platform",
    icon: TrendingUp,
    features: ["Property Listings", "Market Analysis", "Client Database"],
    lightpreview: "/images/Light Real Estate Management.png",
    darkpreview: "/images/Dark Real Estate Management.png",
    link: "/apps/real-estate",
  },
  {
    title: "Learning Management",
    description: "Educational platform for courses and training",
    icon: TrendingUp,
    features: ["Course Builder", "Student Progress", "Certification"],
    lightpreview: "/images/Light Learning Performance Dashboard.png",
    darkpreview: "/images/Dark Learning Performance Dashboard.png",
    link: "/apps/lms",
  },
  {
    title: "User Management",
    description: "Comprehensive user administration system",
    icon: TrendingUp,
    features: ["User Roles", "Access Control", "Audit Logs"],
    lightpreview: "/images/Light User Management - Fisio Dashboard.png",
    darkpreview: "/images/Dark User Management - Fisio Dashboard.png",
    link: "/apps/users",
  },
  {
    title: "Contact Form",
    description: "Professional contact form with validation and messaging",
    icon: TrendingUp,
    features: ["Form Validation", "Email Integration", "User Feedback"],
    lightpreview: "/images/Light Contact Form.png",
    darkpreview: "/images/Dark Contact Form.png",
    link: "/pages/contact",
  },
  {
    title: "Pricing Plans",
    description: "Flexible pricing plans with feature comparisons",
    icon: TrendingUp,
    features: [
      "Plan Comparison",
      "Feature Highlights",
      "Subscription Management",
    ],
    lightpreview: "/images/Light Pricing Plans.png",
    darkpreview: "/images/Dark Pricing Plans.png",
    link: "/pages/pricing",
  },
  {
    title: "Pricing Classic",
    description: "Classic pricing design with clear feature breakdown",
    icon: TrendingUp,
    features: ["Clear Pricing", "Feature Lists", "Call-to-Action"],
    lightpreview: "/images/Light Pricing Plans - Classic Design.png",
    darkpreview: "/images/Dark Pricing Plans - Classic Design.png",
    link: "/pages/pricing/classic",
  },
  {
    title: "Frequently Asked Questions",
    description: "Comprehensive FAQ section with search functionality",
    icon: TrendingUp,
    features: [
      "Search Functionality",
      "Categorized Questions",
      "Quick Answers",
    ],
    lightpreview: "/images/Light Frequently Asked Questions.png",
    darkpreview: "/images/Dark Frequently Asked Questions.png",
    link: "/pages/faq",
  },
  {
    title: "404 Page Not Found",
    description: "User-friendly 404 error page with navigation options",
    icon: TrendingUp,
    features: ["Clear Messaging", "Navigation Help", "Search Suggestions"],
    lightpreview: "/images/Light Page Not Found.png",
    darkpreview: "/images/Dark Page Not Found.png",
    link: "/pages/errors/404",
  },
  {
    title: "Maintenance Mode",
    description: "Professional maintenance page with status updates",
    icon: TrendingUp,
    features: ["Status Updates", "ETA Information", "Contact Options"],
    lightpreview: "/images/Light Maintenance Mode.png",
    darkpreview: "/images/Dark Maintenance Mode.png",
    link: "/pages/errors/maintenance",
  },
  {
    title: "Coming Soon - Centered",
    description: "Centered coming soon page with countdown timer",
    icon: TrendingUp,
    features: ["Countdown Timer", "Email Signup", "Social Links"],
    lightpreview: "/images/Light Centered Coming Soon.png",
    darkpreview: "/images/Dark Centered Coming Soon.png",
    link: "/pages/coming-soon/centered",
  },
  {
    title: "Coming Soon - Minimal",
    description: "Minimal coming soon design with clean aesthetics",
    icon: TrendingUp,
    features: ["Simple Design", "Newsletter Signup", "Brand Focus"],
    lightpreview: "/images/Light Minimal Coming Soon.png",
    darkpreview: "/images/Dark Minimal Coming Soon.png",
    link: "/pages/coming-soon/minimal",
  },
  {
    title: "Coming Soon - Split Left",
    description: "Split-screen coming soon with content on the left",
    icon: TrendingUp,
    features: ["Visual Balance", "Engaging Layout", "Call-to-Action"],
    lightpreview: "/images/Light Split-Left Coming Soon.png",
    darkpreview: "/images/Dark Split-Left Coming Soon.png",
    link: "/pages/coming-soon/split-left",
  },
  {
    title: "Coming Soon - Split Right",
    description: "Split-screen coming soon with content on the right",
    icon: TrendingUp,
    features: ["Asymmetric Design", "Visual Impact", "User Engagement"],
    lightpreview: "/images/Light Split-Right Coming Soon.png",
    darkpreview: "/images/Dark Split-Right Coming Soon.png",
    link: "/pages/coming-soon/split-right",
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
