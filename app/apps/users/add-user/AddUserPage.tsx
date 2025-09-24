/**
 * Add User Page Component
 * Provides a comprehensive form interface for creating new user accounts
 * Includes user preview, tabbed form sections, and submission handling
 * Manages form state and user creation workflow with validation and navigation
 */

"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/data/users-data";
import { Mail, Phone, Save, User as UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddUserTabs, UserFormData } from "./AddUserTabs";

export default function AddUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "prefer_not_to_say",
    role: "user",
    status: "pending",
    plan: "free",
    jobTitle: "",
    department: "",
    company: "",
    industry: "",
    experience: "",
    timezone: "America/New_York",
    language: "en-US",
    theme: "system",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingNotifications: false,
    profileVisibility: "private",
    dataSharing: false,
    analytics: true,
    twoFactorEnabled: false,
    securityQuestions: false,
    emergencyContacts: [],
    addresses: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Updates the form data state with partial changes
   * @param data - Partial UserFormData object containing fields to update
   */
  const handleFormDataChange = (data: Partial<UserFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  /**
   * Handles form submission to create a new user
   * Validates form data, creates user object, and handles API call simulation
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a new user ID
      const newUserId = `user_${Date.now()}`;

      // Create the user object
      const newUser: User = {
        id: newUserId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        status: formData.status,
        plan: formData.plan,
        avatar: `/avatars/${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}.jpg`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          phone: formData.phone || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender:
            formData.gender === "prefer_not_to_say"
              ? undefined
              : formData.gender,
          timezone: formData.timezone,
          language: formData.language,
          jobTitle: formData.jobTitle || undefined,
          department: formData.department || undefined,
          company: formData.company || undefined,
          industry: formData.industry || undefined,
          experience: formData.experience || undefined,
          theme: formData.theme,
          notifications: {
            email: formData.emailNotifications,
            push: formData.pushNotifications,
            sms: formData.smsNotifications,
            marketing: formData.marketingNotifications,
          },
          privacy: {
            profileVisibility: formData.profileVisibility,
            dataSharing: formData.dataSharing,
            analytics: formData.analytics,
          },
          totalLogins: 0,
          lastActive: new Date().toISOString(),
          sessionDuration: 0,
          featuresUsed: [],
          twoFactorEnabled: formData.twoFactorEnabled,
          lastPasswordChange: new Date().toISOString(),
          loginAttempts: 0,
          securityQuestions: formData.securityQuestions,
          integrations: [],
        },
      };

      // In a real app, this would be an API call
      console.log("Creating new user:", newUser);

      // Show success message
      alert(
        `User ${formData.firstName} ${formData.lastName} has been created successfully!`
      );

      // Navigate back to users list
      router.push("/apps/users");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles cancel action to navigate back to users list
   */
  const handleCancel = () => {
    router.push("/apps/users");
  };

  /**
   * Generates user initials from first and last name
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @returns Uppercase initials string
   */
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  /**
   * AddUserPage component for creating new user accounts
   * Renders a comprehensive form with user preview, tabbed sections, and action buttons
   * Handles form state management, validation, and user creation workflow
   * @returns JSX element representing the add user page interface
   */
  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Add New User"
        subtitle="Create a new user account with profile information and settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Users", href: "/apps/users" },
          { label: "Add User" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Preview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">
                  {formData.firstName && formData.lastName ? (
                    getInitials(formData.firstName, formData.lastName)
                  ) : (
                    <UserIcon className="w-8 h-8" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex-wrap space-y-2">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-2xl font-bold">
                    {formData.firstName || ""} {formData.lastName || ""}
                  </h1>
                  <Badge className={`bg-green-100 text-green-800`}>
                    {formData.status.charAt(0).toUpperCase() +
                      formData.status.slice(1)}
                  </Badge>
                  <Badge className={`bg-blue-100 text-blue-800`}>
                    {formData.role.charAt(0).toUpperCase() +
                      formData.role.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{formData.email || "email@example.com"}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Form Content */}
        <AddUserTabs
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
}
