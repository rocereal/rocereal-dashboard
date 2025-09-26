"use client";

import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="h-[45vh] lg:h-[100vh]">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 aspect-video">
        <ImageComponentOptimized
          src={"/images/Cover Website.webp"}
          alt={"Fisio"}
          unoptimized={true}
          className="object-cover w-full h-full"
          fill
        />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center">
        <div className="px-4 py-30 lg:py-10 relative z-10">
          {/* Badge */}
          {/* <div className="mx-auto flex w-fit items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-8">
            Best Nextjs Admin Template
          </div> */}

          {/* Headline */}
          <h1 className="relative z-10 mx-auto text-center text-2xl font-bold md:text-4xl text-dark dark:text-white lg:text-white">
            Build Admin Panels That Work Smarter
          </h1>

          {/* Subtitle */}
          <p className="relative z-10 mx-auto max-w-2xl text-center text-sm lg:text-lg font-normal text-dark dark:text-white lg:text-white">
            Packed with reusable components, Tailwind styling, and Next.js best
            practices — so you can launch faster, without reinventing the wheel.
          </p>

          {/* Buttons */}
          <div className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              shallow={true}
              href={"https://fisio.obare27.com"}
              target="_blank"
              passHref
              style={{ textDecoration: "none" }}
              className="cursor-pointer"
            >
              <Button size="sm">Get Started</Button>
            </Link>
            <Link
              shallow={true}
              href={"https://themeforest.net/user/obare27"}
              target="_blank"
              passHref
              style={{ textDecoration: "none" }}
              className="cursor-pointer"
            >
              <Button size="sm" className="bg-[#82b440] hover:bg-[#82b440]">
                Portfolio
              </Button>
            </Link>
            <Link
              shallow={true}
              href={"https://fisio-docs.obare27.com/contact"}
              passHref
              style={{ textDecoration: "none" }}
              className="cursor-pointer"
            >
              <Button
                size="sm"
                className="cursor-pointer bg-[#C57642] hover:bg-[#C57642]"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
