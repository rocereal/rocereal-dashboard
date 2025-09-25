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
import { Eye, FileText, Shield, ArrowRight } from "lucide-react";

const pageViews = [
  {
    title: "Landing Pages",
    description: "Convert visitors with optimized landing page templates",
    icon: Eye,
    features: ["A/B testing", "Conversion tracking", "Mobile optimized"],
    preview: "/assets/images/background_one.jpg",
  },
  {
    title: "Documentation",
    description: "Comprehensive documentation with search and navigation",
    icon: FileText,
    features: ["Search functionality", "Version control", "API docs"],
    preview: "/assets/images/background_two.jpg",
  },
  {
    title: "Portfolio Pages",
    description: "Showcase work with beautiful portfolio layouts",
    icon: Shield,
    features: ["Gallery layouts", "Project showcases", "Client testimonials"],
    preview: "/assets/images/background_three.jpg",
  },
];

export default function PageViews() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-2">Page Views</h3>
      <p className="text-muted-foreground mb-6">
        Beautiful, functional pages for every use case.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageViews.map((view, index) => (
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
                View Page
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
