import type { Metadata } from "next";

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  image?: string;
  url?: string;
}

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title = "Fisio - Dashboard Template",
    description = "A comprehensive dashboard template with configurable layouts and themes for modern web applications.",
    keywords = ["dashboard", "template", "nextjs", "react", "typescript"],
    type = "website",
    image,
    url,
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fisio.dev";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.png`;

  return {
    title: {
      default: title,
      template: "%s | Fisio",
    },
    description,
    keywords,
    authors: [{ name: "Fisio Team" }],
    creator: "Fisio",
    publisher: "Fisio",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "android-chrome-192x192",
          url: "/android-chrome-192x192.png",
        },
        {
          rel: "android-chrome-512x512",
          url: "/android-chrome-512x512.png",
        },
      ],
    },
    manifest: "/site.webmanifest",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Fisio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@fisio",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

// Predefined metadata templates for common page types
export const metadataTemplates = {
  dashboard: (title?: string, description?: string) =>
    createPageMetadata({
      title: title || "Dashboard",
      description:
        description ||
        "Manage and monitor your application data with comprehensive analytics and insights.",
      keywords: ["dashboard", "analytics", "data", "management"],
      type: "website",
    }),

  auth: (page: string) =>
    createPageMetadata({
      title: `${page} - Authentication`,
      description: `Secure ${page.toLowerCase()} page for Fisio dashboard template.`,
      keywords: ["authentication", "login", "register", "security"],
      type: "website",
    }),

  onboarding: (step?: string) =>
    createPageMetadata({
      title: step ? `Onboarding - ${step}` : "Onboarding",
      description:
        "Complete your setup and get started with Fisio dashboard template.",
      keywords: ["onboarding", "setup", "getting started"],
      type: "website",
    }),

  page: (title: string, description?: string, keywords?: string[]) =>
    createPageMetadata({
      title,
      description,
      keywords,
      type: "website",
    }),
};
