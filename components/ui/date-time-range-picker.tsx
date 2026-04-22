"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DateTimeRange {
  from?: Date;
  to?: Date;
}

interface DateTimeRangePickerProps {
  date?: DateTimeRange;
  onDateChange?: (date: DateTimeRange | undefined) => void;
  placeholder?: string;
  className?: string;
  showTime?: boolean;
}

export function DateTimeRangePicker({
  date,
  onDateChange,
  placeholder = "Pick a date and time range",
  className,
  showTime = false,
}: DateTimeRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateTimeRange | undefined>(
    date
  );

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const fromDateTime = new Date(range.from);
      fromDateTime.setHours(0, 0, 0, 0);

      const toDateTime = new Date(range.to);
      toDateTime.setHours(23, 59, 59, 999);

      const next = { from: fromDateTime, to: toDateTime };
      setTempRange(next);

      // When not showing time, apply immediately on full range selection
      if (!showTime) {
        onDateChange?.(next);
        setIsOpen(false);
      }
    } else if (range?.from) {
      const fromDateTime = new Date(range.from);
      fromDateTime.setHours(0, 0, 0, 0);
      setTempRange({ from: fromDateTime, to: tempRange?.to });
    } else {
      setTempRange(undefined);
    }
  };

  const handleTimeChange = (
    type: "from" | "to",
    field: "hour" | "minute",
    value: string
  ) => {
    if (!tempRange) return;

    const currentDate = tempRange[type];
    if (!currentDate) return;

    const newDate = new Date(currentDate);
    if (field === "hour") {
      newDate.setHours(parseInt(value), newDate.getMinutes());
    } else {
      newDate.setHours(newDate.getHours(), parseInt(value));
    }

    setTempRange({
      ...tempRange,
      [type]: newDate,
    });
  };

  const handleApply = () => {
    onDateChange?.(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(date);
    setIsOpen(false);
  };

  const formatDateTime = (dateTime?: Date) => {
    if (!dateTime) return "";
    return showTime
      ? format(dateTime, "MMM dd, yyyy 'at' h:mm a")
      : format(dateTime, "dd MMM yyyy");
  };

  return (
    <div className={cn("grid gap-2 w-fit", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="datetime"
            variant="outline"
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDateTime(date.from)} - {formatDateTime(date.to)}
                </>
              ) : (
                formatDateTime(date.from)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-6 space-y-6 max-w-2xl">
            {/* Date Selection */}
            <div>
              <h4 className="font-medium mb-3 text-sm">Select Date Range</h4>
              <Calendar
                mode="range"
                selected={
                  tempRange
                    ? {
                        from: tempRange.from,
                        to: tempRange.to,
                      }
                    : undefined
                }
                onSelect={handleDateSelect}
                numberOfMonths={2}
                className="rounded-md border-0"
              />
            </div>

            {/* Time Selection */}
            {showTime && (tempRange?.from || tempRange?.to) && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Select Times</h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* From Time */}
                  {tempRange?.from && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-12">From:</span>
                      <div className="flex items-center space-x-1">
                        <Select
                          value={tempRange.from.getHours().toString()}
                          onValueChange={(value) =>
                            handleTimeChange("from", "hour", value)
                          }
                        >
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm">:</span>
                        <Select
                          value={tempRange.from.getMinutes().toString()}
                          onValueChange={(value) =>
                            handleTimeChange("from", "minute", value)
                          }
                        >
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["00", "15", "30", "45"].map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* To Time */}
                  {tempRange?.to && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-12">To:</span>
                      <div className="flex items-center space-x-1">
                        <Select
                          value={tempRange.to.getHours().toString()}
                          onValueChange={(value) =>
                            handleTimeChange("to", "hour", value)
                          }
                        >
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm">:</span>
                        <Select
                          value={tempRange.to.getMinutes().toString()}
                          onValueChange={(value) =>
                            handleTimeChange("to", "minute", value)
                          }
                        >
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["00", "15", "30", "45"].map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!tempRange?.from || !tempRange?.to}
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
