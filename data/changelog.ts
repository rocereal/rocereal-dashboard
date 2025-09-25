export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    added?: string[];
    changed?: string[];
    fixed?: string[];
  };
  pages?: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1",
    date: "2025-09-25",
    changes: {
      added: [
        "Dashboard with multiple modules (AI, CRM, Crypto, Ecommerce, Education, Finance)",
        "User authentication system",
        "Onboarding wizard",
        "Various UI components and layouts",
      ],
      changed: ["Improved navigation structure", "Enhanced responsive design"],
      fixed: ["Minor bug fixes in onboarding flow"],
    },
    pages: ["/ai", "/crm", "/crypto", "/ecommerce", "/education", "/finance"],
  },
];
