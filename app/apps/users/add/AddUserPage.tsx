"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User } from "@/data/users-data";
import {
  Bell,
  Briefcase,
  Globe,
  Mail,
  Phone,
  Save,
  Settings,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
  role: "admin" | "manager" | "user" | "viewer";
  status: "active" | "inactive" | "pending" | "suspended";
  plan: "free" | "starter" | "professional" | "enterprise";
  jobTitle: string;
  department: string;
  company: string;
  industry: string;
  experience: string;
  timezone: string;
  language: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingNotifications: boolean;
  profileVisibility: "public" | "private" | "team";
  dataSharing: boolean;
  analytics: boolean;
  twoFactorEnabled: boolean;
  securityQuestions: boolean;
}

export default function AddUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleCancel = () => {
    router.push("/apps/users");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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
            <div className="flex items-start space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">
                  {formData.firstName && formData.lastName ? (
                    getInitials(formData.firstName, formData.lastName)
                  ) : (
                    <UserIcon className="w-8 h-8" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">
                    {formData.firstName || "First Name"}{" "}
                    {formData.lastName || "Last Name"}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
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
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
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
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plan *</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleInputChange("plan", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Professional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  placeholder="e.g., 5+ years"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Preferences & Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      handleInputChange("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      handleInputChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="zh-CN">Chinese</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => handleInputChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    handleInputChange("twoFactorEnabled", !!checked)
                  }
                />
                <Label htmlFor="twoFactorEnabled">
                  Enable Two-Factor Authentication
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="securityQuestions"
                  checked={formData.securityQuestions}
                  onCheckedChange={(checked) =>
                    handleInputChange("securityQuestions", !!checked)
                  }
                />
                <Label htmlFor="securityQuestions">
                  Set up Security Questions
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleInputChange("emailNotifications", !!checked)
                    }
                  />
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pushNotifications"
                    checked={formData.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleInputChange("pushNotifications", !!checked)
                    }
                  />
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleInputChange("smsNotifications", !!checked)
                    }
                  />
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketingNotifications"
                    checked={formData.marketingNotifications}
                    onCheckedChange={(checked) =>
                      handleInputChange("marketingNotifications", !!checked)
                    }
                  />
                  <Label htmlFor="marketingNotifications">
                    Marketing Communications
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    value={formData.profileVisibility}
                    onValueChange={(value) =>
                      handleInputChange("profileVisibility", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dataSharing"
                    checked={formData.dataSharing}
                    onCheckedChange={(checked) =>
                      handleInputChange("dataSharing", !!checked)
                    }
                  />
                  <Label htmlFor="dataSharing">Allow Data Sharing</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analytics"
                    checked={formData.analytics}
                    onCheckedChange={(checked) =>
                      handleInputChange("analytics", !!checked)
                    }
                  />
                  <Label htmlFor="analytics">Enable Analytics</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
