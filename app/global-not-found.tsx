import { ConfigPanel } from "@/components/config-panel";
import { LayoutConfigProvider } from "@/lib/layout-config";
import { ThemeProvider, useTheme } from "@/lib/theme-provider";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadataTemplates } from "@/lib/metadata";
import { Fourfour } from "@/components/svg/Icons";
import Header from "./pages/contact/(components)/ContactHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = metadataTemplates.dashboard(
  "Page Not Found",
  "The page you’re looking for isn’t here. Return to Fisio’s homepage to keep exploring."
);
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('fisio-ui-theme') || 'dark';
                const root = document.documentElement;

                // Apply theme immediately
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                  root.setAttribute('data-theme', systemTheme);
                } else {
                  root.classList.add(theme);
                  root.setAttribute('data-theme', theme);
                }

                // Apply sidebar colors immediately using Tailwind 'stone' palette
                const sidebarColors = {
                  dark: {
                    primary: 'oklch(0.554 0.046 257.417)',           // brand primary (unchanged)
                    'primary-foreground': 'oklch(0.984 0.003 247.858)', // brand fg (unchanged)
                    accent: 'oklch(0.36 0.006 70)',                  // stone-700
                    'accent-foreground': 'oklch(0.99 0.002 70)',     // stone-50
                    sidebar: 'oklch(0.15 0.004 70)',                 // stone-900
                    'sidebar-foreground': 'oklch(0.99 0.002 70)',    // stone-50
                    border: 'oklch(0.36 0.006 70)',                  // stone-700
                    ring: 'oklch(0.7 0.005 70)'                      // stone-400
                  },
                  light: {
                    primary: 'oklch(0.208 0.042 265.755)',            // brand primary (unchanged)
                    'primary-foreground': 'oklch(0.984 0.003 247.858)', // brand fg (unchanged)
                    accent: 'oklch(0.97 0.003 70)',                  // stone-100
                    'accent-foreground': 'oklch(0.15 0.004 70)',     // stone-900
                    sidebar: 'oklch(0.99 0.002 70)',                 // stone-50
                    'sidebar-foreground': 'oklch(0.15 0.004 70)',    // stone-900
                    border: 'oklch(0.93 0.004 70)',                  // stone-200
                    ring: 'oklch(0.54 0.006 70)'                     // stone-500
                  }
                };

                const currentTheme = theme === 'system' ?
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') :
                  theme;

                const colors = sidebarColors[currentTheme];
                Object.entries(colors).forEach(([key, value]) => {
                  root.style.setProperty('--sidebar-' + key, value);
                });
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="fisio-ui-theme">
          <LayoutConfigProvider storageKey="fisio-layout-config">
            {children}
            <ConfigPanel />
            <div className="max-w-4xl mx-auto justify-center align-center items-center">
              {/* Main Content */}
              <div className="space-y-6 mb-12">
                {/* Maintenance Icon */}
                <Fourfour className="size-32 lg:size-64 mx-auto" />

                <Header
                  title="Error 404"
                  subtitle="We're currently experiencing some difficulties. We'll be back online shortly."
                />
              </div>

              {/* Additional Info */}
              <div className="mt-12 text-sm text-center text-gray-500">
                <p>
                  For urgent inquiries, please contact our support team
                  directly.
                </p>
              </div>
            </div>
          </LayoutConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
