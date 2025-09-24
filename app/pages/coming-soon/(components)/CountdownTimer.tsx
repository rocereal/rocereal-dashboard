/**
 * Countdown Timer Component
 * Displays a countdown timer showing days, hours, minutes, and seconds until target date
 * Updates every second and automatically stops when target date is reached
 * Used in coming soon pages to build anticipation for product launches
 * @param targetDate - Optional target date for countdown, defaults to 30 days from now
 * @param className - Additional CSS classes for styling
 * @returns JSX element displaying the countdown timer
 */

"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
}

/**
 * CountdownTimer component for displaying time remaining until target date
 * Calculates and displays days, hours, minutes, and seconds
 * Updates every second and handles countdown completion
 * @param targetDate - Optional target date, defaults to 30 days from current date
 * @param className - Additional CSS classes for custom styling
 * @returns JSX element representing the countdown timer display
 */
export default function CountdownTimer({
  targetDate,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target =
      targetDate ||
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
      })();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={cn(className, "flex gap-4 justify-start")}>
      <div className="text-start">
        <div className="text-3xl font-bold">{timeLeft.days}</div>
        <div className="text-sm dark:text-muted-background">Days</div>
      </div>
      <div className="text-start">
        <div className="text-3xl font-bold ">{timeLeft.hours}</div>
        <div className="text-sm dark:text-muted-background">Hours</div>
      </div>
      <div className="text-start">
        <div className="text-3xl font-bold ">{timeLeft.minutes}</div>
        <div className="text-sm dark:text-muted-background">Minutes</div>
      </div>
      <div className="text-start">
        <div className="text-3xl font-bold ">{timeLeft.seconds}</div>
        <div className="text-sm dark:text-muted-background">Seconds</div>
      </div>
    </div>
  );
}
