"use client";

import { Background } from "@/components/svg/Icons";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import PromoCarousel from "./Carousel";

// --- Circular Floating Text Component ---
export function CircularFloatingText({
  items,
  centerOffset = { x: 0, y: 0 },
}: {
  items: string[];
  centerOffset?: { x: number; y: number };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        const rect = containerRef.current!.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // radius = half the smaller dimension of container (so text touches edges)
  const radius = Math.min(dimensions.width, dimensions.height) / 2 - 40; // "-40" = padding from edge

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {items.map((text, index) => {
        const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
        const x =
          Math.cos(angle) * radius + dimensions.width / 2 + centerOffset.x;
        const y =
          Math.sin(angle) * radius + dimensions.height / 2 + centerOffset.y;

        return (
          <div
            key={index}
            className="absolute text-xs font-medium text-gray-600 dark:text-gray-300
                       bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm
                       border border-gray-200 dark:border-gray-700 transform 
                       -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}px`, top: `${y}px` }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="absolute size-fullitems-center justify-center opacity-20">
        <Background />
      </div>
      <div className="px-4 py-10 md:py-20">
        {/* Badge */}
        <div className="mx-auto flex w-fit items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-8">
          Modern Tech Stack
        </div>

        {/* Headline */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl">
          Build Admin Panels That Work Smarter
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal">
          Packed with reusable components, Tailwind styling, and Next.js best
          practices — so you can launch faster, without reinventing the wheel.
        </p>

        {/* Buttons */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Explore Now
          </Button>
        </div>

        {/* Preview Image */}
        {/* <div className="relative z-10 mt-20 rounded-3xl bg-neutral-100 p-4 shadow-md dark:bg-neutral-900">
          <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <Image
              src="/images/Promo Image.png"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </div> */}
      </div>

      <PromoCarousel />
    </div>
  );
}
