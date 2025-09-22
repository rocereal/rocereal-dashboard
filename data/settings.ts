export interface SettingsTab {
  id: string;
  label: string;
  iconName: string;
  description?: string;
}

export const settingsTabs: SettingsTab[] = [
  {
    id: "profile",
    label: "Profile",
    iconName: "User",
    description: "Manage your personal information and preferences",
  },
  {
    id: "security",
    label: "Security",
    iconName: "Shield",
    description: "Update your password and security settings",
  },
  {
    id: "notifications",
    label: "Notifications",
    iconName: "Bell",
    description: "Configure notification preferences",
  },
  {
    id: "privacy",
    label: "Privacy",
    iconName: "Lock",
    description: "Control your privacy and data settings",
  },
];
