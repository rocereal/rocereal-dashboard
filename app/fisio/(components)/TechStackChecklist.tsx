"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleCheck,
  Code,
  Database,
  Globe,
  Palette,
  Shield,
  Zap,
} from "lucide-react";

const techStackData = [
  {
    category: "Core Framework",
    icon: Code,
    color: "blue",
    technologies: [
      { name: "Next.js 15.5.3", description: "React Framework" },
      { name: "React 19.1.0", description: "UI Library" },
      { name: "TypeScript 5", description: "Type Safety" },
    ],
  },
  {
    category: "UI Components",
    icon: Palette,
    color: "purple",
    technologies: [
      { name: "Radix UI", description: "Accessible Components" },
      { name: "Tailwind CSS 4", description: "Styling Framework" },
      { name: "Lucide React", description: "Icon Library" },
    ],
  },
  {
    category: "Data & Performance",
    icon: Database,
    color: "green",
    technologies: [
      { name: "TanStack Table", description: "Data Tables" },
      { name: "Recharts", description: "Data Visualization" },
      { name: "Motion", description: "Animations" },
    ],
  },
  {
    category: "Development Tools",
    icon: Zap,
    color: "orange",
    technologies: [
      { name: "Turbopack", description: "Fast Builds" },
      { name: "ESLint", description: "Code Quality" },
      { name: "Next.js Toploader", description: "Loading States" },
    ],
  },
  {
    category: "Utilities",
    icon: Shield,
    color: "cyan",
    technologies: [
      { name: "Date-fns", description: "Date Handling" },
      { name: "Sonner", description: "Notifications" },
      { name: "React BlurHash", description: "Image Optimization" },
    ],
  },
  {
    category: "Enhanced UX",
    icon: Globe,
    color: "pink",
    technologies: [
      { name: "Embla Carousel", description: "Image Carousels" },
      { name: "React Day Picker", description: "Date Selection" },
      { name: "CMDk", description: "Command Palette" },
    ],
  },
];

interface TechStackChecklistProps {
  title?: string;
  description?: string;
  className?: string;
}

export function TechStackChecklist({
  title = "Powerful Tools, Seamless Integration",
  description = "Fisio leverages cutting-edge technologies for optimal performance, developer experience, and user satisfaction.",
  className = "",
}: TechStackChecklistProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-600 dark:text-green-400",
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900/20",
        text: "text-orange-600 dark:text-orange-400",
      },
      cyan: {
        bg: "bg-cyan-100 dark:bg-cyan-900/20",
        text: "text-cyan-600 dark:text-cyan-400",
      },
      pink: {
        bg: "bg-pink-100 dark:bg-pink-900/20",
        text: "text-pink-600 dark:text-pink-400",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className={`py-6 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col text-start py-8 gap-2">
          <h2 className="text-base lg:text-4xl font-bold">{title}</h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStackData.map((category, index) => {
            const IconComponent = category.icon;
            const colorClasses = getColorClasses(category.color);

            return (
              <Card key={index} className="border shadow-none bg-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                      <IconComponent
                        className={`w-6 h-6 ${colorClasses.text}`}
                      />
                    </div>
                    <CardTitle className="text-xl">
                      {category.category}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center gap-3">
                      <CircleCheck className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{tech.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {tech.description}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="aspect-video border rounded-md overflow-x-hidden">
          <ImageComponentOptimized
            src={"/images/Cover Promos.webp"}
            alt={"Fisio"}
            unoptimized={true}
            className="object-cover w-full h-full"
            fill
          />
        </div>
      </div>
    </section>
  );
}
