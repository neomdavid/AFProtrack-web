import React from "react";

const AttendanceTableSkeleton = ({ rows = 8 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters skeleton */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse" />
            <div className="h-9 bg-gray-300 rounded w-full animate-pulse" />
          </div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-20 mb-2 animate-pulse" />
            <div className="h-9 bg-gray-300 rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-semibold text-gray-700">Trainee</th>
              <th className="font-semibold text-gray-700">Email</th>
              <th className="font-semibold text-gray-700">Status</th>
              <th className="font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
                  </div>
                </td>
                <td>
                  <div className="h-4 bg-gray-300 rounded w-40 animate-pulse" />
                </td>
                <td>
                  <div className="h-6 bg-gray-300 rounded-full w-16 animate-pulse" />
                </td>
                <td>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-300 rounded w-16 animate-pulse" />
                    <div className="h-6 bg-gray-300 rounded w-16 animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTableSkeleton;
