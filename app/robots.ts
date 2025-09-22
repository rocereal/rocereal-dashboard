/**
 * Robots.txt Configuration
 * Dynamically generates robots.txt file for the Next.js application
 * Controls web crawler access to different parts of the website
 * Placed at: app/robots.ts in the App Router structure
 */

// Import Next.js types for metadata routes
import { MetadataRoute } from 'next'; // TypeScript types for Next.js metadata API

/**
 * Robots Configuration Function
 * Generates the robots.txt file content for search engine crawlers
 * Defines crawling rules for different user agents and provides sitemap location
 * @returns MetadataRoute.Robots object containing crawler instructions
 */
export default function robots(): MetadataRoute.Robots {
	// Get the base URL from environment variables, with fallback to production URL
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beta.kenyanwallstreet.com';

	return {
		// Define crawling rules for different user agents
		rules: [
			{
				// Default rules for all crawlers
				userAgent: '*',
				allow: '/', // Allow crawling of all pages by default
				disallow: [
					'/api/', // Block API endpoints from crawling
					'/admin/', // Block admin pages
					'/private/', // Block private content
					'/_next/webpack-hmr', // Block Next.js hot module replacement in development
				],
			},
			// Specifically allow social media crawlers for better social sharing
			{
				userAgent: 'facebookexternalhit/*', // Facebook crawler
				allow: '/',
			},
			{
				userAgent: 'Twitterbot', // Twitter crawler
				allow: '/',
			},
			{
				userAgent: 'LinkedInBot', // LinkedIn crawler
				allow: '/',
			},
			{
				userAgent: 'WhatsApp', // WhatsApp crawler
				allow: '/',
			},
			{
				userAgent: 'TelegramBot', // Telegram crawler
				allow: '/',
			},
			// Explicitly allow major search engines
			{
				userAgent: 'Googlebot', // Google search crawler
				allow: '/',
			},
			{
				userAgent: 'Bingbot', // Bing search crawler
				allow: '/',
			},
		],
		// Provide sitemap location for search engines
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
