import React from "react";

const ProgramsTableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 rounded w-48 animate-pulse" />
        <div className="h-8 bg-gray-300 rounded w-32 animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table header skeleton */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Table rows skeleton */}
          <div className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="px-6 py-4">
                <div className="flex gap-4 items-center">
                  {/* Program name */}
                  <div className="h-4 bg-gray-300 rounded w-40 animate-pulse" />

                  {/* Duration */}
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />

                  {/* Instructor */}
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />

                  {/* Participants */}
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />

                  {/* Status */}
                  <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse" />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-300 rounded w-24 animate-pulse" />
                    <div className="h-6 bg-gray-300 rounded w-20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsTableSkeleton;
