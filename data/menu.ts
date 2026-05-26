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
    name: "RO CEREAL",
    email: "ads@rocereal.ro",
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
      title: "Panou de bord",
      url: "#",
      icon: Banknote,
      items: [
        { title: "Panou de bord",       url: "/finance" },
        { title: "Vânzări live",        url: "/finance/raport-marketing" },
        { title: "Vânzări săptămânale", url: "/finance/raport-saptamanal" },
        { title: "Vânzări anuale",      url: "/finance/raport-anual" },
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
        { title: "Google Analytics",    url: "/surse-date/google-analytics" },
        { title: "Invox",               url: "/crm/invox" },
        { title: "Daktela",             url: "/surse-date/daktela" },
        { title: "Smartbill",           url: "/finance/smartbill" },
        { title: "Stocuri de produse",  url: "/surse-date/stocuri" },
        { title: "Facebook Ads",        url: "/education/facebook-ads" },
        { title: "TikTok Ads",          url: "/education/tiktok-ads" },
        { title: "Google Ads",          url: "/education/google-ads" },
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
        { title: "Users",        url: "/apps/users" },
        { title: "User Details", url: "/apps/users/me" },
        { title: "Add User",     url: "/apps/users/add-user" },
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
    name: "RO CEREAL",
    email: "ads@rocereal.ro",
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
        { title: "Panou de bord",       url: "/finance" },
        { title: "Vânzări live",        url: "/finance/raport-marketing" },
        { title: "Vânzări săptămânale", url: "/finance/raport-saptamanal" },
        { title: "Vânzări anuale",      url: "/finance/raport-anual" },
        { title: "Raport Clienti",      url: "/crm" },
        { title: "Tracking Mașini",     url: "/tracking" },
        { title: "Canale Vanzare",      url: "/ecommerce" },
        { title: "Magazine Online",     url: "/ecommerce/magazine-online" },
        { title: "Canale Marketing",    url: "/education" },
      ],
    },
    {
      title: "Colectare Date",
      url: "#",
      icon: Database,
      items: [
        { title: "Google Analytics",   url: "/surse-date/google-analytics" },
        { title: "Invox",              url: "/crm/invox" },
        { title: "Daktela",            url: "/surse-date/daktela" },
        { title: "Smartbill",          url: "/finance/smartbill" },
        { title: "Stocuri de produse", url: "/surse-date/stocuri" },
        { title: "Facebook Ads",       url: "/education/facebook-ads" },
        { title: "TikTok Ads",         url: "/education/tiktok-ads" },
        { title: "Google Ads",         url: "/education/google-ads" },
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
        { title: "Calendar",     url: "/apps/calendar",      icon: CalendarDays },
        { title: "Users",        url: "/apps/users",         icon: UserPlus },
        { title: "User Details", url: "/apps/users/me",      icon: UserPlus },
        { title: "Add User",     url: "/apps/users/add-user",icon: UserPlus },
      ],
    },

    // ======================
    // Settings
    // ======================
    {
      title: "Monitorizare sisteme",
      url: "/pages/changelog",
      icon: BookCheck,
    },
    {
      title: "Settings",
      url: "/pages/settings",
      icon: Settings2,
    },
  ],
};
