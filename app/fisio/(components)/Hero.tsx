"use client";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <>
      <div className="hidden lg:block h-[45vh] lg:h-screen">
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
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-end md:justify-start h-full">
          <div className="px-4 -mb-8 lg:mb-0 relative z-10">
            {/* Headline */}
            <h1 className="relative z-10 mx-auto text-center text-2xl font-bold md:text-4xl text-dark dark:text-white md:text-white">
              Build Admin Panels That Work Smarter
            </h1>
            {/* Subtitle */}
            <p className="relative z-10 mx-auto max-w-2xl text-center text-sm lg:text-lg font-normal text-dark dark:text-white md:text-white">
              Packed with reusable components, Tailwind styling, and Next.js
              best practices — so you can launch faster, without reinventing the
              wheel.
            </p>
            {/* Buttons */}
            <div className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="sm"
                onClick={() =>
                  document
                    .getElementById("views")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get Started
              </Button>
              <Link
                shallow={true}
                href={"https://obare27.com"}
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
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:hidden">
        {/* Background Image */}
        <div className=" inset-0 -z-10 aspect-video">
          <ImageComponentOptimized
            src={"/images/01_cover.jpg"}
            alt={"Fisio"}
            unoptimized={true}
            className="object-cover w-full h-full"
            fill
          />
        </div>
        {/* Spacer to push content down */}
        {/* <div className="flex-1"></div> */}
        {/* Content at bottom */}
        <div className="relative mx-auto flex max-w-7xl flex-col items-center">
          <div className="px-4 mb-4 relative z-10">
            {/* Headline */}
            <h1 className="relative z-10 mx-auto text-center text-2xl font-bold text-dark dark:text-white">
              Build Admin Panels That Work Smarter
            </h1>
            {/* Subtitle */}
            <p className="relative z-10 mx-auto max-w-2xl text-center text-sm font-normal text-dark dark:text-white">
              Packed with reusable components, Tailwind styling, and Next.js
              best practices — so you can launch faster, without reinventing the
              wheel.
            </p>
            {/* Buttons */}
            <div className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="sm"
                onClick={() =>
                  document
                    .getElementById("views")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get Started
              </Button>
              <Link
                shallow={true}
                href={"https://obare27.com"}
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
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
