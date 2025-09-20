"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Email } from "@/data/email";
import { Inbox, MoreVertical, Paperclip, Reply, Star } from "lucide-react";

interface EmailContentProps {
  selectedEmail: Email | null;
}

export default function EmailContent({ selectedEmail }: EmailContentProps) {
  if (!selectedEmail) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Select an email to read</h3>
          <p className="text-muted-foreground">
            Choose an email from the list to view its contents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Email Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/avatars/${selectedEmail.from
                  .toLowerCase()
                  .replace(" ", "-")}.jpg`}
              />
              <AvatarFallback>
                {selectedEmail.from
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="grid grid-cols-1 gap-2">
              <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
              <p className="text-sm text-gray-200 dark:text-muted-foreground">
                From: {selectedEmail.from}
              </p>
              <p className="text-sm text-gray-200 dark:text-muted-foreground">
                To: {selectedEmail.to}
              </p>
              <span className="text-xs text-gray-200 dark:text-muted-foreground">
                {new Date(selectedEmail.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Reply className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedEmail.hasAttachments && (
          <div className="flex flex-col lg:flex-row items-center gap-2 p-3 bg-secondary rounded-lg">
            <Paperclip className="h-4 w-4 text-gray-200 dark:text-muted-foreground" />
            <span className="text-sm text-gray-200 dark:text-muted-foreground">
              2 attachments
            </span>
            <Button variant="ghost" size="sm" className="ml-auto">
              Download all
            </Button>
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-200 dark:text-muted-background leading-relaxed">
            {selectedEmail.body}
          </p>

          <p className="text-gray-200 dark:text-muted-background leading-relaxed mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      {/* Email Actions */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button>
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline">
            <Reply className="h-4 w-4 mr-2" />
            Reply All
          </Button>
          <Button variant="outline">
            <Reply className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}
