"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, MoreVertical, Phone, Video } from "lucide-react";

// Mock contacts data (same as sidebar for consistency)
const mockContacts = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/avatars/alice.jpg",
    isOnline: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/avatars/bob.jpg",
    isOnline: true,
  },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/avatars/carol.jpg",
    isOnline: false,
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/avatars/david.jpg",
    isOnline: true,
  },
];

interface MessengerHeaderProps {
  selectedContact: string | null;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function MessengerHeader({
  selectedContact,
  sidebarOpen,
  onSidebarToggle,
}: MessengerHeaderProps) {
  const contact = mockContacts.find((c) => c.id === selectedContact);

  if (!selectedContact || !contact) {
    return (
      <div className="border-b px-6 py-4 bg-white">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <h1 className="text-lg font-semibold text-gray-700">Messenger</h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a chat, group, or contact to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={onSidebarToggle}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

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

            <div>
              <h2 className="text-lg font-semibold">{contact.name}</h2>
              <p className="text-sm text-gray-600">
                {contact.isOnline ? (
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    Online
                  </span>
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
