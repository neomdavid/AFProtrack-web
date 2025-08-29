import React, { useState, useEffect } from "react";

const EditTimesModal = ({ isOpen, onClose, startTime, endTime, onSave }) => {
  const [localStart, setLocalStart] = useState(startTime || "");
  const [localEnd, setLocalEnd] = useState(endTime || "");

  useEffect(() => {
    if (isOpen) {
      setLocalStart(startTime || "");
      setLocalEnd(endTime || "");
    }
  }, [isOpen, startTime, endTime]);

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Adjust Day Times</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Start Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={localStart}
              onChange={(e) => setLocalStart(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">End Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={localEnd}
              onChange={(e) => setLocalEnd(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave({ startTime: localStart, endTime: localEnd })}
            disabled={!localStart || !localEnd}
          >
            Save Times
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EditTimesModal;
