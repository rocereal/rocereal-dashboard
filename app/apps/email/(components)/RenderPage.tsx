"use client";

import { Email, mockEmails } from "@/data/email";
import { useState } from "react";
import DesktopSidebar from "./DesktopSidebar";
import EmailContent from "./EmailContent";
import EmailHeader from "./EmailHeader";
import EmailList from "./EmailList";
import EmailTabs from "./EmailTabs";
import MobileEmailContent from "./MobileEmailContent";

export default function RenderPage() {
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [selectedTab, setSelectedTab] = useState("primary");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileEmailContentOpen, setMobileEmailContentOpen] = useState(false);

  const filteredEmails = mockEmails.filter(
    (email) =>
      email.category === selectedCategory &&
      email.tab === selectedTab &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate dynamic tab counts
  const getTabCounts = () => {
    const counts = {
      primary: 0,
      promotions: 0,
      social: 0,
      updates: 0,
    };

    mockEmails.forEach((email) => {
      if (email.category === selectedCategory) {
        counts[email.tab]++;
      }
    });

    return counts;
  };

  const tabCounts = getTabCounts();

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    // On mobile, open the email content sheet
    if (window.innerWidth < 1024) {
      setMobileEmailContentOpen(true);
    }
  };

  const handleEmailSelectionChange = (emailId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmails);
    if (checked) {
      newSelected.add(emailId);
    } else {
      newSelected.delete(emailId);
    }
    setSelectedEmails(newSelected);
    setSelectAll(newSelected.size === filteredEmails.length);
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedEmails(new Set(filteredEmails.map((email) => email.id)));
    } else {
      setSelectedEmails(new Set());
    }
  };

  return (
    <div className="min-h-screen flex border rounded-md">
      <DesktopSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <EmailHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          mobileSidebarOpen={mobileSidebarOpen}
          onMobileSidebarChange={setMobileSidebarOpen}
        />

        <EmailTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          tabCounts={tabCounts}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden flex-1">
          <EmailList
            selectedCategory={selectedCategory}
            filteredEmails={filteredEmails}
            selectedEmail={selectedEmail}
            onEmailSelect={handleEmailSelect}
            selectedEmails={selectedEmails}
            onEmailSelectionChange={handleEmailSelectionChange}
            selectAll={selectAll}
            onSelectAllChange={handleSelectAllChange}
          />

          {/* Desktop Email Content - Hidden on mobile */}
          <div className="hidden lg:block">
            <EmailContent selectedEmail={selectedEmail} />
          </div>
        </div>

        {/* Mobile Email Content Sheet */}
        <MobileEmailContent
          selectedEmail={selectedEmail}
          isOpen={mobileEmailContentOpen}
          onOpenChange={setMobileEmailContentOpen}
        />
      </div>
    </div>
  );
}
