import React from "react";

const AttendanceSummary = ({ daySummary, dayAttendance, totalTrainees }) => {
  const filled = Object.values(dayAttendance).filter(
    (r) => r?.status === "present" || r?.status === "absent"
  ).length;
  const pct = totalTrainees ? Math.round((filled / totalTrainees) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-stretch">
      <div className="p-2 rounded border border-gray-200 bg-green-50">
        <div className="text-xs text-gray-500">Present</div>
        <div className="text-lg font-semibold text-green-700">
          {daySummary.present}
        </div>
      </div>
      <div className="p-2 rounded border border-gray-200 bg-red-50">
        <div className="text-xs text-gray-500">Absent</div>
        <div className="text-lg font-semibold text-red-700">
          {daySummary.absent}
        </div>
      </div>
      {/* Completion progress */}
      <div className="p-3 rounded border border-gray-200 bg-white flex flex-col justify-center">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Filled entries</span>
            <span>
              {filled}/{totalTrainees} ({pct}%)
            </span>
          </div>
          <progress
            className="progress w-full"
            value={pct}
            max="100"
          ></progress>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
