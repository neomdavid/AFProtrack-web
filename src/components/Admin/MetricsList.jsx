// components/MetricsList.jsx
import React from "react";
import MetricItem from "./MetricItem";
import { useGetPerformanceMetricsQuery } from "../../features/api/adminEndpoints";
import LoadingSpinner from "../LoadingSpinner";

const MetricsList = () => {
  // Fetch performance metrics data
  const {
    data: metricsData,
    isLoading,
    error,
  } = useGetPerformanceMetricsQuery();

  // Show loading spinner if data is loading
  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex justify-center items-center h-32 bg-white border-3 shadow-sm border-gray-200 rounded-sm">
          <LoadingSpinner />
        </div>
        <div className="flex justify-center items-center h-32 bg-white border-3 shadow-sm border-gray-200 rounded-sm">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  // Show error message if data failed to load
  if (error) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex justify-center items-center h-32 bg-white border-3 shadow-sm border-gray-200 rounded-sm">
          <div className="text-center text-red-600">
            <p className="mb-2">Failed to load performance metrics</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-32 bg-white border-3 shadow-sm border-gray-200 rounded-sm">
          <div className="text-center text-red-600">
            <p className="mb-2">Failed to load performance metrics</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }

  // Transform API data to match component expectations
  const metrics = [
    {
      title: "Performance Metrics",
      items: [
        {
          label: "Program Completion Rate",
          value: metricsData?.performanceMetrics?.completionRate || 0,
          color: "#3a77d2",
        },
        {
          label: "Attendance Rate",
          value: metricsData?.performanceMetrics?.attendanceRate || 0,
          color: "#10b981",
        },
      ],
    },
    {
      title: "Additional Metrics",
      items: [
        {
          label: "Dropout Rate",
          value: metricsData?.additionalMetrics?.dropoutRate || 0,
          color: "#f87171",
        },
        {
          label: "Satisfaction Score",
          value: metricsData?.additionalMetrics?.satisfactionScore || 0,
          color: "#facc15",
        },
      ],
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((group, index) => (
        <div
          key={index}
          className="flex flex-1 flex-col  gap-4 sm:gap-6 bg-white p-3 sm:p-6 border-3 shadow-sm border-gray-200 rounded-sm"
        >
          <p className="text-lg sm:text-xl font-semibold mb-1">{group.title}</p>
          {group.items.map((item, i) => (
            <MetricItem
              key={i}
              label={item.label}
              value={item.value}
              color={item.color}
            />
          ))}
        </div>
      ))}
    </section>
  );
};

export default MetricsList;
