"use client";

import ContactHeader from "../(components)/ContactHeader";
import ContactForm from "../(components)/ContactForm";
import ContactInfoCards from "../(components)/ContactInfoCards";

export default function ContactPage() {
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
          title=" Contact Us"
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
