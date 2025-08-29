import React from "react";

const ReactivateDayModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Reactivate Cancelled Day</h3>
        <p className="mt-2 text-sm text-gray-600">
          This will reactivate the day and allow attendance updates. Continue?
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ReactivateDayModal;
