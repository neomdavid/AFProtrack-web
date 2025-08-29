import React from "react";

const AccessCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
      <div className="flex items-start gap-3">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />

        <div className="flex-1 min-w-0 space-y-2">
          {/* Name skeleton */}
          <div className="h-4 bg-gray-300 rounded w-3/4" />

          {/* AFP ID skeleton */}
          <div className="h-3 bg-gray-300 rounded w-1/2" />

          {/* Email skeleton */}
          <div className="h-3 bg-gray-300 rounded w-2/3" />

          {/* Unit and status skeleton */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="h-3 bg-gray-300 rounded w-1/3" />
            <div className="h-5 bg-gray-300 rounded-full w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCardSkeleton;
