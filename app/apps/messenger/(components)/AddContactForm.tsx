"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, UserPlus } from "lucide-react";
import { useState } from "react";

interface AddContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (contact: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  }) => void;
}

export function AddContactForm({
  open,
  onOpenChange,
  onSubmit,
}: AddContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      return; // Basic validation
    }

    const contactData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit?.(contactData);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      notes: "",
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      notes: "",
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Contact
          </SheetTitle>
          <SheetDescription>
            Add a new contact to your messenger and start chatting
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contact-email" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="contact-name"
              placeholder="Enter full name"
              className="w-full"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="contact-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Enter email address"
              className="w-full"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="Enter phone number"
              className="w-full"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="contact-notes">Notes (Optional)</Label>
            <Textarea
              id="contact-notes"
              placeholder="Add any additional notes about this contact..."
              className="w-full min-h-[80px]"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label>Quick Actions</Label>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => {
                  console.log("Send invitation to:", formData.email);
                }}
                disabled={!formData.email.trim()}
              >
                <Mail className="h-4 w-4 mr-3 shrink-0" />
                <div className="flex flex-col text-left min-w-0">
                  <div className="font-medium">Send Invitation</div>
                  <div className="text-sm text-muted-foreground break-words">
                    Send an email invitation to join messenger
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => {
                  // This would typically send an SMS invitation
                  console.log("Send SMS invitation to:", formData.phone);
                }}
                disabled={!formData.phone.trim()}
              >
                <Phone className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Send SMS Invitation</div>
                  <div className="text-sm text-muted-foreground">
                    Send an SMS invitation to join messenger
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.email.trim()}
              className="bg-primary"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
