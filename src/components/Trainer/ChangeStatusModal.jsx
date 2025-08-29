import React, { useState, useEffect } from "react";

const ChangeStatusModal = ({ isOpen, onClose, currentStatus, onSave }) => {
  const [status, setStatus] = useState(currentStatus || "active");

  useEffect(() => {
    if (isOpen) setStatus(currentStatus || "active");
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Change Day Status</h3>
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="cancelled" disabled>
              Cancel here is disabled (use Cancel flow)
            </option>
          </select>
          <p className="text-xs mt-2 text-gray-500">
            To cancel a day, use the Cancel flow to provide a reason.
          </p>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => onSave(status)}>
            Save Status
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ChangeStatusModal;
