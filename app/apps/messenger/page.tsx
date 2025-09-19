"use client";

import { useState } from "react";
import MessengerSidebar from "./(components)/MessengerSidebar";
import MessengerChat from "./(components)/MessengerChat";
import MessengerHeader from "./(components)/MessengerHeader";

export default function MessengerPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">
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
