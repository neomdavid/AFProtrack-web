import React, { useState, useEffect } from "react";

const CancelDayModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cancel Day</h3>
        <p className="mt-2 text-sm text-gray-600">
          Please provide a reason for cancelling this day.
        </p>
        <div className="mt-3">
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Reason for cancellation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-error"
            onClick={() => onConfirm(reason.trim())}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Cancelling...
              </>
            ) : (
              "Confirm Cancel"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CancelDayModal;
