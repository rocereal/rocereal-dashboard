import {
  User,
  Settings,
  ShieldCheck,
  Rocket,
  Mail,
  Bell,
  Lock,
  Globe,
  Phone,
  Key,
  Image,
  FileCheck,
  Send,
  Clock,
} from "lucide-react";

export const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
];

export const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

export const notificationOptions = [
  {
    category: "Account",
    options: [
      { id: "account_updates", label: "Account updates" },
      { id: "security_alerts", label: "Security alerts" },
      { id: "login_notifications", label: "Login notifications" },
    ],
  },
  {
    category: "Marketing",
    options: [
      { id: "promotional_emails", label: "Promotional emails" },
      { id: "newsletter", label: "Newsletter" },
      { id: "product_updates", label: "Product updates" },
    ],
  },
  {
    category: "System",
    options: [
      { id: "maintenance_alerts", label: "Maintenance alerts" },
      { id: "feature_announcements", label: "Feature announcements" },
      { id: "surveys", label: "Surveys and feedback requests" },
    ],
  },
];

export const onboardingSteps = [
  {
    id: 1,
    title: "Tell Us About Yourself",
    subtitle:
      "Share some personal details so we can tailor the platform to your needs.",
    icon: User,
    guidance: [
      {
        title: "Add Your Name",
        subtitle:
          "Provide your full name for a professional and trustworthy profile.",
        icon: User,
      },
      {
        title: "Secure Password",
        subtitle:
          "Create a strong password with at least 8 characters, numbers, and symbols.",
        icon: Lock,
      },
      {
        title: "Verify Email",
        subtitle:
          "Double-check your email to ensure you can receive verification messages.",
        icon: Mail,
      },
    ],
  },
  {
    id: 2,
    title: "Set Your Preferences",
    subtitle: "Customize how the platform looks and works for you.",
    icon: Settings,
    guidance: [
      {
        title: "Choose Language",
        subtitle: "Select your preferred language for smoother navigation.",
        icon: Globe,
      },
      {
        title: "Pick Time Zone",
        subtitle:
          "Set your correct time zone so notifications arrive at the right time.",
        icon: Clock,
      },
      {
        title: "Enable Notifications",
        subtitle:
          "Stay updated by turning on the alerts that matter most to you.",
        icon: Bell,
      },
    ],
  },
  {
    id: 3,
    title: "Verify & Secure Your Account",
    subtitle: "Strengthen your account with extra security and verification.",
    icon: ShieldCheck,
    guidance: [
      {
        title: "Add Phone Number",
        subtitle: "Link your phone for password recovery and verification.",
        icon: Phone,
      },
      {
        title: "Enable 2FA",
        subtitle: "Protect your account with two-factor authentication.",
        icon: Key,
      },
      {
        title: "Upload Profile Picture",
        subtitle: "Add a photo so others can easily recognize you.",
        icon: Image,
      },
    ],
  },
  {
    id: 4,
    title: "Get Started",
    subtitle: "Review the final details and launch into your new experience.",
    icon: Rocket,
    guidance: [
      {
        title: "Review & Accept",
        subtitle: "Read and agree to our terms and privacy policy.",
        icon: FileCheck,
      },
      {
        title: "Join Newsletter",
        subtitle: "Subscribe for tips, updates, and exclusive insights.",
        icon: Mail,
      },
      {
        title: "Launch Your Journey",
        subtitle: "Hit confirm and start exploring the platform.",
        icon: Send,
      },
    ],
  },
];
