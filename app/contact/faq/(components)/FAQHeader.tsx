import { HelpCircle } from "lucide-react";

export default function FAQHeader() {
  return (
    <div className="text-center mb-12">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <HelpCircle className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Find answers to common questions about our services. Can't find what
        you're looking for? Contact us.
      </p>
    </div>
  );
}
