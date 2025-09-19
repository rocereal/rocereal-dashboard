"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Send, Paperclip, Smile } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

interface MessengerChatProps {
  selectedContact: string | null;
}

// Mock messages data
const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      content: "Hey! How are you doing?",
      timestamp: "2024-01-15T10:30:00Z",
      isMine: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Hi Alice! I'm doing great, thanks for asking. How about you?",
      timestamp: "2024-01-15T10:31:00Z",
      isMine: true,
    },
    {
      id: "3",
      senderId: "1",
      content:
        "I'm good too! Just working on some projects. Have you seen the new design updates?",
      timestamp: "2024-01-15T10:32:00Z",
      isMine: false,
    },
    {
      id: "4",
      senderId: "me",
      content: "Yes, I love the new color scheme! The gradients look amazing.",
      timestamp: "2024-01-15T10:33:00Z",
      isMine: true,
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      content: "Thanks for your help with the project yesterday!",
      timestamp: "2024-01-15T09:15:00Z",
      isMine: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "No problem at all! Glad I could help.",
      timestamp: "2024-01-15T09:16:00Z",
      isMine: true,
    },
  ],
  "3": [
    {
      id: "1",
      senderId: "3",
      content: "See you tomorrow for the meeting!",
      timestamp: "2024-01-14T16:45:00Z",
      isMine: false,
    },
  ],
  "4": [
    {
      id: "1",
      senderId: "4",
      content: "The project is coming along nicely. Should be done by Friday.",
      timestamp: "2024-01-14T14:20:00Z",
      isMine: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Great! Looking forward to seeing the final result.",
      timestamp: "2024-01-14T14:21:00Z",
      isMine: true,
    },
  ],
};

// Mock contacts data for avatars
const mockContacts = [
  { id: "1", name: "Alice Johnson", avatar: "/avatars/alice.jpg" },
  { id: "2", name: "Bob Smith", avatar: "/avatars/bob.jpg" },
  { id: "3", name: "Carol Davis", avatar: "/avatars/carol.jpg" },
  { id: "4", name: "David Wilson", avatar: "/avatars/david.jpg" },
];

export default function MessengerChat({ selectedContact }: MessengerChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  const contact = mockContacts.find((c) => c.id === selectedContact);
  const chatMessages = selectedContact ? messages[selectedContact] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isMine: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), message],
    }));

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-semibold mb-2">Select a contact</h2>
          <p className="text-gray-600">
            Choose a contact from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.isMine ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isMine && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact?.avatar} />
                  <AvatarFallback>
                    {contact?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMine
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isMine
                      ? "text-primary-foreground/70"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.isMine && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/me.jpg" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
