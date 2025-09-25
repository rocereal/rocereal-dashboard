"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const dashboardViews = [
  {
    title: "AI Dashboard",
    description:
      "Advanced AI analytics with machine learning insights and predictive modeling",
    icon: BarChart3,
    features: ["Predictive Analytics", "ML Model Monitoring", "AI Insights"],
    lightpreview: "/images/Light Artificial Intelligence Dashboard.png",
    darkpreview: "/images/Dark Artificial Intelligence Dashboard.png",
    link: "/ai",
  },
  {
    title: "CRM Dashboard",
    description:
      "Customer relationship management with lead tracking and sales automation",
    icon: Users,
    features: ["Lead Management", "Customer Insights", "Sales Pipeline"],
    lightpreview: "/images/Light Customer Relationship Dashboard.png",
    darkpreview: "/images/Dark Customer Relationship Dashboard.png",
    link: "/crm",
  },
  {
    title: "Crypto Dashboard",
    description:
      "Cryptocurrency portfolio tracking with real-time market data and analytics",
    icon: TrendingUp,
    features: ["Portfolio Tracking", "Market Analysis", "Price Alerts"],
    lightpreview: "/images/Light Crypto Performance Dashboard.png",
    darkpreview: "/images/Dark Crypto Performance Dashboard.png",
    link: "/crypto",
  },
  {
    title: "E-commerce Dashboard",
    description:
      "Online store management with sales tracking and inventory control",
    icon: TrendingUp,
    features: ["Sales Analytics", "Inventory Management", "Order Processing"],
    lightpreview: "/images/Light E-commerce Performance Dashboard.png",
    darkpreview: "/images/Dark E-commerce Performance Dashboard.png",
    link: "/ecommerce",
  },
  {
    title: "Education Dashboard",
    description:
      "Learning management system with course tracking and student progress",
    icon: TrendingUp,
    features: ["Course Management", "Student Progress", "Assessment Tools"],
    lightpreview: "/images/Light Learning Performance Dashboard.png",
    darkpreview: "/images/Dark Learning Performance Dashboard.png",
    link: "/education",
  },
  {
    title: "Finance Dashboard",
    description:
      "Financial overview with budgeting, expense tracking, and investment monitoring",
    icon: TrendingUp,
    features: ["Budget Tracking", "Expense Reports", "Investment Analytics"],
    lightpreview: "/images/Light Financial Performance Dashboard.png",
    darkpreview: "/images/Dark Financial Performance Dashboard.png",
    link: "/finance",
  },
];

export default function DashboardViews() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardViews.map((view, index) => (
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
