import {
  Banknote,
  BookCheck,
  CalendarDays,
  Coins,
  GraduationCap,
  LayoutDashboard,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  UserPlus,
  Users,
} from "lucide-react";

export const menudata = {
  user: {
    name: "Fisio",
    email: "info@obare27.com",
    avatar: "/android-chrome-192x192.png",
  },

  navMain: [
    // ======================
    // Dashboards
    // ======================
    {
      title: "Dashboards",
      isSection: true,
    },
    {
      title: "CRM",
      url: "#",
      icon: Users,
      items: [
        { title: "CRM", url: "/crm" },
        { title: "Invox", url: "/crm/invox" },
      ],
    },
    {
      title: "Financiar",
      url: "/crypto",
      icon: Coins,
    },
    {
      title: "E-Commerce",
      url: "/ecommerce",
      icon: ShoppingCart,
    },
    {
      title: "Education",
      url: "/education",
      icon: GraduationCap,
    },
    {
      title: "Finance",
      url: "/finance",
      icon: Banknote,
    },

    // ======================
    // Apps
    // ======================
    {
      title: "Apps",
      isSection: true,
    },
    {
      title: "Calendar",
      url: "/apps/calendar",
      icon: CalendarDays,
    },
    {
      title: "Users",
      url: "#",
      icon: UserPlus,
      items: [
        { title: "Users", url: "/apps/users" },
        { title: "User Details", url: "/apps/users/me" },
        { title: "Add User", url: "/apps/users/add-user" },
      ],
    },

    // ======================
    // Settings
    // ======================
    {
      title: "Settings",
      isSection: true,
    },
    // ======================
    // Changelog
    // ======================
    {
      title: "Changelog",
      url: "/pages/changelog",
      icon: BookCheck,
    },
    {
      title: "System Settings",
      url: "/pages/settings",
      icon: Settings2,
    },
  ],
};

export const menudataMobile = {
  user: {
    name: "Fisio",
    email: "info@obare27.com",
    avatar: "/android-chrome-192x192.png",
  },

  navMain: [
    // ======================
    // Dashboards
    // ======================
    {
      title: "Dashboards",
      url: "#",
      icon: LayoutDashboard,
      items: [
        { title: "CRM", url: "/crm" },
        { title: "Invox", url: "/crm/invox" },
        { title: "Financiar", url: "/crypto" },
        { title: "E-Commerce", url: "/ecommerce" },
        { title: "Education", url: "/education" },
        { title: "Finance", url: "/finance" },
      ],
    },

    // ======================
    // Apps
    // ======================
    {
      title: "Apps",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Calendar",
          url: "/apps/calendar",
          icon: CalendarDays,
        },
        {
          title: "Users",
          url: "#",
          icon: UserPlus,
          items: [
            { title: "Users", url: "/apps/users" },
            { title: "User Details", url: "/apps/users/me" },
            { title: "Add User", url: "/apps/users/add-user" },
          ],
        },
      ],
    },

    // ======================
    // Changelog
    // ======================
    {
      title: "Changelog",
      url: "/pages/changelog",
      icon: BookCheck,
    },

    // ======================
    // Settings
    // ======================
    {
      title: "Settings",
      url: "/pages/settings",
      icon: Settings2,
    },
  ],
};
