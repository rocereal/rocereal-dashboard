"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Message, MessengerChatProps, mockMessages } from "@/data/chats";
import { Mic, Paperclip, Send, Smile, X } from "lucide-react";
import { useState } from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

// Mock contacts data (same as sidebar)
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

interface MobileMessengerChatProps extends MessengerChatProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileMessengerChat({
  selectedContact,
  isOpen,
  onOpenChange,
}: MobileMessengerChatProps) {
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

  if (!selectedContact || !contact) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] w-full max-w-full p-0 overflow-hidden"
      >
        {/* Chat Header */}
        <div className="p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between">
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
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contact.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(90vh-140px)]">
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
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isMine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isMine
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
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
        <div className="border-t bg-background/95 backdrop-blur p-4">
          <div className="flex items-center gap-2 border rounded-full px-3 py-2">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Message Input */}
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            />

            {/* Emoji Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
            >
              <Smile className="h-4 w-4" />
            </Button>

            {/* Send / Mic Button */}
            {newMessage.trim() ? (
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full h-9 w-9"
              >
                <Send className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
