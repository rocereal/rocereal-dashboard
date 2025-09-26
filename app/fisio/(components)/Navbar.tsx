"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from "./ResizableNavbar";
import Link from "next/link";

export function NavbarLanding() {
  const navItems = [
    {
      name: "Views",
      link: "#views",
    },
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Technology",
      link: "#technology",
    },
    {
      name: "FAQ",
      link: "#faq",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link
              shallow={true}
              href={"https://fisio-docs.obare27.com"}
              passHref
              style={{ textDecoration: "none" }}
              className="cursor-pointer "
            >
              <Button variant="default" className="rounded-full">
                View Documentation
              </Button>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <Link
                shallow={true}
                href={"https://fisio-docs.obare27.com/contact"}
                passHref
                style={{ textDecoration: "none" }}
                className="cursor-pointer "
              >
                <Button variant="secondary" className="w-full">
                  Documentation
                </Button>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
