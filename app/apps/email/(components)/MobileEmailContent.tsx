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
        className="h-[90vh] w-full max-w-full p-0 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pt-6 px-6">
            <SheetHeader className="p-0">
              <SheetTitle className="text-left">
                {selectedEmail.subject}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 px-6 pb-4 border-b space-y-4">
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

                <div>
                  <p className="text-sm text-gray-600">
                    From: {selectedEmail.from}
                  </p>
                  <p className="text-sm text-gray-600">
                    To: {selectedEmail.to}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedEmail.timestamp).toLocaleString()}
                  </p>
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

              {selectedEmail.hasAttachments && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">2 attachments</span>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Download all
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto px-6 py-4">
              <div className="prose prose-sm text-sm max-w-none">
                <p className="leading-relaxed">{selectedEmail.body}</p>

                <p className="leading-relaxed mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <p className="leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>

                <p className="leading-relaxed mt-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>

                <p className="leading-relaxed mt-4">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                  velit.
                </p>

                <p className="leading-relaxed mt-4">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident, similique sunt in culpa qui officia deserunt
                  mollitia animi, id est laborum et dolorum fuga.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="flex-shrink-0 border-t px-6 py-4">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
