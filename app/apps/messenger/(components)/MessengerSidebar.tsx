"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Menu, MessageCircle, Plus, Search, User, Users } from "lucide-react";
import { useState } from "react";
import { AddContactForm } from "./AddContactForm";
import { CreateGroupForm } from "./CreateGroupForm";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface MessengerSidebarProps {
  selectedContact: string | null;
  onContactSelect: (contactId: string) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/avatars/alice.jpg",
    lastMessage: "Hey, how are you doing?",
    timestamp: "2024-01-15T10:30:00Z",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/avatars/bob.jpg",
    lastMessage: "Thanks for the help!",
    timestamp: "2024-01-15T09:15:00Z",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/avatars/carol.jpg",
    lastMessage: "See you tomorrow!",
    timestamp: "2024-01-14T16:45:00Z",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/avatars/david.jpg",
    lastMessage: "The project is coming along nicely",
    timestamp: "2024-01-14T14:20:00Z",
    unreadCount: 0,
    isOnline: true,
  },
];

export default function MessengerSidebar({
  selectedContact,
  onContactSelect,
  sidebarOpen,
  onSidebarToggle,
}: MessengerSidebarProps) {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

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

  const handleCreateGroup = (groupData: {
    name: string;
    description: string;
    members: { id: string; name: string; avatar: string; isOnline: boolean }[];
  }) => {
    console.log("Creating group:", groupData);
    // Here you would typically add the group to your data store
    // For now, we'll just log it
  };

  const handleAddContact = (contactData: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  }) => {
    console.log("Adding contact:", contactData);
    // Here you would typically add the contact to your data store
    // For now, we'll just log it
  };

  return (
    <div className="hidden lg:block">
      <div
        className={cn(
          "border-r transition-all duration-300 h-full",
          sidebarOpen ? "w-80" : "w-16"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            {sidebarOpen && (
              <Button size="sm" className="ml-2">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {sidebarOpen && (
          <Tabs defaultValue="chats" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
              <TabsTrigger
                value="chats"
                className="flex items-center gap-2 text-xs"
              >
                <MessageCircle className="h-4 w-4" />
                Chats
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="flex items-center gap-2 text-xs"
              >
                <Users className="h-4 w-4" />
                Groups
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="flex items-center gap-2 text-xs"
              >
                <User className="h-4 w-4" />
                Contacts
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10" />
              </div>
            </div>

            {/* Chats Tab */}
            <TabsContent value="chats" className="flex-1 overflow-y-auto mt-0">
              <nav className="px-2">
                {mockContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onContactSelect(contact.id)}
                    className={cn(
                      "w-full p-3 text-left hover:bg-card cursor-pointer transition-colors rounded-lg mb-1",
                      selectedContact === contact.id && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate">
                            {contact.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(contact.timestamp)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 truncate flex-1">
                            {contact.lastMessage}
                          </span>
                          {contact.unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs ml-2"
                            >
                              {contact.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups" className="flex-1 overflow-y-auto mt-0">
              <nav className="px-2">
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No groups yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setIsCreateGroupOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              </nav>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent
              value="contacts"
              className="flex-1 overflow-y-auto mt-0"
            >
              {/* Add Contact Button */}
              <div className="px-4 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsAddContactOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>

              <nav className="px-2">
                {mockContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onContactSelect(contact.id)}
                    className={cn(
                      "w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-lg mb-1",
                      selectedContact === contact.id && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate">
                            {contact.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {contact.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 truncate flex-1">
                            Click to start chat
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </TabsContent>
          </Tabs>
        )}

        {/* Compact View */}
        {!sidebarOpen && (
          <nav className="flex-1 overflow-y-auto p-2">
            {mockContacts.slice(0, 5).map((contact) => (
              <button
                key={contact.id}
                onClick={() => onContactSelect(contact.id)}
                className={cn(
                  "w-full p-2 text-center hover:bg-gray-50 transition-colors rounded-lg mb-1",
                  selectedContact === contact.id && "bg-primary/5"
                )}
              >
                <div className="relative mx-auto mb-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {contact.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 text-xs h-4 w-4 p-0 flex items-center justify-center"
                    >
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </nav>
        )}

        {/* Form Components */}
        <CreateGroupForm
          open={isCreateGroupOpen}
          onOpenChange={setIsCreateGroupOpen}
          onSubmit={handleCreateGroup}
        />

        <AddContactForm
          open={isAddContactOpen}
          onOpenChange={setIsAddContactOpen}
          onSubmit={handleAddContact}
        />
      </div>
    </div>
  );
}
