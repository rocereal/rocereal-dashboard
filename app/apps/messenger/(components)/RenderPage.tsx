"use client";

import { useState } from "react";
import MessengerChat from "./MessengerChat";
import MessengerHeader from "./MessengerHeader";
import MessengerSidebar from "./MessengerSidebar";

export default function RenderPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex border rounded-md">
      <MessengerSidebar
        selectedContact={selectedContact}
        onContactSelect={setSelectedContact}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <MessengerHeader
          selectedContact={selectedContact}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <MessengerChat selectedContact={selectedContact} />
      </div>
    </div>
  );
}
