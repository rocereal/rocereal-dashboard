import { Atom, FileText, Globe, Palette, Shield } from "lucide-react";

export default function TechStackUI() {
  const techStack = [
    {
      name: "Dashboards",
      version: "6 Total Dashboards",
      icon: Globe,
      logo: "/images/Nextjs.svg",
      fallbackIcon: Globe,
    },
    {
      name: "App Pages",
      version: "26+ Pages",
      icon: Atom,
      logo: "/images/React.svg",
      fallbackIcon: Atom,
    },
    {
      name: "Auth Pages",
      version: "12+ Pages",
      logo: "/images/Tailwind.svg",
      fallbackIcon: Palette,
    },
    {
      name: "Utility Pages",
      version: "26+ Pages",
      logo: "/images/TypeScript.svg",
      fallbackIcon: FileText,
    },
    {
      name: "Components",
      version: "100+ Components",
      logo: "/images/Radix.svg",
      fallbackIcon: Shield,
    },
  ];

  return (
    <div>
      {/* Tech Stack Grid */}
      <section className="py-16 lg:py-0 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 bg-card md:grid-cols-2 gap-2 lg:grid-cols-5 border rounded-md p-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative align-center px-0  first:pl-0 last:pr-0 lg:border-r lg:border-border/50 lg:last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col lg:flex-row items-start gap-3">
                    <div className="border p-2 lg:p-4 rounded-full bg-secondary text-primary">
                      <tech.fallbackIcon className="size-2 lg:size-4 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm lg:text-lg truncate">
                        {tech.name}
                      </h3>
                      <span className="text-xs lg:text-sm font-mono text-muted-foreground">
                        {tech.version}
                      </span>
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
