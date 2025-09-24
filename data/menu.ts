import {
  BookOpen,
  CalendarDays,
  FileText,
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
} from "lucide-react";
import { addScaleCorrector } from "motion/react";

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
      title: "Dashboards",
      url: "#",
      icon: LayoutDashboard,
      items: [
        { title: "AI", url: "/ai" },
        { title: "CRM", url: "/crm" },
        { title: "Crypto", url: "/crypto" },
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
      isSection: true,
    },
    {
      title: "Calendar",
      url: "/apps/calendar",
      icon: CalendarDays,
    },
    {
      title: "E-Commerce",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Products", url: "/apps/ecommerce/products" },
        {
          title: "Product Details",
          url: "/apps/ecommerce/products/prod-001",
        },
        { title: "Add Product", url: "/apps/ecommerce/add-product" },
        { title: "Orders", url: "/apps/ecommerce/orders" },
        { title: "Order Details", url: "/apps/ecommerce/orders/ord-001" },
      ],
    },
    {
      title: "Email",
      url: "/apps/email",
      icon: Mail,
    },
    {
      title: "LMS",
      url: "#",
      icon: Notebook,
      items: [
        { title: "Courses", url: "/apps/lms" },
        { title: "Course Details", url: "/apps/lms/web-development-basics" },
      ],
    },
    {
      title: "Messenger",
      url: "/apps/messenger",
      icon: MessageSquare,
    },
    {
      title: "Tasks",
      url: "#",
      icon: FileText,
      items: [
        { title: "Task List", url: "/apps/tasks" },
        { title: "Task Details", url: "/apps/tasks/1" },
        { title: "Create Task", url: "/apps/tasks/create" },
      ],
    },
    {
      title: "File Manager",
      url: "#",
      icon: FolderKanban,
      items: [
        { title: "File Manager", url: "/apps/files" },
        { title: "File Details", url: "/apps/files/1" },
        { title: "Add File", url: "/apps/files/add-file" },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: UserPlus,
      items: [
        { title: "Users", url: "/apps/users" },
        { title: "User Details", url: "/apps/users/user_001" },
        { title: "Add User", url: "/apps/users/add-user" },
      ],
    },
    {
      title: "Invoice",
      url: "#",
      icon: Receipt,
      items: [
        { title: "Invoices", url: "/apps/invoice" },
        {
          title: "View Invoice",
          url: "/apps/invoice/INV-2025-001",
        },
        { title: "Add Invoice", url: "/apps/invoice/add-invoice" },
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
        { title: "Centered Login", url: "/authentication/centered/login" },
        {
          title: "Centered Register",
          url: "/pages/authentication/centered/register",
        },
        {
          title: "Centered Forgot Password",
          url: "/pages/authentication/centered/forgot-password",
        },
        {
          title: "Centered Reset Password",
          url: "/pages/authentication/centered/reset-password",
        },
        {
          title: "Minimal Login",
          url: "/pages/authentication/minimal/login",
        },
        {
          title: "Minimal Register",
          url: "/pages/authentication/minimal/register",
        },
        {
          title: "Minimal Forgot Password",
          url: "/pages/authentication/minimal/forgot-password",
        },
        {
          title: "Minimal Reset Password",
          url: "/pages/authentication/minimal/reset-password",
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
          title: "Split-Left Forgot Password",
          url: "/pages/authentication/split-left/forgot-password",
        },
        {
          title: "Split-Left Reset Password",
          url: "/pages/authentication/split-left/reset-password",
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
          title: "Split-Left Forgot Password",
          url: "/pages/authentication/split-left/forgot-password",
        },
        {
          title: "Split-Left Reset Password",
          url: "/pages/authentication/split-left/reset-password",
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
          title: "Split-Right Forgot Password",
          url: "/pages/authentication/split-right/forgot-password",
        },
        {
          title: "Split-Right Reset Password",
          url: "/pages/authentication/split-right/reset-password",
        },
      ],
    },
    // ======================
    // Onboarding
    // ======================
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
