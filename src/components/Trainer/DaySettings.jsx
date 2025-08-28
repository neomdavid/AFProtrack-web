import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const DaySettings = ({
  dayStartTime,
  dayEndTime,
  dayStatus,
  isEditingTimes,
  isDayCompleted,
  isDayCancelled,
  metaCancelReason,
  onStartTimeChange,
  onEndTimeChange,
  onStatusChange,
  onToggleEditTimes,
  onMarkDayCompleted,
  onReopenDay,
  onCancelDay,
  onUncancelDay,
  selectedDate,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canUpdateSessionMetadata = user?.permissions?.canUpdateSessionMetadata;
  const canMarkDayCompleted = user?.permissions?.canMarkDayCompleted;
  const canReopenCompletedDay = user?.permissions?.canReopenCompletedDay;

  // Admin restrictions: can view but not edit
  const canEdit = !isAdmin || canUpdateSessionMetadata;
  const canComplete = !isAdmin || canMarkDayCompleted;
  const canReopen = !isAdmin || canReopenCompletedDay;

  // Local state for cancellation
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === "cancelled") {
      setShowCancelInput(true);
      setCancelReason("");
    } else {
      setShowCancelInput(false);
      setCancelReason("");
      onStatusChange(e);
    }
  };

  const handleCancelDay = () => {
    if (cancelReason.trim()) {
      onCancelDay(cancelReason);
      setShowCancelInput(false);
      setCancelReason("");
    }
  };

  const handleUncancelDay = () => {
    onUncancelDay();
    setShowCancelInput(false);
    setCancelReason("");
  };

  return (
    <div className="p-3 rounded border border-gray-200 bg-white flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">
              <span className="label-text">Start Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered input-sm w-full"
              value={dayStartTime}
              onChange={onStartTimeChange}
              disabled={
                !canEdit || !isEditingTimes || isDayCompleted || isDayCancelled
              }
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">End Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered input-sm w-full"
              value={dayEndTime}
              onChange={onEndTimeChange}
              disabled={
                !canEdit || !isEditingTimes || isDayCompleted || isDayCancelled
              }
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Day Status</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={dayStatus}
              onChange={handleStatusChange}
              disabled={!canEdit || isDayCompleted}
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button
              className={`btn btn-sm ${
                isEditingTimes ? "btn-primary" : "btn-outline"
              }`}
              onClick={onToggleEditTimes}
              disabled={isDayCompleted || isDayCancelled}
            >
              {isEditingTimes ? "Save Times" : "Adjust Times"}
            </button>
          )}

          {canComplete && !isDayCompleted && (
            <button
              className="btn btn-sm btn-outline btn-success"
              onClick={onMarkDayCompleted}
              disabled={isDayCancelled}
            >
              Mark Complete
            </button>
          )}

          {canReopen && isDayCompleted && (
            <button
              className="btn btn-sm btn-outline btn-warning"
              onClick={onReopenDay}
            >
              Reopen Day
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Reason Input */}
      {showCancelInput && (
        <div className="border-t pt-3">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Cancellation Reason</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={2}
                placeholder="Provide reason for cancelling this day..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-error"
                onClick={handleCancelDay}
                disabled={!canEdit || !cancelReason.trim()}
              >
                Confirm Cancellation
              </button>
              <button
                className="btn btn-sm btn-ghost"
                onClick={handleUncancelDay}
                disabled={!canEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Announcement */}
      {isDayCancelled && (
        <div className="border-t pt-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-800">Day Cancelled</span>
            </div>
            <p className="text-sm text-red-700">
              This day has been cancelled and is no longer available for
              attendance recording.
            </p>
            {metaCancelReason && (
              <div className="mt-2 text-sm">
                <span className="font-medium text-red-800">Reason: </span>
                <span className="text-red-800">{metaCancelReason}</span>
              </div>
            )}
            {canEdit && (
              <button
                className="btn btn-sm btn-outline btn-error mt-2"
                onClick={handleUncancelDay}
              >
                Reactivate Day
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySettings;
