import { cn } from "@/lib/utils";

interface SocialProofProps {
  className?: string;
}

export default function SocialProof({ className }: SocialProofProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex -space-x-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-red-500 border"></div>
        <div className="w-10 h-10 rounded-full bg-gray-800 border flex items-center justify-center">
          <span className="text-white text-xs font-semibold">12k+</span>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-muted-foreground">
        <span className="font-semibold">12,000+ people</span> already joined the
        Fisio's
        <br />
        plan. We'll let you know when we launch!
      </div>
    </div>
  );
}
