/**
 * MessengerHeader Component
 * Header component for the messenger chat area that displays contact information
 * Shows contact avatar, name, online status, and provides call/video action buttons
 * Renders a placeholder message when no contact is selected
 * @returns The messenger header component
 */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockContacts } from "@/data/contacts";
import { MessageCircle, MoreVertical, Phone, Video } from "lucide-react";

interface MessengerHeaderProps {
  selectedContact: string | null;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

/**
 * MessengerHeader function component
 * Displays the header for the selected contact or a placeholder if none selected
 * Includes contact info and action buttons for calls and video
 * @param selectedContact - The currently selected contact ID
 * @param sidebarOpen - Whether the sidebar is open (unused in this component)
 * @param onSidebarToggle - Callback to toggle sidebar (unused in this component)
 * @returns JSX element for the messenger header
 */
export default function MessengerHeader({
  selectedContact,
}: MessengerHeaderProps) {
  const contact = mockContacts.find((c) => c.id === selectedContact);

  if (!selectedContact || !contact) {
    return (
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-white" />
            <h1 className="text-lg font-semibold text-gray-700 dark:text-white">
              Messenger
            </h1>
            <p className="text-sm text-gray-500 dark:text-muted-background mt-1">
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
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    (typeof contact.avatar === "string"
                      ? contact.avatar
                      : contact.avatar?.src) ||
                    `/avatars/${contact.name
                      .toLowerCase()
                      .replace(" ", "-")}.jpg`
                  }
                  alt={contact.name}
                />
                <AvatarFallback>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
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
