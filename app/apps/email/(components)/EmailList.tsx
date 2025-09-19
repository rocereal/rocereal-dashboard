"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Email } from "@/data/email";
import { cn } from "@/lib/utils";
import { Archive, Paperclip, Star, Trash2 } from "lucide-react";

interface EmailListProps {
  selectedCategory: string;
  filteredEmails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  selectedEmails: Set<string>;
  onEmailSelectionChange: (emailId: string, checked: boolean) => void;
  selectAll: boolean;
  onSelectAllChange: (checked: boolean) => void;
  isMobile?: boolean;
  onMobileEmailSelect?: (email: Email) => void;
}

export default function EmailList({
  selectedCategory,
  filteredEmails,
  selectedEmail,
  onEmailSelect,
  selectedEmails,
  onEmailSelectionChange,
  selectAll,
  onSelectAllChange,
}: EmailListProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="w-full border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold capitalize">
              {selectedCategory}
            </h2>
            <p className="text-sm text-gray-600">
              {filteredEmails.length} emails
            </p>
          </div>
          {selectedEmails.size > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Select All Checkbox */}
      {filteredEmails.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectAll}
              onCheckedChange={(checked) =>
                onSelectAllChange(checked as boolean)
              }
            />
            <span className="text-sm text-gray-600">
              {selectAll ? "Deselect all" : "Select all"}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={cn(
              "p-4 border-b border-gray-100 cursor-pointer transition-colors",
              selectedEmail?.id === email.id && "bg-primary/5",
              !email.isRead && "font-medium",
              selectedEmails.has(email.id) && "bg-primary/5"
            )}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedEmails.has(email.id)}
                onCheckedChange={(checked) =>
                  onEmailSelectionChange(email.id, checked as boolean)
                }
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />

              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/avatars/${email.from
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`}
                />
                <AvatarFallback>
                  {email.from
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div
                className="flex-1 min-w-0"
                onClick={() => onEmailSelect(email)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">
                    {email.from}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(email.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm truncate flex-1">
                    {email.subject}
                  </span>
                  {email.hasAttachments && (
                    <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  )}
                  {email.isStarred && (
                    <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-gray-600 truncate">{email.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
