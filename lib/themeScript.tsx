import Script from "next/script";

interface ThemeLayoutScriptProps {
  themeStorageKey?: string;
  layoutStorageKey?: string;
  defaultTheme?: "light" | "dark" | "system";
  defaultLayout?: "sidebar" | "header-nav";
  defaultColorTheme?: string;
}

// This file is important to ensure no flashing or glitching,
// You can remove it incase you are opening to a page without
// header or sidebar as the first page

/**
 * This file is important to ensure no flashing or glitching,
 * You can remove it incase you are opening to a page without
 * header or sidebar as the first page like auth pages
 */

export function ThemeLayoutScript({
  themeStorageKey = "fisio-ui-theme",
  layoutStorageKey = "fisio-layout-config",
  defaultTheme = "light",
  defaultLayout = "sidebar",
  defaultColorTheme = "neutral",
}: ThemeLayoutScriptProps) {
  const scriptContent = `
    try {
      const theme = localStorage.getItem('${themeStorageKey}') || '${defaultTheme}';
      
      // Get or set default layout config
      let layoutConfig;
      try {
        const storedConfig = localStorage.getItem('${layoutStorageKey}');
        layoutConfig = storedConfig ? JSON.parse(storedConfig) : { 
          layoutType: '${defaultLayout}', 
          colorTheme: '${defaultColorTheme}' 
        };
      } catch {
        layoutConfig = { 
          layoutType: '${defaultLayout}', 
          colorTheme: '${defaultColorTheme}' 
        };
      }
      
      // Ensure layout config is in localStorage
      localStorage.setItem('${layoutStorageKey}', JSON.stringify(layoutConfig));
      
      const colorTheme = layoutConfig.colorTheme;
      const layoutType = layoutConfig.layoutType;
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

      // Apply color theme immediately
      root.classList.add('theme-' + colorTheme);
      
      // Apply layout type immediately to prevent flash
      root.setAttribute('data-layout', layoutType);

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
    } catch (e) {
      console.warn('Failed to initialize theme and layout:', e);
    }
  `;

  return (
    <Script id="theme-layout-script" strategy="beforeInteractive">
      {scriptContent}
    </Script>
  );
}
