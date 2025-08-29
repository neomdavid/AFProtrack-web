import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { AttendanceTableSkeleton } from "../skeletons";

const AttendanceTable = ({
  filteredTrainees,
  dayAttendance,
  onStatusChange,
  isDayCompleted,
  isDayCancelled,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  isLoading = false,
  selectedDate,
  programStartTime,
  programEndTime,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canRecordAttendance = user?.permissions?.canRecordAttendance;

  // Admin restrictions: can view but not edit attendance
  const canEditAttendance = !isAdmin || canRecordAttendance;

  // Check if the selected date is in the future
  const isFutureDate = () => {
    if (!selectedDate) return false;
    const today = new Date();
    const selected = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  };

  // Check if the selected date is in the past
  const isPastDate = () => {
    if (!selectedDate) return false;
    const today = new Date();
    const selected = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    return selected < today;
  };

  // Check if attendance can be recorded based on time restrictions
  const canRecordAttendanceNow = () => {
    if (!selectedDate || !programStartTime || !programEndTime) return false;

    const today = new Date();
    const selected = new Date(selectedDate);
    const now = new Date();

    // If it's not today, check if it's within 7 days in the past
    if (selected.toDateString() !== today.toDateString()) {
      if (selected > today) return false; // Future date

      // Check if it's within 7 days in the past
      const daysDiff = Math.floor((today - selected) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }

    // For today, check time restrictions
    const [startHour, startMinute] = programStartTime.split(":").map(Number);
    const [endHour, endMinute] = programEndTime.split(":").map(Number);

    const startTime = new Date(selected);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(selected);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Allow recording 2 hours before start time until end time
    const twoHoursBeforeStart = new Date(startTime);
    twoHoursBeforeStart.setHours(startHour - 2, startMinute, 0, 0);

    return now >= twoHoursBeforeStart && now <= endTime;
  };

  const getStatusBadge = (status) => {
    if (!status || status === "not_recorded") return null;

    if (status === "present") {
      return <span className="badge badge-sm badge-success">Present</span>;
    }
    if (status === "absent") {
      return <span className="badge badge-sm badge-error">Absent</span>;
    }
    return <span className="badge badge-sm badge-ghost">{status}</span>;
  };

  if (isLoading) {
    return <AttendanceTableSkeleton rows={8} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="label">
              <span className="label-text">Search Trainees</span>
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input input-bordered input-sm w-full"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Status Filter</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="font-semibold text-gray-700">Trainee</th>
              <th className="font-semibold text-gray-700">Email</th>
              {!isFutureDate() && (
                <>
                  <th className="font-semibold text-gray-700">Status</th>
                  <th className="font-semibold text-gray-700">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTrainees.map((trainee) => {
              const currentStatus = dayAttendance[trainee.id]?.status;
              return (
                <tr key={trainee.id} className="hover:bg-gray-50">
                  <td className="font-medium text-gray-900">{trainee.name}</td>
                  <td className="text-gray-700">{trainee.email}</td>
                  {!isFutureDate() && (
                    <>
                      <td className="">{getStatusBadge(currentStatus)}</td>
                      <td className="flex gap-2">
                        {canEditAttendance &&
                        !isDayCompleted &&
                        !isDayCancelled &&
                        canRecordAttendanceNow() ? (
                          <>
                            <button
                              className={`btn btn-xs ${
                                currentStatus === "present"
                                  ? "btn-success"
                                  : "btn-outline btn-success"
                              }`}
                              onClick={() =>
                                onStatusChange(trainee.id, {
                                  status: "present",
                                })
                              }
                            >
                              Present
                            </button>
                            <button
                              className={`btn btn-xs ${
                                currentStatus === "absent"
                                  ? "btn-error"
                                  : "btn-outline btn-error"
                              }`}
                              onClick={() =>
                                onStatusChange(trainee.id, { status: "absent" })
                              }
                            >
                              Absent
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {isDayCompleted ? (
                              <span className="text-gray-500 text-sm">
                                Day Completed
                              </span>
                            ) : isDayCancelled ? (
                              <span className="text-gray-500 text-sm">
                                Day Cancelled
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">
                                {!canRecordAttendanceNow() &&
                                !isDayCompleted &&
                                !isDayCancelled
                                  ? "Outside recording time"
                                  : "View Only"}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
