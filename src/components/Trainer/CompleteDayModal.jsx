import React from "react";
import { useAuth } from "../../hooks/useAuth";

const CompleteDayModal = ({
  isOpen,
  onClose,
  completeReason,
  onReasonChange,
  onConfirm,
  selectedDate,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canMarkDayCompleted = user?.permissions?.canMarkDayCompleted;

  // Admin restrictions: can view but not complete
  const canComplete = !isAdmin || canMarkDayCompleted;

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Mark Day as Completed</h3>
        <p className="text-sm text-gray-600 mb-4">{selectedDate}</p>
        <label className="label">
          <span className="label-text">Reason / Remarks</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          placeholder="Provide reason for completion"
          value={completeReason}
          onChange={onReasonChange}
          disabled={!canComplete}
        />
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          {canComplete && (
            <button
              className="btn btn-primary"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Completing...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default CompleteDayModal;
