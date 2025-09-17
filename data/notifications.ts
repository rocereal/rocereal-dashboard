import {
  Bell,
  User,
  Shield,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  icon: any;
}

export const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to the platform!",
    message:
      "Your account has been successfully created. Start exploring the features.",
    timestamp: "2 minutes ago",
    read: false,
    type: "success",
    icon: CheckCircle,
  },
  {
    id: "2",
    title: "Security Alert",
    message:
      "New login detected from Chrome on Windows. If this wasn't you, please secure your account.",
    timestamp: "1 hour ago",
    read: false,
    type: "warning",
    icon: Shield,
  },
  {
    id: "3",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    timestamp: "3 hours ago",
    read: true,
    type: "info",
    icon: User,
  },
  {
    id: "4",
    title: "System Maintenance",
    message:
      "Scheduled maintenance will occur tonight from 2-4 AM. Some features may be unavailable.",
    timestamp: "1 day ago",
    read: true,
    type: "warning",
    icon: AlertTriangle,
  },
  {
    id: "5",
    title: "New Message",
    message: "You have received a new message from the support team.",
    timestamp: "2 days ago",
    read: true,
    type: "info",
    icon: MessageSquare,
  },
  {
    id: "6",
    title: "Password Changed",
    message: "Your password has been successfully changed.",
    timestamp: "3 days ago",
    read: true,
    type: "success",
    icon: CheckCircle,
  },
];
