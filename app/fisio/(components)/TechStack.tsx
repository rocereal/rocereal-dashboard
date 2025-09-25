import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Palette,
  Atom,
  Layers,
} from "lucide-react";
import { useState } from "react";

export default function TechStackUI() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (techName: string) => {
    setImageErrors((prev) => ({ ...prev, [techName]: true }));
  };

  const techStack = [
    {
      name: "Next.js",
      version: "v15.5.3",
      icon: Globe,
      logo: "/images/Nextjs.svg",
      fallbackIcon: Globe,
    },
    {
      name: "React",
      version: "v19",
      icon: Atom,
      logo: "/images/React.svg",
      fallbackIcon: Atom,
    },
    {
      name: "Tailwind",
      version: "v4",
      logo: "/images/Tailwind.svg",
      fallbackIcon: Palette,
    },
    {
      name: "TypeScript",
      version: "v5",
      logo: "/images/TypeScript.svg",
      fallbackIcon: FileText,
    },
    {
      name: "Radix",
      version: "Latest",
      logo: "/images/Radix.svg",
      fallbackIcon: Shield,
    },
    {
      name: "Shadcn",
      version: "Custom",
      logo: "/images/Shadcn.svg",
      fallbackIcon: Layers,
    },
  ];

  return (
    <div>
      {/* Tech Stack Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 bg-card md:grid-cols-2 lg:grid-cols-6 border rounded-md p-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative align-center px-4 first:pl-0 last:pr-0 lg:border-r lg:border-border/50 lg:last:border-r-0"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <ImageComponentOptimized
                          src={tech.logo}
                          alt={`${tech.name} logo`}
                          className="object-contain"
                          fill={false}
                          width={32}
                          height={32}
                          unoptimized={true}
                          onError={() => handleImageError(tech.name)}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg truncate">
                          {tech.name}
                        </h3>
                        <span className="text-sm font-mono text-muted-foreground">
                          {tech.version}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
