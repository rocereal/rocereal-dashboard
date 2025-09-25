"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { StaticImageData } from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface TestimonialSlide {
  id: number;
  image: string | StaticImageData;
  quote?: string;
  name?: string;
  title: string;
  subtitle?: string;
}

export interface TestimonialCarouselProps {
  className?: string;
  slides?: TestimonialSlide[];
  type?: "left" | "right";
}

// Default carousel slides showcasing Fisio dashboard features
const defaultSlides: TestimonialSlide[] = [
  {
    id: 1,
    image: "/images/Light Calendar Dashboard.png",
    title: "Calendar Dashboard",
    subtitle: "Smart scheduling with team collaboration features",
  },
  {
    id: 2,
    image: "/images/Dark Tasks Dashboard.png",
    title: "Tasks Dashboard",
    subtitle: "Project management with kanban boards and timelines",
  },
  {
    id: 3,
    image: "/images/Light Messenger Dashboard.png",
    title: "Messenger Dashboard",
    subtitle: "Unified messaging with video calls and file sharing",
  },
  {
    id: 4,
    image: "/images/Dark Email Dashboard.png",
    title: "Email Dashboard",
    subtitle: "Professional email management and communication",
  },
  {
    id: 5,
    image: "/images/Light Files Dashboard.png",
    title: "Files Dashboard",
    subtitle: "Secure file storage and collaboration platform",
  },
  {
    id: 6,
    image: "/images/Dark E-commerce Performance Dashboard.png",
    title: "E-commerce Dashboard",
    subtitle: "Complete online store management solution",
  },
  {
    id: 7,
    image: "/images/Light Learning Performance Dashboard.png",
    title: "Learning Management",
    subtitle: "Educational platform for courses and training",
  },
  {
    id: 8,
    image: "/images/Dark User Management - Fisio Dashboard.png",
    title: "User Management",
    subtitle: "Comprehensive user administration system",
  },
  {
    id: 9,
    image: "/images/Light Artificial Intelligence Dashboard.png",
    title: "AI Dashboard",
    subtitle: "Advanced AI analytics with machine learning insights",
  },
  {
    id: 10,
    image: "/images/Dark Financial Performance Dashboard.png",
    title: "Finance Dashboard",
    subtitle: "Financial overview with budgeting and expense tracking",
  },
];

const PromoCarousel: React.FC<TestimonialCarouselProps> = ({
  className = "",
  slides,
  type = "left",
}) => {
  // Carousel API state for controlling navigation
  const [api, setApi] = useState<CarouselApi>();

  // Current slide index state
  const [current, setCurrent] = useState(0);

  // Navigation button states
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update carousel state when API changes
  useEffect(() => {
    if (!api) {
      return; // Exit if API is not available
    }

    // Function to update all carousel state
    const updateState = () => {
      setCurrent(api.selectedScrollSnap()); // Update current slide index
      setCanScrollPrev(api.canScrollPrev()); // Update previous button state
      setCanScrollNext(api.canScrollNext()); // Update next button state
    };

    // Set initial state
    updateState();

    // Listen for carousel changes
    api.on("select", updateState); // When slide changes
    api.on("reInit", updateState); // When carousel reinitializes

    // Cleanup event listeners
    return () => {
      api.off("select", updateState);
      api.off("reInit", updateState);
    };
  }, [api]); // Re-run when API changes

  return (
    <div
      className={`relative ${className} w-full h-full z-20 gap-4 flex flex-col`}
    >
      <Carousel
        opts={{
          // align: "start",
          loop: true,
          duration: 30, // Smooth transition duration (30ms)
          dragFree: false, // Disable free dragging for smoother control
        }}
        plugins={[
          Autoplay({
            delay: 5000, // Slightly longer delay for better UX
            stopOnInteraction: false, // Continue autoplay after user interaction
            stopOnMouseEnter: true, // Pause on hover
          }),
        ]}
        className="w-full"
        setApi={setApi} // Connect to carousel API
      >
        <CarouselContent className="ml-2">
          {(slides || defaultSlides).map((slide, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="relative overflow-hidden aspect-video w-full flex flex-col">
                <ImageComponentOptimized
                  unoptimized={true}
                  alt={slide.name || slide.title}
                  src={slide.image}
                  fill
                  className="object-cover"
                />
                {/* Slide overlay with title and subtitle */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end">
                  <h3 className="text-white text-sm lg:text-sm font-bold mb-2">
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-white/90 text-sm hidden lg:block">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PromoCarousel;
