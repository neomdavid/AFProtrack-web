import React from "react";

const ProgramModalSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-300 rounded w-64 animate-pulse" />
        <div className="h-8 bg-gray-300 rounded w-24 animate-pulse" />
      </div>

      {/* Program details skeleton */}
      <div className="space-y-4">
        {/* Program name */}
        <div className="flex items-center">
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-48 animate-pulse" />
        </div>

        {/* Instructor */}
        <div className="flex items-center">
          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-32 animate-pulse" />
        </div>

        {/* Venue */}
        <div className="flex items-center">
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-40 animate-pulse" />
        </div>

        {/* Status */}
        <div className="flex items-center">
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-6 bg-gray-300 rounded-full w-20 animate-pulse" />
        </div>

        {/* Max Participants */}
        <div className="flex items-center">
          <div className="w-28 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-20 animate-pulse" />
        </div>

        {/* Program Dates */}
        <div className="flex items-center">
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-32 animate-pulse" />
        </div>

        {/* Enrollment Period */}
        <div className="flex items-center">
          <div className="w-28 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-32 animate-pulse" />
        </div>

        {/* Time */}
        <div className="flex items-center">
          <div className="w-12 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="ml-3 h-4 bg-gray-300 rounded w-32 animate-pulse" />
        </div>
      </div>

      {/* Trainees section skeleton */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-300 rounded w-24 animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex gap-4 items-center">
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramModalSkeleton;
