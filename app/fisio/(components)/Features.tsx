"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CheckCircle,
  Code,
  Database,
  Globe,
  Palette,
  Shield,
  Zap,
} from "lucide-react";

const featuresData = [
  {
    title: "Next.js 15 & React 19",
    description: "Template Fisio Next.js construit cu Next.js 16 & React 19",
    icon: Code,
    color: "blue",
  },
  {
    title: "Tailwind 4",
    description: "Stilizat cu Tailwind CSS pentru personalizare completa",
    icon: Palette,
    color: "purple",
  },
  {
    title: "Mod Luminos/Intunecat",
    description: "Fisio – Template modern Next.js cu tema luminoasa/intunecata",
    icon: Shield,
    color: "orange",
  },
  {
    title: "Componente Reutilizabile",
    description: "Componente reutilizabile, curate si modulare",
    icon: Database,
    color: "cyan",
  },
  {
    title: "Responsive",
    description: "Design complet responsive pe toate dispozitivele",
    icon: Globe,
    color: "pink",
  },
  {
    title: "Usor de Folosit",
    description:
      "Template Fisio vine cu o structura de foldere prietenoasa pentru dezvoltatori",
    icon: CheckCircle,
    color: "blue",
  },
  {
    title: "Creste Interactiunea",
    description:
      "Implica-ti audienta cu un design uimitor si intuitiv care ii tine captivati.",
    icon: Zap,
    color: "purple",
  },
  {
    title: "Documentatie Detaliata",
    description: "Am creat o documentatie detaliata, astfel incat e usor de folosit.",
    icon: Database,
    color: "green",
  },
  {
    title: "Suport Dedicat",
    description: "Credem ca suportul de calitate este esential, si il oferim.",
    icon: Shield,
    color: "orange",
  },
];

interface TechStackChecklistProps {
  title?: string;
  description?: string;
  className?: string;
}

export function Features({
  title = "Plin de Functionalitati Puternice",
  description = "De la componente reutilizabile la layout-uri responsive, totul este construit sa te ajute sa mergi mai repede si sa construiesti mai inteligent.",
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col text-start py-8 gap-2">
          <h2 className="text-base lg:text-4xl font-bold">{title}</h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon;
            const colorClasses = getColorClasses(feature.color);

            return (
              <Card key={index} className="border bg-transparent shadow-none">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                      <IconComponent
                        className={`w-6 h-6 ${colorClasses.text}`}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">{feature.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
