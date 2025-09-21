"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountdownTimer from "../(components)/CountdownTimer";
import Subscribe from "../(components)/Form";
import SocialProof from "../(components)/SocialProof";

export default function SplitLeftPage() {
  return (
    <div className="space-y-8 max-w-md w-full">
      {/* Form */}

      <Card className="shadow-none !bg-transparent border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-start">
            Something Exciting is on the Way
          </CardTitle>
          <CardDescription className="text-start">
            We're working behind the scenes to bring you a fresh experience.
            Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CountdownTimer className={"!justify-start"} />
          <SocialProof className="!align-center !justify-center" />
          <Subscribe />
        </CardContent>
      </Card>
    </div>
  );
}
