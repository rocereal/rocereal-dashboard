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
        { title: "E-commerce", url: "/ecommerce" },
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
          url: "/authentication/centered/register",
        },
        {
          title: "Centered Forgot Password",
          url: "/authentication/centered/forgot-password",
        },
        {
          title: "Centered Reset Password",
          url: "/authentication/centered/reset-password",
        },
        {
          title: "Minimal Login",
          url: "/authentication/minimal/login",
        },
        {
          title: "Minimal Register",
          url: "/authentication/minimal/register",
        },
        {
          title: "Minimal Forgot Password",
          url: "/authentication/minimal/forgot-password",
        },
        {
          title: "Minimal Reset Password",
          url: "/authentication/minimal/reset-password",
        },
        {
          title: "Split-Left Login",
          url: "/authentication/split-left/login",
        },
        {
          title: "Split-Left Register",
          url: "/authentication/split-left/register",
        },
        {
          title: "Split-Left Forgot Password",
          url: "/authentication/split-left/forgot-password",
        },
        {
          title: "Split-Left Reset Password",
          url: "/authentication/split-left/reset-password",
        },
        {
          title: "Split-Left Login",
          url: "/authentication/split-left/login",
        },
        {
          title: "Split-Left Register",
          url: "/authentication/split-left/register",
        },
        {
          title: "Split-Left Forgot Password",
          url: "/authentication/split-left/forgot-password",
        },
        {
          title: "Split-Left Reset Password",
          url: "/authentication/split-left/reset-password",
        },
        {
          title: "Split-Right Login",
          url: "/authentication/split-right/login",
        },
        {
          title: "Split-Right Register",
          url: "/authentication/split-right/register",
        },
        {
          title: "Split-Right Forgot Password",
          url: "/authentication/split-right/forgot-password",
        },
        {
          title: "Split-Right Reset Password",
          url: "/authentication/split-right/reset-password",
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
        { title: "Split-Left", url: "/onboarding/split-left/step-one" },
        { title: "Split-Right", url: "/onboarding/split-right/step-one" },
      ],
    },
    {
      title: "Coming Soon",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "Centered", url: "/coming-soon/centered" },
        { title: "Minimal", url: "/coming-soon/minimal" },
        { title: "Split-Left", url: "/coming-soon/split-left" },
        { title: "Split-Right", url: "/coming-soon/split-right" },
      ],
    },
    {
      title: "Contact",
      url: "#",
      icon: LifeBuoy,
      items: [
        { title: "Contact Form", url: "/contact/contact-form" },
        { title: "FAQ", url: "/contact/faq" },
      ],
    },
    {
      title: "Errors",
      url: "#",
      icon: User,
      items: [
        { title: "404 Not Found", url: "/errors/404" },
        { title: "Maintenance", url: "/errors/maintenance" },
      ],
    },
    {
      title: "Invoice",
      url: "#",
      icon: Receipt,
      items: [
        { title: "List", url: "/invoice/list" },
        { title: "Details", url: "/invoice/details" },
        { title: "Edit", url: "/invoice/edit" },
      ],
    },
    {
      title: "Pricing",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Plans", url: "/pricing/plans" },
        { title: "Subscriptions", url: "/pricing/subscriptions" },
        { title: "Comparison", url: "/pricing/comparison" },
      ],
    },

    // ======================
    // Documentation
    // ======================
    {
      title: "Documentation",
      isSection: true,
    },
    {
      title: "Docs",
      url: "/docs",
      icon: BookOpen,
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
      url: "/settings",
      icon: Settings2,
    },
  ],
};
