"use client";

import React from "react";
import { useTheme } from "@/lib/theme-provider";
import { Toaster as Sonner, ToasterProps, toast as sonnerToast } from "sonner";
import { Button } from "./button";

/* ---------- Custom Headless Toast ---------- */
function showToast(toastData: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toastData.title}
      description={toastData.description}
      button={{
        label: toastData.button.label,
        onClick: toastData.button.onClick,
      }}
    />
  ));
}

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className="flex w-full md:max-w-[364px] items-center rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5 dark:bg-neutral-900">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <div className="ml-5 shrink-0">
        <Button
          size={"sm"}
          className="rounded bg-primary px-3 py-1 text-sm "
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Themed Toaster Wrapper ---------- */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  const currentTheme =
    theme === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return (
    <Sonner
      theme={currentTheme as ToasterProps["theme"]}
      className="toaster group font-sans"
      toastOptions={{
        style: { fontFamily: "var(--font-geist-sans)" },
        className: "group",
      }}
      closeButton
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success)",
          "--success-border": "var(--success)",
          "--error-bg": "var(--destructive)",
          "--error-border": "var(--destructive)",
          "--warning-bg": "var(--warning)",
          "--warning-border": "var(--warning)",
          "--info-bg": "var(--info)",
          "--info-border": "var(--info)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, showToast };

/* ---------- Types ---------- */
interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}
