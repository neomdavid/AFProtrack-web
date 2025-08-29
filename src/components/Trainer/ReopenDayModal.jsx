import React from "react";

const ReopenDayModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  if (!isOpen) return null;
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reopen Completed Day</h3>
        <p className="mt-2 text-sm text-gray-600">
          This will reopen the day for editing and attendance updates. Continue?
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-warning"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Reopening...
              </>
            ) : (
              "Yes, Reopen Day"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ReopenDayModal;
