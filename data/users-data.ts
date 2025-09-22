import eight from "@/app/assets/avatars/eight.jpg";
import five from "@/app/assets/avatars/five.jpg";
import four from "@/app/assets/avatars/four.jpg";
import nine from "@/app/assets/avatars/nine.jpg";
import one from "@/app/assets/avatars/one.jpg";
import two from "@/app/assets/avatars/two.jpg";
import seven from "@/app/assets/avatars/seven.jpg";
import six from "@/app/assets/avatars/six.jpg";
import three from "@/app/assets/avatars/three.jpg";
import { StaticImageData } from "next/image";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | StaticImageData;
  role: "admin" | "manager" | "user" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  plan: "free" | "starter" | "professional" | "enterprise";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  metadata: UserMetadata;
}

export interface UserMetadata {
  // Personal Information
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  timezone: string;
  language: string;

  // Professional Information
  jobTitle?: string;
  department?: string;
  company?: string;
  industry?: string;
  experience?: string;

  // Preferences
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private" | "team";
    dataSharing: boolean;
    analytics: boolean;
  };

  // Activity & Engagement
  totalLogins: number;
  lastActive: string;
  sessionDuration: number; // in minutes
  featuresUsed: string[];

  // Subscription & Billing
  subscriptionId?: string;
  billingCycle?: "monthly" | "yearly";
  paymentMethod?: "card" | "paypal" | "bank" | "invoice";

  // Security
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginAttempts: number;
  securityQuestions: boolean;

  // Social & Integration
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  integrations: string[];

  // Custom Fields
  customFields?: Record<string, any>;
}

export const users: User[] = [
  {
    id: "user_001",
    email: "john.smith@example.com",
    firstName: "John",
    lastName: "Smith",
    avatar: one,
    role: "admin",
    status: "active",
    plan: "enterprise",
    lastLogin: "2025-01-20T14:30:00Z",
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
    metadata: {
      phone: "+1-555-0123",
      dateOfBirth: "1985-03-15",
      gender: "male",
      timezone: "America/New_York",
      language: "en-US",
      jobTitle: "Chief Technology Officer",
      department: "Engineering",
      company: "TechCorp Inc.",
      industry: "Technology",
      experience: "15+ years",
      theme: "dark",
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: "team",
        dataSharing: true,
        analytics: true,
      },
      totalLogins: 245,
      lastActive: "2025-01-20T14:30:00Z",
      sessionDuration: 45,
      featuresUsed: [
        "dashboard",
        "analytics",
        "team-management",
        "integrations",
      ],
      subscriptionId: "sub_001",
      billingCycle: "yearly",
      paymentMethod: "card",
      twoFactorEnabled: true,
      lastPasswordChange: "2024-12-01T00:00:00Z",
      loginAttempts: 0,
      securityQuestions: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/johnsmith",
        github: "https://github.com/johnsmith",
      },
      integrations: ["slack", "github", "jira", "zoom"],
    },
  },
  {
    id: "user_002",
    email: "sarah.johnson@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    avatar: two,
    role: "manager",
    status: "active",
    plan: "professional",
    lastLogin: "2025-01-19T09:15:00Z",
    createdAt: "2024-08-20T14:20:00Z",
    updatedAt: "2025-01-19T09:15:00Z",
    metadata: {
      phone: "+1-555-0456",
      dateOfBirth: "1990-07-22",
      gender: "female",
      timezone: "America/Los_Angeles",
      language: "en-US",
      jobTitle: "Product Manager",
      department: "Product",
      company: "InnovateLabs",
      industry: "SaaS",
      experience: "8 years",
      theme: "light",
      notifications: {
        email: true,
        push: false,
        sms: true,
        marketing: true,
      },
      privacy: {
        profileVisibility: "public",
        dataSharing: false,
        analytics: true,
      },
      totalLogins: 156,
      lastActive: "2025-01-19T09:15:00Z",
      sessionDuration: 32,
      featuresUsed: ["projects", "reports", "user-management"],
      subscriptionId: "sub_002",
      billingCycle: "monthly",
      paymentMethod: "paypal",
      twoFactorEnabled: false,
      lastPasswordChange: "2024-11-15T00:00:00Z",
      loginAttempts: 1,
      securityQuestions: false,
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahj",
      },
      integrations: ["figma", "notion", "google-workspace"],
    },
  },
  {
    id: "user_003",
    email: "mike.davis@example.com",
    firstName: "Mike",
    lastName: "Davis",
    role: "user",
    status: "inactive",
    avatar: five,
    plan: "starter",
    lastLogin: "2024-12-15T16:45:00Z",
    createdAt: "2024-09-10T11:30:00Z",
    updatedAt: "2024-12-15T16:45:00Z",
    metadata: {
      phone: "+1-555-0789",
      dateOfBirth: "1988-11-08",
      gender: "male",
      timezone: "Europe/London",
      language: "en-GB",
      jobTitle: "Designer",
      department: "Design",
      company: "CreativeStudio",
      industry: "Design",
      experience: "6 years",
      theme: "system",
      notifications: {
        email: false,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: "private",
        dataSharing: false,
        analytics: false,
      },
      totalLogins: 89,
      lastActive: "2024-12-15T16:45:00Z",
      sessionDuration: 28,
      featuresUsed: ["design-tools", "collaboration"],
      subscriptionId: "sub_003",
      billingCycle: "monthly",
      paymentMethod: "card",
      twoFactorEnabled: true,
      lastPasswordChange: "2024-10-20T00:00:00Z",
      loginAttempts: 0,
      securityQuestions: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/mikedavis",
        website: "https://mikedavis.design",
      },
      integrations: ["adobe-creative-suite", "slack"],
    },
  },
  {
    id: "user_004",
    email: "emily.chen@example.com",
    firstName: "Emily",
    lastName: "Chen",
    avatar: three,
    role: "user",
    status: "pending",
    plan: "free",
    createdAt: "2025-01-18T08:00:00Z",
    updatedAt: "2025-01-18T08:00:00Z",
    metadata: {
      phone: "+1-555-0321",
      dateOfBirth: "1995-01-12",
      gender: "female",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      jobTitle: "Marketing Coordinator",
      department: "Marketing",
      company: "GrowthCo",
      industry: "Marketing",
      experience: "3 years",
      theme: "light",
      notifications: {
        email: true,
        push: true,
        sms: true,
        marketing: true,
      },
      privacy: {
        profileVisibility: "public",
        dataSharing: true,
        analytics: true,
      },
      totalLogins: 0,
      lastActive: "2025-01-18T08:00:00Z",
      sessionDuration: 0,
      featuresUsed: [],
      twoFactorEnabled: false,
      lastPasswordChange: "2025-01-18T08:00:00Z",
      loginAttempts: 0,
      securityQuestions: false,
      integrations: [],
    },
  },
  {
    id: "user_005",
    email: "david.wilson@example.com",
    firstName: "David",
    lastName: "Wilson",
    role: "viewer",
    status: "suspended",
    avatar: five,
    plan: "free",
    lastLogin: "2024-11-30T12:20:00Z",
    createdAt: "2024-07-05T15:45:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
    metadata: {
      phone: "+44-20-7946-0123",
      dateOfBirth: "1982-09-30",
      gender: "male",
      timezone: "Europe/London",
      language: "en-GB",
      jobTitle: "Consultant",
      department: "Consulting",
      company: "StrategyPlus",
      industry: "Consulting",
      experience: "12 years",
      theme: "dark",
      notifications: {
        email: true,
        push: false,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: "private",
        dataSharing: false,
        analytics: false,
      },
      totalLogins: 67,
      lastActive: "2024-11-30T12:20:00Z",
      sessionDuration: 15,
      featuresUsed: ["reports", "analytics"],
      twoFactorEnabled: false,
      lastPasswordChange: "2024-09-01T00:00:00Z",
      loginAttempts: 3,
      securityQuestions: false,
      socialLinks: {
        linkedin: "https://linkedin.com/in/davidwilson",
      },
      integrations: ["outlook", "teams"],
    },
  },
  {
    id: "user_006",
    email: "lisa.brown@example.com",
    firstName: "Lisa",
    lastName: "Brown",
    avatar: seven,
    role: "user",
    status: "active",
    plan: "starter",
    lastLogin: "2025-01-21T11:30:00Z",
    createdAt: "2024-10-12T13:15:00Z",
    updatedAt: "2025-01-21T11:30:00Z",
    metadata: {
      phone: "+61-2-9876-5432",
      dateOfBirth: "1992-05-18",
      gender: "female",
      timezone: "Australia/Sydney",
      language: "en-AU",
      jobTitle: "Operations Manager",
      department: "Operations",
      company: "AussieTech",
      industry: "Technology",
      experience: "7 years",
      theme: "system",
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: true,
      },
      privacy: {
        profileVisibility: "team",
        dataSharing: true,
        analytics: true,
      },
      totalLogins: 134,
      lastActive: "2025-01-21T11:30:00Z",
      sessionDuration: 38,
      featuresUsed: ["operations", "reporting", "team-dashboard"],
      subscriptionId: "sub_006",
      billingCycle: "monthly",
      paymentMethod: "bank",
      twoFactorEnabled: true,
      lastPasswordChange: "2024-12-15T00:00:00Z",
      loginAttempts: 0,
      securityQuestions: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/lisabrown",
        twitter: "https://twitter.com/lisabrown",
      },
      integrations: ["xero", "slack", "google-workspace"],
    },
  },
];

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  usersByRole: Record<string, number>;
  usersByPlan: Record<string, number>;
  averageSessionDuration: number;
  totalLogins: number;
  newUsersThisMonth: number;
  churnRate: number;
}

export const userMetrics: UserMetrics = {
  totalUsers: users.length,
  activeUsers: users.filter((u) => u.status === "active").length,
  inactiveUsers: users.filter((u) => u.status === "inactive").length,
  pendingUsers: users.filter((u) => u.status === "pending").length,
  suspendedUsers: users.filter((u) => u.status === "suspended").length,
  usersByRole: users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  usersByPlan: users.reduce((acc, user) => {
    acc[user.plan] = (acc[user.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  averageSessionDuration: Math.round(
    users.reduce((sum, user) => sum + user.metadata.sessionDuration, 0) /
      users.length
  ),
  totalLogins: users.reduce((sum, user) => sum + user.metadata.totalLogins, 0),
  newUsersThisMonth: 2,
  churnRate: 3.2,
};

export interface UserAction {
  id: string;
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  action: string;
  requiresConfirmation?: boolean;
}

export const userActions: UserAction[] = [
  {
    id: "reset-password",
    label: "Reset Password",
    variant: "secondary",
    action: "reset-password",
    requiresConfirmation: true,
  },
  {
    id: "suspend",
    label: "Suspend User",
    variant: "destructive",
    action: "suspend",
    requiresConfirmation: true,
  },
  {
    id: "activate",
    label: "Activate User",
    variant: "default",
    action: "activate",
  },
  {
    id: "delete",
    label: "Delete User",
    variant: "destructive",
    action: "delete",
    requiresConfirmation: true,
  },
];
