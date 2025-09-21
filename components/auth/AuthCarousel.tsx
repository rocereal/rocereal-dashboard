"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ImageComponentOptimized from "../shared/ImageComponentOptimized";
import { Button } from "../ui/button";

export interface TestimonialSlide {
  id: number;
  image: string;
  quote: string;
  name: string;
  title: string;
  subtitle?: string;
}

export interface TestimonialCarouselProps {
  className?: string;
  slides?: TestimonialSlide[];
  type?: "left" | "right";
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
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

  // Navigation callback functions
  const scrollToPrev = useCallback(() => {
    if (!api) return; // Exit if API not available
    api.scrollPrev(); // Scroll to previous slide
  }, [api]);

  const scrollToNext = useCallback(() => {
    if (!api) return; // Exit if API not available
    api.scrollNext(); // Scroll to next slide
  }, [api]);

  const scrollToSlide = useCallback(
    (index: number) => {
      if (!api) return; // Exit if API not available
      api.scrollTo(index); // Scroll to specific slide
    },
    [api]
  );

  return (
    <div className={`relative ${className} w-full h-full`}>
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
        <CarouselContent className="ml-0">
          {slides?.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative overflow-hidden h-[30vh] lg:h-screen w-full flex flex-col">
                <ImageComponentOptimized
                  unoptimized={true}
                  alt={slide.name}
                  src={slide.image}
                  placeholder="blur"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent size-full">
                  <div className="pb-12 lg:pb-24 px-6 text-white relative z-10 size-full justify-end flex-row">
                    <div className="flex flex-col size-full align-items-end place-items-end justify-end text-start">
                      <div
                        className={`flex  items-center justify-between w-full mb-4`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`${
                              type !== "left"
                                ? "font-semibold text-base lg:text-3xl"
                                : "font-semibold text-base"
                            }`}
                          >
                            {slide.title}
                          </span>
                          <span className="text-sm opacity-90">
                            {slide.subtitle}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-4 z-40">
                          <Button
                            onClick={scrollToPrev}
                            disabled={!canScrollPrev}
                            className="bg-transparent border border-neutral-200 rounded-full p-2 size-8 hover:bg-white/10 disabled:opacity-50"
                            size="icon"
                          >
                            <ArrowLeft className="size-4" />
                          </Button>
                          <Button
                            onClick={scrollToNext}
                            disabled={!canScrollNext}
                            className="bg-transparent border border-neutral-200 rounded-full p-2 size-8 hover:bg-white/10 disabled:opacity-50"
                            size="icon"
                          >
                            <ArrowRight className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dot indicators for carousel navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex space-x-2">
            {/* Create dot for each slide */}
            {slides?.map((slide, index: number) => (
              <button
                key={`dot-${slide.id || index}`}
                onClick={() => scrollToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`size-[5px] rounded-full transition-all duration-200 cursor-pointer ${
                  current === index
                    ? "bg-white scale-125" // Active dot styling
                    : "bg-white/60 hover:bg-white/80" // Inactive dot styling
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
