import { ConfigPanel } from "@/components/config-panel";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { LayoutConfigProvider } from "@/lib/layout-config";
import { ThemeProvider } from "@/lib/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";
import "./globals.css";
import { ThemeLayoutScript } from "@/lib/themeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Configurable Fisio Next.js Template",
  description: "A Next.js template with configurable layout and theme",
};

/**
 * Root Layout for the Application
 * This layout wraps the application content with the standard site structure
 * Provides theme and layout configuration for the entire app
 * @param children - The page content
 * @returns The complete HTML document structure for the app
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeLayoutScript
          themeStorageKey="fisio-ui-theme"
          layoutStorageKey="fisio-layout-config"
          defaultTheme="light"
          defaultLayout="sidebar"
          defaultColorTheme="neutral"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
          zIndex={1600}
        />
        <ThemeProvider defaultTheme="light" storageKey="fisio-ui-theme">
          <LayoutConfigProvider storageKey="fisio-layout-config">
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <ConfigPanel />
            <Toaster />
          </LayoutConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
