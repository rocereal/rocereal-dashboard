import React from "react";

export const metadata = {
  title: "Product Coming Soon",
  description:
    "Exciting new product launching soon. Be the first to know when it's available!",
};

export default function ProductComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-100 to-red-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Product Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Exciting new product launching soon. Be the first to know when it's
          available!
        </p>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
