import React from "react";

export const metadata = {
  title: "Website Coming Soon",
  description:
    "Our new website is under construction. Get ready for an enhanced online experience!",
};

export default function WebsiteComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Website Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Our new website is under construction. Get ready for an enhanced
          online experience!
        </p>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
