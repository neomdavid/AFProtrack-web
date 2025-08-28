import React from "react";
import { useAuth } from "../../hooks/useAuth";

const EditEndDateModal = ({
  isOpen,
  onClose,
  newEndDate,
  deadlineReason,
  onEndDateChange,
  onReasonChange,
  onSave,
  currentEndDate
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canUpdateTrainingPrograms = user?.permissions?.canUpdateTrainingPrograms;

  // Admin restrictions: can view but not edit
  const canEdit = !isAdmin || canUpdateTrainingPrograms;

  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Program End Date</h3>
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Current End Date</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={currentEndDate}
              disabled
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">New End Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={newEndDate}
              onChange={onEndDateChange}
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Reason / Remarks</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Provide reason for changing end date"
              value={deadlineReason}
              onChange={onReasonChange}
              disabled={!canEdit}
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          {canEdit && (
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={!newEndDate}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default EditEndDateModal;
