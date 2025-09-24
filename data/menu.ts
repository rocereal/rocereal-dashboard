import {
  Banknote,
  Bot,
  BookOpen,
  CalendarDays,
  Coins,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Mail,
  MessageSquare,
  Notebook,
  Receipt,
  Settings2,
  ShoppingCart,
  SquareTerminal,
  User,
  UserPlus,
  File,
  FolderKanban,
  MapPinHouse,
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
      title: "AI",
      url: "/ai",
      icon: Bot,
    },
    {
      title: "CRM",
      url: "/crm",
      icon: Users,
    },
    {
      title: "Crypto",
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
      title: "Email",
      url: "/apps/email",
      icon: Mail,
    },
    {
      title: "E-Commerce",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Add Product", url: "/apps/ecommerce/add-product" },
        { title: "Order Details", url: "/apps/ecommerce/orders/ord-001" },
        { title: "Orders", url: "/apps/ecommerce/orders" },
        { title: "Product Details", url: "/apps/ecommerce/products/prod-001" },
        { title: "Products", url: "/apps/ecommerce/products" },
      ],
    },
    {
      title: "File Manager",
      url: "#",
      icon: FolderKanban,
      items: [
        { title: "Add File", url: "/apps/files/add-file" },
        { title: "File Details", url: "/apps/files/1" },
        { title: "File Manager", url: "/apps/files" },
      ],
    },
    {
      title: "Invoice",
      url: "#",
      icon: Receipt,
      items: [
        { title: "Add Invoice", url: "/apps/invoice/add-invoice" },
        { title: "Invoices", url: "/apps/invoice" },
        { title: "View Invoice", url: "/apps/invoice/INV-2025-001" },
      ],
    },
    {
      title: "LMS",
      url: "#",
      icon: Notebook,
      items: [
        { title: "Course Details", url: "/apps/lms/web-development-basics" },
        { title: "Courses", url: "/apps/lms" },
      ],
    },
    {
      title: "Messenger",
      url: "/apps/messenger",
      icon: MessageSquare,
    },
    {
      title: "Real Estate",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Add Property", url: "/apps/real-estate/add-property" },
        {
          title: "Edit Property",
          url: "/apps/real-estate/edit-estate/prop-001",
        },
        { title: "Properties", url: "/apps/real-estate" },
        { title: "Property Details", url: "/apps/real-estate/prop-001" },
      ],
    },
    {
      title: "Tasks",
      url: "#",
      icon: FileText,
      items: [
        { title: "Create Task", url: "/apps/tasks/create" },
        { title: "Task Details", url: "/apps/tasks/1" },
        { title: "Task List", url: "/apps/tasks" },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: UserPlus,
      items: [
        { title: "Add User", url: "/apps/users/add-user" },
        { title: "User Details", url: "/apps/users/user_001" },
        { title: "Users", url: "/apps/users" },
      ],
    },

    // ======================
    // Pages
    // ======================
    {
      title: "Pages",
      isSection: true,
    },
    {
      title: "Authentication",
      url: "#",
      icon: Lock,
      items: [
        {
          title: "Centered Forgot Password",
          url: "/pages/authentication/centered/forgot-password",
        },
        { title: "Centered Login", url: "/authentication/centered/login" },
        {
          title: "Centered Register",
          url: "/pages/authentication/centered/register",
        },
        {
          title: "Centered Reset Password",
          url: "/pages/authentication/centered/reset-password",
        },
        {
          title: "Minimal Forgot Password",
          url: "/pages/authentication/minimal/forgot-password",
        },
        { title: "Minimal Login", url: "/pages/authentication/minimal/login" },
        {
          title: "Minimal Register",
          url: "/pages/authentication/minimal/register",
        },
        {
          title: "Minimal Reset Password",
          url: "/pages/authentication/minimal/reset-password",
        },
        {
          title: "Split-Left Forgot Password",
          url: "/pages/authentication/split-left/forgot-password",
        },
        {
          title: "Split-Left Login",
          url: "/pages/authentication/split-left/login",
        },
        {
          title: "Split-Left Register",
          url: "/pages/authentication/split-left/register",
        },
        {
          title: "Split-Left Reset Password",
          url: "/pages/authentication/split-left/reset-password",
        },
        {
          title: "Split-Right Forgot Password",
          url: "/pages/authentication/split-right/forgot-password",
        },
        {
          title: "Split-Right Login",
          url: "/pages/authentication/split-right/login",
        },
        {
          title: "Split-Right Register",
          url: "/pages/authentication/split-right/register",
        },
        {
          title: "Split-Right Reset Password",
          url: "/pages/authentication/split-right/reset-password",
        },
      ],
    },
    {
      title: "Coming Soon",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "Centered", url: "/pages/coming-soon/centered" },
        { title: "Minimal", url: "/pages/coming-soon/minimal" },
        { title: "Split-Left", url: "/pages/coming-soon/split-left" },
        { title: "Split-Right", url: "/pages/coming-soon/split-right" },
      ],
    },
    {
      title: "Contact",
      url: "#",
      icon: LifeBuoy,
      items: [
        { title: "Contact Form", url: "/pages/contact/contact-form" },
        { title: "FAQ", url: "/pages/contact/faq" },
      ],
    },
    {
      title: "Errors",
      url: "#",
      icon: User,
      items: [
        { title: "404 Not Found", url: "/pages/errors/404" },
        { title: "Maintenance", url: "/pages/errors/maintenance" },
      ],
    },
    {
      title: "Onboarding",
      url: "#",
      icon: UserPlus,
      items: [
        { title: "Split-Left", url: "/pages/onboarding/split-left/step-one" },
        { title: "Split-Right", url: "/pages/onboarding/split-right/step-one" },
      ],
    },
    {
      title: "Pricing",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Classic", url: "/pages/pricing/plans" },
        { title: "Classic Icons", url: "/pages/pricing/classic-icons" },
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
      title: "System Settings",
      url: "/pages/settings",
      icon: Settings2,
    },
  ],
};
