import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

export const menudata = {
  user: {
    name: "Fisio",
    email: "info@obare27.com",
    avatar: "/android-chrome-192x192.png",
  },

  navMain: [
    {
      title: "Dashboards",
      url: "#",
      icon: PieChart,
      items: [
        {
          title: "Analytics",
          url: "/analytics",
        },
        {
          title: "E-commerce",
          url: "/ecommerce",
        },
        {
          title: "Finance",
          url: "/finance",
        },
        {
          title: "Project",
          url: "/project",
        },
        {
          title: "CRM",
          url: "/crm",
        },
        {
          title: "Education",
          url: "/education",
        },
        {
          title: "Content",
          url: "/content",
        },
        {
          title: "AI",
          url: "/ai",
        },
        {
          title: "Crypto",
          url: "/crypto",
        },
        {
          title: "NFT & DeFi",
          url: "/nft-defi",
        },
      ],
    },
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/design",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
