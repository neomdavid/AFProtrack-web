import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-gray-500">
          Please check the URL or navigate back to a valid page.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
