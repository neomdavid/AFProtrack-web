import React from "react";

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table header skeleton */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="h-4 bg-gray-300 rounded w-20 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Table rows skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex gap-4 items-center">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`h-4 bg-gray-300 rounded animate-pulse ${
                    colIndex === 0 ? "w-32" : "w-24"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
