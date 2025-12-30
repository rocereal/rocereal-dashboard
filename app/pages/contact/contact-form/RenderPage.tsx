/**
 * Contact Form Render Page Component
 * Main render component for the contact form page combining all contact components
 * Displays contact header, form, and information cards in responsive layout
 * Handles form submission and provides user feedback
 * Serves as the main contact interface for user inquiries
 */

"use client";

import ContactHeader from "../(components)/ContactHeader";
import ContactForm from "../(components)/ContactForm";
import ContactInfoCards from "../(components)/ContactInfoCards";

/**
 * ContactPage component for rendering the complete contact form interface
 * Combines header, form, and contact information in responsive grid layout
 * Manages form submission and provides user feedback on successful submission
 * @returns JSX element representing the full contact page layout
 */
export default function ContactPage() {
  /**
   * Handles contact form submission with user data
   * Processes form data and provides user feedback
   * @param data - The submitted contact form data
   */
  const handleFormSubmit = (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    // Handle form submission
    console.log("Contact form submitted:", data);
    alert(
      `Thank you ${data.name}! We'll get back to you at ${data.email} soon.`
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <ContactHeader
          title=" Contact Me"
          subtitle=" Get in touch with us. We'd love to hear from you and answer any
        questions you may have."
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="space-y-6">
            <ContactForm onSubmit={handleFormSubmit} />
          </div>

          {/* Contact Information Cards */}
          <div className="space-y-6">
            <ContactInfoCards />
          </div>
        </div>
      </div>
    </div>
  );
}
