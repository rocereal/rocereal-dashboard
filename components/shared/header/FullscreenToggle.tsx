"use client";

import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFullscreen}
      className="h-9 w-9"
    >
      {isFullscreen ? (
        <Minimize className="h-4 w-4" />
      ) : (
        <Maximize className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      </span>
    </Button>
  );
}
