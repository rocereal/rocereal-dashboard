/**
 * Robots.txt Configuration
 * Dynamically generates robots.txt file for the Next.js application
 * Controls web crawler access to different parts of the website
 * Placed at: app/robots.ts in the App Router structure
 */

// Import Next.js types for metadata routes
import { MetadataRoute } from "next"; // TypeScript types for Next.js metadata API

/**
 * Robots Configuration Function
 * Generates the robots.txt file content for search engine crawlers
 * Defines crawling rules for different user agents - allows crawling of fisio landing page, disallows rest
 * @returns MetadataRoute.Robots object containing crawler instructions
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // Define crawling rules for different user agents
    rules: [
      {
        // Allow crawling of fisio landing page
        userAgent: "*",
        allow: "/fisio",
      },
      {
        // Disallow crawling of all other pages
        userAgent: "*",
        disallow: "/",
      },
    ],
    // No sitemap provided
  };
}
