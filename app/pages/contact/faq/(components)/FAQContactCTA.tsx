/**
 * FAQ Contact Call-to-Action Component
 * Call-to-action section for FAQ pages encouraging users to contact support
 * Provides direct link to contact page for additional assistance
 * Used when FAQ answers don't fully resolve user questions
 * @returns JSX element representing the contact CTA section
 */

/**
 * FAQContactCTA component for displaying contact call-to-action
 * Renders centered CTA with link to contact page for additional support
 * Provides clear path for users who need further assistance
 * @returns JSX element representing the contact CTA
 */
export default function FAQContactCTA() {
  return (
    <div className="text-center mt-12">
      <p className="text-gray-600 mb-4">
        Still have questions? We&apos;re here to help!
      </p>
      <a
        href="/contact"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Contact Us
      </a>
    </div>
  );
}
