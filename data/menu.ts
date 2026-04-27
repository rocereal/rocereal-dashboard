import {
  Banknote,
  BookCheck,
  CalendarDays,
  Database,
  LayoutDashboard,
  MapPin,
  Megaphone,
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
      title: "Rapoarte Financiare",
      url: "#",
      icon: Banknote,
      items: [
        { title: "Rapoarte Financiare", url: "/finance" },
      ],
    },
    {
      title: "Management Clienti",
      url: "#",
      icon: Users,
      items: [
        { title: "Raport Clienti", url: "/crm" },
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
      url: "/education",
      icon: Megaphone,
    },

    // ======================
    // Colectare Date
    // ======================
    {
      title: "Colectare Date",
      isSection: true,
    },
    {
      title: "Surse de date",
      url: "#",
      icon: Database,
      items: [
        { title: "Google Analytics", url: "/surse-date/google-analytics" },
        { title: "Invox", url: "/crm/invox" },
        { title: "Smartbill", url: "/finance/smartbill" },
        { title: "Facebook Ads", url: "/education/facebook-ads" },
        { title: "TikTok Ads", url: "/education/tiktok-ads" },
        { title: "Google Ads", url: "/education/google-ads" },
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
    {
      title: "Monitorizare sisteme",
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
        { title: "Rapoarte Financiare", url: "/finance" },
        { title: "Raport Clienti", url: "/crm" },
        { title: "Tracking Mașini", url: "/tracking" },
        { title: "Canale Vanzare", url: "/ecommerce" },
        { title: "Magazine Online", url: "/ecommerce/magazine-online" },
        { title: "Canale Marketing", url: "/education" },
      ],
    },
    {
      title: "Colectare Date",
      url: "#",
      icon: Database,
      items: [
        { title: "Google Analytics", url: "/surse-date/google-analytics" },
        { title: "Invox", url: "/crm/invox" },
        { title: "Smartbill", url: "/finance/smartbill" },
        { title: "Facebook Ads", url: "/education/facebook-ads" },
        { title: "TikTok Ads", url: "/education/tiktok-ads" },
        { title: "Google Ads", url: "/education/google-ads" },
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
      title: "Monitorizare sisteme",
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
