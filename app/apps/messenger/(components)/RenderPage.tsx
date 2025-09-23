/**
 * RenderPage Component
 * Main layout component for the messenger application that manages the overall UI state
 * Handles sidebar visibility, selected contact, and mobile chat interactions
 * Renders the sidebar, header, chat area, and mobile chat components in a responsive layout
 * @returns The complete messenger application layout
 */
"use client";

import { useState } from "react";
import MessengerChat from "./MessengerChat";
import MessengerHeader from "./MessengerHeader";
import MessengerSidebar from "./MessengerSidebar";
import MobileMessengerChat from "./MobileMessengerChat";

/**
 * RenderPage function component
 * Manages state for selected contact, sidebar open/close, and mobile chat visibility
 * Renders the messenger interface with responsive layout for desktop and mobile
 * @returns JSX element for the messenger layout
 */
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
