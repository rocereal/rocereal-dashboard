import { Inbox, Send, FileText, Trash2, Star, Archive } from "lucide-react";

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  category: "inbox" | "sent" | "drafts" | "trash";
  tab: "primary" | "promotions" | "social" | "updates";
}

export const mockEmails: Email[] = [
  {
    id: "1",
    from: "John Smith",
    fromEmail: "john.smith@example.com",
    to: "you@company.com",
    subject: "Project Update - Q4 Review",
    body: "Hi team, here's the latest update on our Q4 projects...",
    timestamp: "2025-01-15T10:30:00Z",
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    category: "inbox",
    tab: "primary",
  },
  {
    id: "2",
    from: "Sarah Johnson",
    fromEmail: "sarah.johnson@client.com",
    to: "you@company.com",
    subject: "Meeting Request - Product Demo",
    body: "I'd like to schedule a product demo for next week...",
    timestamp: "2025-01-15T09:15:00Z",
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    category: "inbox",
    tab: "primary",
  },
  {
    id: "3",
    from: "Mike Davis",
    fromEmail: "mike.davis@partner.com",
    to: "you@company.com",
    subject: "Partnership Proposal",
    body: "We're excited about the partnership opportunity...",
    timestamp: "2025-01-14T16:45:00Z",
    isRead: false,
    isStarred: false,
    hasAttachments: true,
    category: "inbox",
    tab: "primary",
  },
  {
    id: "4",
    from: "Emily Chen",
    fromEmail: "emily.chen@vendor.com",
    to: "you@company.com",
    subject: "Invoice #INV-2025-001",
    body: "Please find attached the invoice for our recent services...",
    timestamp: "2025-01-14T14:20:00Z",
    isRead: true,
    isStarred: false,
    hasAttachments: true,
    category: "inbox",
    tab: "promotions",
  },
  {
    id: "5",
    from: "David Wilson",
    fromEmail: "david.wilson@team.com",
    to: "you@company.com",
    subject: "Weekly Team Standup Notes",
    body: "Here are the notes from today's standup meeting...",
    timestamp: "2025-01-14T11:00:00Z",
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    category: "inbox",
    tab: "primary",
  },
  {
    id: "6",
    from: "Lisa Brown",
    fromEmail: "lisa.brown@colleague.com",
    to: "you@company.com",
    subject: "Design Review - New Logo",
    body: "I've completed the initial design concepts for the new logo...",
    timestamp: "2025-01-13T15:30:00Z",
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    category: "inbox",
    tab: "primary",
  },
  {
    id: "7",
    from: "Tom Anderson",
    fromEmail: "tom.anderson@supplier.com",
    to: "you@company.com",
    subject: "Supply Chain Update",
    body: "There have been some delays in our supply chain...",
    timestamp: "2025-01-13T13:15:00Z",
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    category: "inbox",
    tab: "updates",
  },
  {
    id: "8",
    from: "Anna Martinez",
    fromEmail: "anna.martinez@hr.com",
    to: "you@company.com",
    subject: "New Employee Onboarding",
    body: "Welcome to our new team member! Here's the onboarding schedule...",
    timestamp: "2025-01-12T10:00:00Z",
    isRead: true,
    isStarred: false,
    hasAttachments: true,
    category: "inbox",
    tab: "social",
  },
];

export const sidebarItems = [
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    count: 12,
    color: "text-primary",
  },
  {
    id: "starred",
    label: "Starred",
    icon: Star,
    count: 3,
    color: "text-yellow-600",
  },
  { id: "sent", label: "Sent", icon: Send, count: 0, color: "text-green-600" },
  {
    id: "drafts",
    label: "Drafts",
    icon: FileText,
    count: 2,
    color: "text-muted-foreground",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    count: 0,
    color: "text-purple-600",
  },
  {
    id: "trash",
    label: "Trash",
    icon: Trash2,
    count: 0,
    color: "text-destructive",
  },
];

export const emailTabs = [
  {
    id: "primary",
    label: "Primary",
    count: 8,
    color: "text-primary",
  },
  {
    id: "promotions",
    label: "Promotions",
    count: 15,
    color: "text-orange-600",
  },
  {
    id: "social",
    label: "Social",
    count: 3,
    color: "text-blue-600",
  },
  {
    id: "updates",
    label: "Updates",
    count: 6,
    color: "text-green-600",
  },
];
