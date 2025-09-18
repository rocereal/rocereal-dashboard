"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LayoutConfig = {
  sidebarCollapsed: boolean;
  headerVisible: boolean;
  footerVisible: boolean;
  colorTheme: "teal" | "blue" | "orange" | "neutral" | "green";
};

type LayoutConfigProviderProps = {
  children: React.ReactNode;
  defaultConfig?: Partial<LayoutConfig>;
  storageKey?: string;
};

type LayoutConfigProviderState = {
  config: LayoutConfig;
  updateConfig: (updates: Partial<LayoutConfig>) => void;
  resetConfig: () => void;
};

const defaultLayoutConfig: LayoutConfig = {
  sidebarCollapsed: false,
  headerVisible: true,
  footerVisible: true,
  colorTheme: "neutral",
};

const initialState: LayoutConfigProviderState = {
  config: defaultLayoutConfig,
  updateConfig: () => null,
  resetConfig: () => null,
};

const LayoutConfigContext =
  createContext<LayoutConfigProviderState>(initialState);

export function LayoutConfigProvider({
  children,
  defaultConfig = {},
  storageKey = "fisio-layout-config",
  ...props
}: LayoutConfigProviderProps) {
  const [config, setConfig] = useState<LayoutConfig>(() => {
    if (typeof window === "undefined")
      return { ...defaultLayoutConfig, ...defaultConfig };

    try {
      const stored = localStorage.getItem(storageKey);
      return stored
        ? { ...defaultLayoutConfig, ...JSON.parse(stored), ...defaultConfig }
        : { ...defaultLayoutConfig, ...defaultConfig };
    } catch {
      return { ...defaultLayoutConfig, ...defaultConfig };
    }
  });

  const updateConfig = (updates: Partial<LayoutConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(newConfig));
      }
      return newConfig;
    });
  };

  // Apply color theme class to document root element
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      // Remove all existing theme classes
      root.classList.remove(
        "theme-teal",
        "theme-blue",
        "theme-orange",
        "theme-neutral",
        "theme-green"
      );

      // Add the current theme class
      root.classList.add(`theme-${config.colorTheme}`);
    }
  }, [config.colorTheme]);

  const resetConfig = () => {
    setConfig(defaultLayoutConfig);
    localStorage.removeItem(storageKey);
  };

  const value = {
    config,
    updateConfig,
    resetConfig,
  };

  return (
    <LayoutConfigContext.Provider {...props} value={value}>
      {children}
    </LayoutConfigContext.Provider>
  );
}

export const useLayoutConfig = () => {
  const context = useContext(LayoutConfigContext);

  if (context === undefined)
    throw new Error(
      "useLayoutConfig must be used within a LayoutConfigProvider"
    );

  return context;
};
