"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/data/users-data";
import {
  Calendar,
  MapPin,
  Phone,
  Plus,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";

interface PersonalInformationTabProps {
  user: User;
  formatDate: (dateString: string) => string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface Address {
  id: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

export function PersonalInformationTab({
  user,
  formatDate,
}: PersonalInformationTabProps) {
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([
    {
      id: "1",
      name: "Jane Smith",
      relationship: "Sister",
      phone: "+1-555-0123",
      email: "jane.smith@email.com",
    },
  ]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isPrimary: true,
    },
  ]);

  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      phone: "",
      email: "",
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
    setShowEmergencyForm(true);
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(
      emergencyContacts.filter((contact) => contact.id !== id)
    );
  };

  const addAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isPrimary: false,
    };
    setAddresses([...addresses, newAddress]);
    setShowAddressForm(true);
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={
                  (typeof user.avatar === "string"
                    ? user.avatar
                    : user.avatar?.src) ||
                  `/avatars/${user.firstName
                    .toLowerCase()
                    .replace(" ", "-")}.jpg`
                }
                alt={user.firstName}
              />
              <AvatarFallback className="text-lg">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user.lastName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={user.metadata.phone || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    defaultValue={user.metadata.dateOfBirth || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    defaultValue={user.metadata.gender || ""}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Emergency Contacts</span>
            </CardTitle>
            <Button onClick={addEmergencyContact} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4">
                <div className="flex flex-col-reverse  items-end justify-end">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input defaultValue={contact.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input defaultValue={contact.relationship} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input defaultValue={contact.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" defaultValue={contact.email} />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="ml-4"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Addresses</span>
            </CardTitle>
            <Button onClick={addAddress} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex flex-col-reverse items-end justify-end">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Input defaultValue={address.type} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Street Address</Label>
                      <Input defaultValue={address.street} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input defaultValue={address.city} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input defaultValue={address.state} />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input defaultValue={address.zipCode} />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input defaultValue={address.country} />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(address.id)}
                    className="ml-4"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {address.isPrimary && (
                  <Badge className="mt-2 bg-blue-100 text-blue-800">
                    Primary Address
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
