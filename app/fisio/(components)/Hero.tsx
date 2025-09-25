"use client";

import { ThemeToggle } from "@/components/shared/header";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <Navbar />

      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <div className="mx-auto flex w-fit items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-8">
          Modern Tech Stack
        </div>

        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold  md:text-4xl lg:text-7xl ">
          Launch your website in hours, not days
        </h1>
        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal ">
          With AI, you can launch your website in hours, not days. Try our best
          in class, state of the art, cutting edge AI tools to get your website
          up.
        </p>
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Explore Now
          </Button>
          <Button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </Button>
        </div>
        <div className="relative z-10 mt-20 rounded-3xl bg-neutral-100 p-4 shadow-md dark:bg-neutral-900">
          <div className="w-full aspect-video overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <ImageComponentOptimized
              src="/images/Promo Image.png"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between  bg-background/80 px-4 py-4 backdrop-blur-md ">
      <div className="w-16 h-16 flex">
        <Logo />
      </div>
      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button className="w-fit transform rounded-lg px-6 py-2 font-medium  transition-all duration-300 hover:-translate-y-0.5 ">
          Get Started
        </Button>
      </div>
    </nav>
  );
};
