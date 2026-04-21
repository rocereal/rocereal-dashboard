import {
  Banknote,
  BookCheck,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  MapPin,
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
      title: "Management Clienti",
      url: "#",
      icon: Users,
      items: [
        { title: "Raport Clienti", url: "/crm" },
        { title: "Invox", url: "/crm/invox" },
      ],
    },
    {
      title: "Tracking Mașini",
      url: "/tracking",
      icon: MapPin,
    },
    {
      title: "Canale Vanzare",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Canale Vanzare", url: "/ecommerce" },
        { title: "Magazine Online", url: "/ecommerce/magazine-online" },
      ],
    },
    {
      title: "Canale Marketing",
      url: "#",
      icon: GraduationCap,
      items: [
        { title: "Canale Marketing", url: "/education" },
        { title: "Facebook Ads", url: "/education/facebook-ads" },
      ],
    },
    {
      title: "Rapoarte Financiare",
      url: "#",
      icon: Banknote,
      items: [
        { title: "Rapoarte Financiare", url: "/finance" },
        { title: "Smartbill", url: "/finance/smartbill" },
      ],
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
        { title: "Raport Clienti", url: "/crm" },
        { title: "Invox", url: "/crm/invox" },
        { title: "Tracking Mașini", url: "/tracking" },
        { title: "Canale Vanzare", url: "/ecommerce" },
        { title: "Magazine Online", url: "/ecommerce/magazine-online" },
        { title: "Canale Marketing", url: "/education" },
        { title: "Facebook Ads", url: "/education/facebook-ads" },
        { title: "Rapoarte Financiare", url: "/finance" },
        { title: "Smartbill", url: "/finance/smartbill" },
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
