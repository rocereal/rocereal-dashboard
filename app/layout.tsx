import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { LayoutConfigProvider } from "@/lib/layout-config";
import { ConfigPanel } from "@/components/config-panel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Configurable Next.js Template",
  description: "A Next.js template with configurable layout and theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="fisio-ui-theme">
          <LayoutConfigProvider storageKey="fisio-layout-config">
            {children}
            <ConfigPanel />
          </LayoutConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
