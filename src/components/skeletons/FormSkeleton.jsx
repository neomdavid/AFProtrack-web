import React from "react";

const FormSkeleton = ({ fields = 6 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          {/* Label skeleton */}
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />

          {/* Input skeleton */}
          <div className="h-10 bg-gray-300 rounded w-full animate-pulse" />
        </div>
      ))}

      {/* Button skeleton */}
      <div className="pt-4">
        <div className="h-10 bg-gray-300 rounded w-32 animate-pulse" />
      </div>
    </div>
  );
};

export default FormSkeleton;
