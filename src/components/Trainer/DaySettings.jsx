import React from "react";
import { useAuth } from "../../hooks/useAuth";

const DaySettings = ({
  dayStartTime,
  dayEndTime,
  dayStatus,
  isEditingTimes,
  isDayCompleted,
  isDayCancelled,
  metaCancelReason,
  metaCompletionReason,
  onOpenTimesModal,
  onOpenStatusModal,
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

  // Toggle handler: open corresponding modal; actual state updates after confirm
  const handleStatusToggle = (e) => {
    const goingToCancelled = e.target.checked;
    if (goingToCancelled) {
      onCancelDay && onCancelDay();
    } else {
      onUncancelDay && onUncancelDay();
    }
  };

  // Inline confirm flows removed; parent opens modals via handlers

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
              readOnly
              disabled
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
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Day Status</span>
            </label>
            <div className="join">
              <input
                className={`btn btn-sm join-item ${
                  dayStatus === "active" && !isDayCompleted
                    ? "btn-primary"
                    : "btn-outline"
                }`}
                type="radio"
                name="day-status"
                aria-label="Active"
                checked={dayStatus === "active" && !isDayCompleted}
                onChange={() => {
                  if (isDayCompleted) {
                    onReopenDay && onReopenDay();
                  } else if (dayStatus !== "active") {
                    onUncancelDay && onUncancelDay();
                  }
                }}
                disabled={!canEdit && !isDayCompleted}
              />
              <input
                className={`btn btn-sm join-item ${
                  dayStatus === "cancelled" && !isDayCompleted
                    ? "btn-error"
                    : "btn-outline"
                }`}
                type="radio"
                name="day-status"
                aria-label="Cancelled"
                checked={dayStatus === "cancelled" && !isDayCompleted}
                onChange={() => {
                  if (!isDayCompleted && dayStatus !== "cancelled") {
                    onCancelDay && onCancelDay();
                  }
                }}
                disabled={!canEdit || isDayCompleted}
              />
              <input
                className={`btn btn-sm join-item ${
                  isDayCompleted ? "btn-success" : "btn-outline"
                }`}
                type="radio"
                name="day-status"
                aria-label="Completed"
                checked={isDayCompleted}
                onChange={() => {
                  if (!isDayCompleted && !isDayCancelled) {
                    onMarkDayCompleted && onMarkDayCompleted();
                  }
                }}
                disabled={!canComplete || isDayCancelled}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button
              className="btn btn-sm btn-outline"
              onClick={onOpenTimesModal}
              disabled={isDayCompleted || isDayCancelled}
            >
              Adjust Times
            </button>
          )}

          {/* Mark Complete button removed; use the status control to complete */}
          {/* Reopen action removed here; use status control to reopen */}
        </div>
      </div>

      {/* Inline cancellation inputs removed in favor of modal */}

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
                onClick={onUncancelDay}
              >
                Reactivate Day
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion Announcement */}
      {isDayCompleted && (
        <div className="border-t pt-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-800">Day Completed</span>
            </div>
            <p className="text-sm text-green-700">
              This day has been marked as completed and is locked for further
              editing.
            </p>
            {metaCompletionReason && (
              <div className="mt-2 text-sm">
                <span className="font-medium text-green-800">Reason: </span>
                <span className="text-green-800">{metaCompletionReason}</span>
              </div>
            )}
            {canReopen && (
              <button
                className="btn btn-sm btn-outline btn-warning mt-2"
                onClick={onReopenDay}
              >
                Reopen Day
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySettings;
