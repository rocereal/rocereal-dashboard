"use client";

import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DateTimeRangePicker,
  DateTimeRange,
} from "@/components/ui/date-time-range-picker";
import { Calendar } from "@/components/ui/calendar";

import { ReactNode, useState } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: {
    label: string;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    icon?: ReactNode;
  };
  dateRange?: DateTimeRange;
  onDateRangeChange?: (dateRange: DateTimeRange | undefined) => void;
}

export function DashboardHeader({
  title,
  subtitle,
  breadcrumbs = [],
  primaryAction,
  secondaryAction,
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));

  return (
    <div className="flex flex-col space-y-4 pb-6">
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header Content */}
      <div className="flex items-center justify-between">
        {/* Title and Subtitle */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </div>

        {/* Action Buttons */}
        {(primaryAction || secondaryAction || dateRange) && (
          <div className="flex items-center space-x-2">
            {primaryAction && (
              <Button
                onClick={() => console.log(`${primaryAction.label} clicked`)}
                className="flex items-center space-x-2"
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </Button>
            )}
            {(dateRange !== undefined || onDateRangeChange) && (
              <DateTimeRangePicker
                date={dateRange}
                onDateChange={onDateRangeChange}
                placeholder="Select date & time range"
                className="w-auto"
              />
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={() => console.log(`${secondaryAction.label} clicked`)}
                className="flex items-center space-x-2"
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
