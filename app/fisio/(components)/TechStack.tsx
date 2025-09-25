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
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 bg-card md:grid-cols-2 lg:grid-cols-5 border rounded-md p-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative align-center px-4 first:pl-0 last:pr-0 lg:border-r lg:border-border/50 lg:last:border-r-0"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="border p-4 rounded-full bg-secondary text-primary">
                        <tech.fallbackIcon className="w-4 h-4 text-primary" />
                      </div>
                      {/* <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <ImageComponentOptimized
                          src={tech.logo}
                          alt={`${tech.name} logo`}
                          className="object-contain"
                          fill={false}
                          width={32}
                          height={32}
                          unoptimized={true}
                        />
                      </div> */}

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
