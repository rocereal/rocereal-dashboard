export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: "item-1",
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button in the top right corner and fill out the registration form with your email address and password. You'll receive a confirmation email to verify your account.",
  },
  {
    id: "item-2",
    question: "How do I reset my password?",
    answer:
      "Click on 'Forgot Password' on the login page and enter your email address. We'll send you a link to reset your password. Make sure to check your spam folder if you don't see the email.",
  },
  {
    id: "item-3",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
  },
  {
    id: "item-4",
    question: "How do I contact customer support?",
    answer:
      "You can contact our customer support team through the contact form on this page, by emailing support@company.com, or by calling our toll-free number during business hours.",
  },
  {
    id: "item-5",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle.",
  },
  {
    id: "item-6",
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all our services. If you're not satisfied, contact our support team within 30 days of purchase for a full refund.",
  },
  {
    id: "item-7",
    question: "How do I update my billing information?",
    answer:
      "You can update your billing information in your account settings under the 'Billing' tab. All changes will be reflected in your next billing cycle.",
  },
  {
    id: "item-8",
    question: "Is my data secure?",
    answer:
      "Yes, we take data security very seriously. All data is encrypted and stored securely. We comply with industry standards for data protection and never share your personal information with third parties.",
  },
];
