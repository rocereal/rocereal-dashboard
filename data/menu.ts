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
        { title: "Analytics", url: "/analytics" },
        { title: "Content", url: "/content" },
        { title: "CRM", url: "/crm" },
        { title: "Crypto", url: "/crypto" },
        { title: "E-commerce", url: "/ecommerce" },
        { title: "Education", url: "/education" },
        { title: "Finance", url: "/finance" },
        { title: "NFT & DeFi", url: "/nft-defi" },
        { title: "Project", url: "/project" },
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
      url: "#",
      icon: CalendarDays,
      items: [
        { title: "Month View", url: "/apps/calendar/month" },
        { title: "Week View", url: "/apps/calendar/week" },
        { title: "Day View", url: "/apps/calendar/day" },
      ],
    },
    {
      title: "E-commerce",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Products", url: "/apps/ecommerce/products" },
        { title: "Product Details", url: "/apps/ecommerce/product-details" },
        { title: "New Product", url: "/apps/ecommerce/new-product" },
        { title: "Orders", url: "/apps/ecommerce/orders" },
        { title: "Order Details", url: "/apps/ecommerce/order-details" },
      ],
    },
    {
      title: "Email",
      url: "#",
      icon: Mail,
      items: [
        { title: "Inbox", url: "/apps/email/inbox" },
        { title: "Read", url: "/apps/email/read" },
        { title: "Compose", url: "/apps/email/compose" },
      ],
    },
    {
      title: "LMS",
      url: "#",
      icon: Notebook,
      items: [
        { title: "Courses", url: "/apps/lms/courses" },
        { title: "Course Details", url: "/apps/lms/course-details" },
        { title: "New Course", url: "/apps/lms/new-course" },
      ],
    },
    {
      title: "Messenger",
      url: "#",
      icon: MessageSquare,
      items: [
        { title: "Chats", url: "/apps/messenger/chats" },
        { title: "Groups", url: "/apps/messenger/groups" },
        { title: "Contacts", url: "/apps/messenger/contacts" },
      ],
    },
    {
      title: "Tasks",
      url: "#",
      icon: FileText,
      items: [
        { title: "Task List", url: "/apps/tasks/list" },
        { title: "Task Details", url: "/apps/tasks/details" },
        { title: "New Task", url: "/apps/tasks/new" },
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
        { title: "App", url: "/coming-soon/app" },
        { title: "Product", url: "/coming-soon/product" },
        { title: "Website", url: "/coming-soon/website" },
      ],
    },
    {
      title: "Contact",
      url: "#",
      icon: LifeBuoy,
      items: [
        { title: "Contact Form", url: "/contact/form" },
        { title: "Support", url: "/contact/support" },
        { title: "FAQ", url: "/contact/faq" },
      ],
    },
    {
      title: "Error",
      url: "#",
      icon: User,
      items: [
        { title: "404 Not Found", url: "/error/404" },
        { title: "500 Server Error", url: "/error/500" },
        { title: "Maintenance", url: "/error/maintenance" },
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
