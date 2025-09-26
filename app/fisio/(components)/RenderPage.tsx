"use client";

import PromoCarousel from "./Carousel";
import { FAQ } from "./FAQ";
import { Features } from "./Features";
import { HeroSection } from "./Hero";
import { NavbarLanding } from "./Navbar";
import PagesViews from "./PageTabs";
import TechStack from "./TechStack";
import { TechStackChecklist } from "./TechStackChecklist";

/**
 * Fisio Dashboard Landing Page Component
 * Promotional landing page for the Fisio dashboard with hero section,
 * feature cards, and call-to-action buttons
 * @returns The JSX element representing the Fisio dashboard landing page
 */
export default function RenderPage() {
  return (
    <div className="min-h-screen pt-20">
      <NavbarLanding />
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack">
        <TechStack />
      </section>

      {/* Views Section */}
      <section id="views">
        <PagesViews />
      </section>

      {/* Technology Section */}
      <section id="technology">
        <TechStackChecklist />
      </section>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      <section className="overflow-x-hidden max-w-7xl mx-auto">
        <PromoCarousel />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>
    </div>
  );
}
