"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, Plus, Search, Users } from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface CreateGroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (group: {
    name: string;
    description: string;
    members: GroupMember[];
  }) => void;
}

// Mock contacts data
const mockContacts: GroupMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/avatars/alice.jpg",
    isOnline: true,
  },
  { id: "2", name: "Bob Smith", avatar: "/avatars/bob.jpg", isOnline: true },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/avatars/carol.jpg",
    isOnline: false,
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/avatars/david.jpg",
    isOnline: true,
  },
  { id: "5", name: "Emma Brown", avatar: "/avatars/emma.jpg", isOnline: false },
  {
    id: "6",
    name: "Frank Miller",
    avatar: "/avatars/frank.jpg",
    isOnline: true,
  },
];

export function CreateGroupForm({
  open,
  onOpenChange,
  onSubmit,
}: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]);

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (contact: GroupMember) => {
    if (!selectedMembers.find((member) => member.id === contact.id)) {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const handleRemoveMember = (contactId: string) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.id !== contactId)
    );
  };

  const handleSubmit = () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      return; // Basic validation
    }

    const groupData = {
      name: groupName.trim(),
      description: groupDescription.trim(),
      members: selectedMembers,
    };

    onSubmit?.(groupData);

    // Reset form
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
    setSearchQuery("");

    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
    setSearchQuery("");

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] flex flex-col"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Group
          </SheetTitle>
          <SheetDescription>
            Create a group chat and add members to start messaging
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name *</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              className="w-full"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Group Description */}
          <div className="space-y-2">
            <Label htmlFor="group-description">Description (Optional)</Label>
            <Textarea
              id="group-description"
              placeholder="Describe your group..."
              className="w-full min-h-[80px]"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
          </div>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Members ({selectedMembers.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="flex items-center gap-2 pr-1"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{member.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add Members */}
          <div className="space-y-2">
            <Label>Add Members</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {filteredContacts.map((contact) => {
                const isSelected = selectedMembers.some(
                  (member) => member.id === contact.id
                );
                return (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                    onClick={() => !isSelected && handleAddMember(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {contact.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {contact.isOnline ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <Badge variant="secondary" className="text-xs">
                        Added
                      </Badge>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="bg-primary"
            >
              Create Group
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
