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

                // Apply sidebar colors immediately
                const sidebarColors = {
                  dark: {
                    primary: 'oklch(0.929 0.013 255.508)',
                    'primary-foreground': 'oklch(0.208 0.042 265.755)',
                    accent: 'oklch(0.279 0.041 260.031)',
                    'accent-foreground': 'oklch(0.984 0.003 247.858)',
                    sidebar: 'oklch(0.208 0.042 265.755)',
                    'sidebar-foreground': 'oklch(0.984 0.003 247.858)',
                    border: 'oklch(1 0 0 / 10%)',
                    ring: 'oklch(0.551 0.027 264.364)'
                  },
                  light: {
                    primary: 'oklch(0.208 0.042 265.755)',
                    'primary-foreground': 'oklch(0.984 0.003 247.858)',
                    accent: 'oklch(0.968 0.007 247.896)',
                    'accent-foreground': 'oklch(0.208 0.042 265.755)',
                    sidebar: 'oklch(1 0 0)',
                    'sidebar-foreground': 'oklch(0.129 0.042 264.695)',
                    border: 'oklch(0.929 0.013 255.508)',
                    ring: 'oklch(0.704 0.04 256.788)'
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
          </LayoutConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
