"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Email } from "@/data/email";
import { MoreVertical, Paperclip, Reply, Star } from "lucide-react";

interface MobileEmailContentProps {
  selectedEmail: Email | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileEmailContent({
  selectedEmail,
  isOpen,
  onOpenChange,
}: MobileEmailContentProps) {
  if (!selectedEmail) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] w-full max-w-full p-0  overflow-y-auto"
      >
        {/* Email Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row items-start justify-between mb-4">
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
                <h3 className="text-lg font-semibold">
                  {selectedEmail.subject}
                </h3>
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
            <div className="flex flex-row items-center align-center gap-2 p-3 bg-secondary rounded-lg">
              <div className="flex flex-col lg:flex-row gap-2">
                <Paperclip className="h-4 w-4 text-gray-200 dark:text-muted-foreground" />
                <span className="text-sm text-gray-200 dark:text-muted-foreground">
                  2 attachments
                </span>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                Download all
              </Button>
            </div>
          )}
        </div>

        {/* Email Body */}
        <div className="flex-1 p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-200 dark:text-muted-background leading-relaxed">
              {selectedEmail.body}
            </p>

            <p className="text-gray-200 dark:text-muted-background leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>

        {/* Email Actions */}
        <div className="p-4 border-t">
          <div className="grid grid-cols-1 items-center gap-2">
            <Button className="flex-1">
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" className="flex-1">
              <Reply className="h-4 w-4 mr-2" />
              Reply All
            </Button>
            <Button variant="outline" className="flex-1">
              <Reply className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
