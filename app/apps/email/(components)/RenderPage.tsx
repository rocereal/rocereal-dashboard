"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Inbox,
  Send,
  FileText,
  Trash2,
  Star,
  Archive,
  Search,
  Plus,
  MoreVertical,
  Paperclip,
  Reply,
  Forward,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Email {
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
}

const mockEmails: Email[] = [
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
  },
];

const sidebarItems = [
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    count: 12,
    color: "text-blue-600",
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
    color: "text-gray-600",
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
    color: "text-red-600",
  },
];

export default function RenderPage() {
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredEmails = mockEmails.filter(
    (email) =>
      email.category === selectedCategory &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            {sidebarOpen && (
              <Button size="sm" className="ml-2">
                <Plus className="h-4 w-4 mr-2" />
                Compose
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors",
                  selectedCategory === item.id && "bg-blue-50 text-blue-700"
                )}
              >
                <Icon className={cn("h-5 w-5", item.color)} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Email List and Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Email List */}
          <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold capitalize">
                {selectedCategory}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredEmails.length} emails
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={cn(
                    "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedEmail?.id === email.id && "bg-blue-50",
                    !email.isRead && "bg-white font-medium"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/avatars/${email.from
                          .toLowerCase()
                          .replace(" ", "-")}.jpg`}
                      />
                      <AvatarFallback>
                        {email.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">
                          {email.from}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(email.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm truncate flex-1">
                          {email.subject}
                        </span>
                        {email.hasAttachments && (
                          <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        )}
                        {email.isStarred && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-gray-600 truncate">
                        {email.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 bg-white flex flex-col">
            {selectedEmail ? (
              <>
                {/* Email Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/avatars/${selectedEmail.from
                            .toLowerCase()
                            .replace(" ", "-")}.jpg`}
                        />
                        <AvatarFallback>
                          {selectedEmail.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-lg font-semibold">
                          {selectedEmail.subject}
                        </h3>
                        {/* <p className="text-sm text-gray-600">
                          From: {selectedEmail.from} <{selectedEmail.fromEmail}>
                        </p> */}
                        <p className="text-sm text-gray-600">
                          To: {selectedEmail.to}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(selectedEmail.timestamp).toLocaleString()}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedEmail.hasAttachments && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        2 attachments
                      </span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Download all
                      </Button>
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-800 leading-relaxed">
                      {selectedEmail.body}
                    </p>

                    <p className="text-gray-800 leading-relaxed mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    <p className="text-gray-800 leading-relaxed mt-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                </div>

                {/* Email Actions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Button>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select an email to read
                  </h3>
                  <p className="text-gray-500">
                    Choose an email from the list to view its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
