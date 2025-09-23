"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

/**
 * Props for CustomerInformation component
 * @param customer - The name of the customer to display information for
 */
interface CustomerInformationProps {
  customer: string;
}

/**
 * Customer Information Component
 * Displays customer details including avatar, name, email, and phone number
 * Generates avatar fallback from customer name initials
 * Shows contact information in a card layout with icons
 * @param customer - The name of the customer to display information for
 * @returns The JSX element representing the customer information card
 */
export function CustomerInformation({ customer }: CustomerInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`/avatars/${customer.toLowerCase().replace(" ", "-")}.jpg`}
            />
            <AvatarFallback>
              {customer
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{customer}</p>
            <p className="text-sm text-muted-foreground">Customer</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{customer.toLowerCase().replace(" ", ".")}@email.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
