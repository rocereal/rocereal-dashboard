"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

interface CustomerInformationProps {
  customer: string;
}

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
