"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Message,
  MessengerChatProps,
  mockContacts,
  mockMessages,
} from "@/data/chats";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";

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
    <div className="flex-1 flex flex-col relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 pb-4">
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
                    : "bg-card text-muted-foreground"
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

      {/* Chat Input - Sticks to Bottom of Chat Area */}
      <div className="sticky bottom-0 bg-secondary backdrop-blur border-t px-4">
        <div className="flex items-center gap-2 border rounded-full shadow-none px-3 py-2">
          {/* Attachment Button (inside input) */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          {/* Message Input */}
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />

          {/* Emoji Button (inside input) */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
          >
            <Smile className="h-5 w-5" />
          </Button>

          {/* Send / Mic Button (inside input, right aligned) */}
          {newMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full h-9 w-9"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full h-9 w-9"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
