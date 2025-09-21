"use client";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LeftContent() {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    alert(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

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
  }, []);

  return (
    <div className="space-y-8 max-w-xl align-center justify-center">
      <Card className="backdrop-blur-sm mx-auto justify-center align-center">
        <CardHeader className="space-y-4">
          <div className="w-16 h-16 rounded-full flex">
            <Logo />
          </div>
          <CardTitle className="text-2xl text-start">
            Something Exciting is on the Way
          </CardTitle>
          <CardDescription>
            We're working behind the scenes to bring you a fresh experience.
            Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-start">
            <div className="text-start">
              <div className="text-3xl font-bold text-purple-600">
                {timeLeft.days}
              </div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            <div className="text-start">
              <div className="text-3xl font-bold text-purple-600">
                {timeLeft.hours}
              </div>
              <div className="text-sm text-gray-600">Hours</div>
            </div>
            <div className="text-start">
              <div className="text-3xl font-bold text-purple-600">
                {timeLeft.minutes}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="text-start">
              <div className="text-3xl font-bold text-purple-600">
                {timeLeft.seconds}
              </div>
              <div className="text-sm text-gray-600">Seconds</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full"
            >
              Subscribe
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-red-500 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-semibold">12k+</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">12,000+ people</span> already
              joined the Fantop's
              <br />
              increase followers plan. Get started today!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
