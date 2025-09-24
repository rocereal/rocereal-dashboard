import { ConfigPanel } from "@/components/config-panel";
import { Toaster } from "@/components/ui/sonner";
import { LayoutConfigProvider } from "@/lib/layout-config";
import { ThemeProvider } from "@/lib/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

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
        <ThemeProvider defaultTheme="dark" storageKey="fisio-ui-theme">
          <LayoutConfigProvider storageKey="fisio-layout-config">
            {children}
            <ConfigPanel />
            <Toaster />
          </LayoutConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
