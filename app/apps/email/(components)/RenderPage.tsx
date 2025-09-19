"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TabsWithIcons } from "@/components/custom/tabs-with-icons";
import { Email, emailTabs, mockEmails, sidebarItems } from "@/data/email";
import { cn } from "@/lib/utils";
import {
  Archive,
  Forward,
  Inbox,
  Menu,
  MoreVertical,
  Paperclip,
  Plus,
  Reply,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function RenderPage() {
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [selectedTab, setSelectedTab] = useState("primary");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const filteredEmails = mockEmails.filter(
    (email) =>
      email.category === selectedCategory &&
      email.tab === selectedTab &&
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

  // Calculate dynamic tab counts
  const getTabCounts = () => {
    const counts = {
      primary: 0,
      promotions: 0,
      social: 0,
      updates: 0,
    };

    mockEmails.forEach((email) => {
      if (email.category === selectedCategory) {
        counts[email.tab]++;
      }
    });

    return counts;
  };

  const tabCounts = getTabCounts();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={cn(
          "border-r  transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b ">
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
                  selectedCategory === item.id && "bg-primary/10 text-primary"
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
        <div className="border-b  px-6 py-4">
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

        {/* Email Tabs */}
        <div className="px-8">
          <TabsWithIcons
            tabs={emailTabs.map((tab) => ({
              ...tab,
              count: tabCounts[tab.id as keyof typeof tabCounts],
            }))}
            defaultValue={selectedTab}
            onValueChange={setSelectedTab}
            variant="underline"
            className="!w-full lg:!w-full px-2"
            grid="!grid !grid-cols-4"
          />
        </div>

        {/* Email List and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Email List */}
          <div className="w-full border-r  flex flex-col">
            <div className="p-4 border-b ">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold capitalize">
                    {selectedCategory}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filteredEmails.length} emails
                  </p>
                </div>
                {selectedEmails.size > 0 && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Select All Checkbox */}
            {filteredEmails.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) => {
                      setSelectAll(checked as boolean);
                      if (checked) {
                        setSelectedEmails(
                          new Set(filteredEmails.map((email) => email.id))
                        );
                      } else {
                        setSelectedEmails(new Set());
                      }
                    }}
                  />
                  <span className="text-sm text-gray-600">
                    {selectAll ? "Deselect all" : "Select all"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={cn(
                    "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedEmail?.id === email.id && "bg-primary/5",
                    !email.isRead && "bg-white font-medium",
                    selectedEmails.has(email.id) && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedEmails.has(email.id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedEmails);
                        if (checked) {
                          newSelected.add(email.id);
                        } else {
                          newSelected.delete(email.id);
                        }
                        setSelectedEmails(newSelected);
                        setSelectAll(
                          newSelected.size === filteredEmails.length
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />

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

                    <div
                      className="flex-1 min-w-0"
                      onClick={() => setSelectedEmail(email)}
                    >
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
          <div className="w-full flex flex-col">
            {selectedEmail ? (
              <>
                {/* Email Header */}
                <div className="p-6 border-b ">
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
                        <p className="text-sm text-gray-600">
                          From: {selectedEmail.from}
                        </p>
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
                <div className="p-4 border-t ">
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
                  <h3 className="text-lg font-medium mb-2">
                    Select an email to read
                  </h3>
                  <p className="text-muted-foreground">
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
