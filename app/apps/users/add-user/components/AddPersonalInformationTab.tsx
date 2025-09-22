"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Plus, User as UserIcon, X } from "lucide-react";
import { UserFormData } from "../AddUserTabs";

interface AddPersonalInformationTabProps {
  formData: UserFormData;
  onFormDataChange: (data: Partial<UserFormData>) => void;
}

export function AddPersonalInformationTab({
  formData,
  onFormDataChange,
}: AddPersonalInformationTabProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const addEmergencyContact = () => {
    const newContact = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      phone: "",
      email: "",
    };
    onFormDataChange({
      emergencyContacts: [...formData.emergencyContacts, newContact],
    });
  };

  const removeEmergencyContact = (id: string) => {
    onFormDataChange({
      emergencyContacts: formData.emergencyContacts.filter(
        (contact) => contact.id !== id
      ),
    });
  };

  const updateEmergencyContact = (id: string, field: string, value: string) => {
    onFormDataChange({
      emergencyContacts: formData.emergencyContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      ),
    });
  };

  const addAddress = () => {
    const newAddress = {
      id: Date.now().toString(),
      type: "home" as const,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isPrimary: false,
    };
    onFormDataChange({
      addresses: [...formData.addresses, newAddress],
    });
  };

  const removeAddress = (id: string) => {
    onFormDataChange({
      addresses: formData.addresses.filter((address) => address.id !== id),
    });
  };

  const updateAddress = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    onFormDataChange({
      addresses: formData.addresses.map((address) =>
        address.id === id ? { ...address, [field]: value } : address
      ),
    });
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
          <div className="flex flex-col items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {formData.firstName && formData.lastName ? (
                  getInitials(formData.firstName, formData.lastName)
                ) : (
                  <UserIcon className="w-8 h-8" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex-wrap gap-4 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      onFormDataChange({ firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      onFormDataChange({ lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      onFormDataChange({ email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      onFormDataChange({ phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      onFormDataChange({ dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      onFormDataChange({
                        gender: value as
                          | "male"
                          | "female"
                          | "other"
                          | "prefer_not_to_say",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            {formData.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="border-0 lg:border rounded-lg p-0 lg:p-4"
              >
                <div className="flex flex-col-reverse gap-4 items-start justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input
                        value={contact.relationship}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "relationship",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "phone",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          updateEmergencyContact(
                            contact.id,
                            "email",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="ml-0 lg:ml-4"
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
          <div className="space-y-4 ">
            {formData.addresses.map((address) => (
              <div
                key={address.id}
                className="border-0 lg:border rounded-lg p-0 lg:p-4"
              >
                <div className="flex flex-col-reverse gap-4 items-start justify-between w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={address.type}
                        onValueChange={(value) =>
                          updateAddress(address.id, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Street Address</Label>
                      <Input
                        value={address.street}
                        onChange={(e) =>
                          updateAddress(address.id, "street", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={address.city}
                        onChange={(e) =>
                          updateAddress(address.id, "city", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={address.state}
                        onChange={(e) =>
                          updateAddress(address.id, "state", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP Code</Label>
                      <Input
                        value={address.zipCode}
                        onChange={(e) =>
                          updateAddress(address.id, "zipCode", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={address.country}
                        onChange={(e) =>
                          updateAddress(address.id, "country", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(address.id)}
                    className="ml-0 lg:ml-4"
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
