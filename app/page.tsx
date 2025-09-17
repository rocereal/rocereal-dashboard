"use client";

import { ConfigurableLayout } from "@/components/configurable-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const sampleHeader = (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Configurable Template</h1>
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="text-sm hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm hover:text-primary">
            About
          </a>
          <a href="#" className="text-sm hover:text-primary">
            Contact
          </a>
        </nav>
      </div>
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    </div>
  );

  const sampleSidebar = (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">Navigation</h2>
      <nav className="space-y-2">
        <a href="#" className="block rounded px-3 py-2 text-sm hover:bg-accent">
          Dashboard
        </a>
        <a href="#" className="block rounded px-3 py-2 text-sm hover:bg-accent">
          Settings
        </a>
        <a href="#" className="block rounded px-3 py-2 text-sm hover:bg-accent">
          Profile
        </a>
        <a href="#" className="block rounded px-3 py-2 text-sm hover:bg-accent">
          Help
        </a>
      </nav>
    </div>
  );

  const sampleFooter = (
    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
      <div className="text-sm text-muted-foreground">
        © 2025 Configurable Template. All rights reserved.
      </div>
      <div className="flex space-x-4 text-sm text-muted-foreground">
        <a href="#" className="hover:text-primary">
          Privacy
        </a>
        <a href="#" className="hover:text-primary">
          Terms
        </a>
        <a href="#" className="hover:text-primary">
          Support
        </a>
      </div>
    </div>
  );

  return (
    <ConfigurableLayout
      header={sampleHeader}
      sidebar={sampleSidebar}
      footer={sampleFooter}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to the Configurable Template
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            This template features a floating configuration panel that allows
            you to customize the theme, layout, and typography settings in
            real-time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Theme Control</CardTitle>
              <CardDescription>
                Switch between light, dark, and system themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the floating configuration button (bottom-right) to change
                themes instantly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout Options</CardTitle>
              <CardDescription>
                Toggle header, footer, and sidebar visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Customize the layout structure to fit your needs with simple
                toggles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Adjust font sizes and spacing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fine-tune text appearance with configurable font sizes and
                border radius.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4 text-sm">
            <p>
              1. Click the floating settings icon in the bottom-right corner to
              open the configuration panel.
            </p>
            <p>
              2. Try switching between different themes (Light, Dark, System).
            </p>
            <p>3. Toggle the header, footer, and sidebar visibility options.</p>
            <p>
              4. Experiment with different font sizes and border radius
              settings.
            </p>
            <p>
              5. All settings are automatically saved and will persist across
              browser sessions.
            </p>
          </div>
        </div>
      </div>
    </ConfigurableLayout>
  );
}
