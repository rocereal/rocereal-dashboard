"use client";

import { useState } from "react";
import MessengerChat from "./MessengerChat";
import MessengerHeader from "./MessengerHeader";
import MessengerSidebar from "./MessengerSidebar";
import MobileMessengerChat from "./MobileMessengerChat";

export default function RenderPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex border bg-card rounded-md">
      <MessengerSidebar
        selectedContact={selectedContact}
        onContactSelect={setSelectedContact}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onMobileChatOpen={() => setMobileChatOpen(true)}
      />

      <div className="hidden lg:flex-1 lg:flex flex-col">
        <MessengerHeader
          selectedContact={selectedContact}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <MessengerChat selectedContact={selectedContact} />
      </div>

      {/* Mobile Chat Bottom Sheet */}
      <MobileMessengerChat
        selectedContact={selectedContact}
        isOpen={mobileChatOpen}
        onOpenChange={setMobileChatOpen}
      />
    </div>
  );
}
