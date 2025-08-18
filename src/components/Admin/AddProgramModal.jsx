import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { canEditField, ROLES } from "../../utils/rolePermissions";

const AddProgramModal = ({
  open,
  onClose,
  onAdd,
  onEdit,
  mode = "add", // "add" or "edit"
  programData = null, // For edit mode
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const isTrainingStaff = user?.role === ROLES.TRAINING_STAFF;

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    time: "",
    instructor: "",
    venue: "",
    participants: "",
    additionalDetails: "",
  });

  // Load program data when in edit mode
  useEffect(() => {
    if (mode === "edit" && programData) {
      setFormData(programData);
    }
  }, [mode, programData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.startDate &&
      formData.endDate &&
      formData.instructor &&
      formData.time &&
      formData.venue
    ) {
      if (mode === "edit") {
        onEdit(formData);
      } else {
        onAdd(formData);
      }
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        time: "",
        instructor: "",
        venue: "",
        participants: "",
        additionalDetails: "",
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      time: "",
      instructor: "",
      venue: "",
      participants: "",
      additionalDetails: "",
    });
    onClose();
  };

  // Determine if field is editable based on role
  const isFieldEditable = (fieldName) => {
    return canEditField(user?.role, fieldName);
  };

  if (!open) return null;

  const modalTitle =
    mode === "edit" ? "Edit Training Program" : "Add New Training Program";
  const submitButtonText = mode === "edit" ? "Update Program" : "Add Program";

  return (
    <dialog open={open} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-2xl relative bg-white p-8">
        {/* X Close Button*/}
        <form method="dialog" className="absolute top-4 right-4">
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-6 text-black">{modalTitle}</h3>

        {/* Role-based notice */}
        {mode === "edit" && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {isAdmin
                ? "You have full editing permissions as an administrator."
                : isTrainingStaff
                ? "As training staff, you can only edit instructor, venue, time, and additional details."
                : "You have limited editing permissions."}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Program Name*/}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Training Program Name*
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter program name"
                className={`input input-bordered w-full ${
                  !isFieldEditable("name")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("name")}
              />
            </div>

            {/* Start Date*/}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Start Date*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${
                  !isFieldEditable("startDate")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("startDate")}
              />
            </div>

            {/* End Date*/}
            <div>
              <label className="label">
                <span className="label-text font-semibold">End Date*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${
                  !isFieldEditable("endDate")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("endDate")}
              />
            </div>

            {/* Time*/}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Time*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`input input-bordered w-full ${
                  !isFieldEditable("time")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("time")}
              />
            </div>

            {/* Instructor*/}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Instructor*</span>
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                placeholder="Enter instructor name"
                className={`input input-bordered w-full ${
                  !isFieldEditable("instructor")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("instructor")}
              />
            </div>

            {/* Venue*/}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Venue*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="Enter venue"
                className={`input input-bordered w-full ${
                  !isFieldEditable("venue")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("venue")}
              />
            </div>

            {/* Number of Participants*/}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Number of Participants*
                </span>
              </label>
              <input
                type="number"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="Enter max participants"
                min="1"
                className={`input input-bordered w-full ${
                  !isFieldEditable("participants")
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                required
                disabled={!isFieldEditable("participants")}
              />
            </div>
          </div>

          {/* Additional Details*/}
          <div>
            <label className="label">
              <span className="label-text font-semibold">
                Additional Details (Optional)
              </span>
            </label>
            <textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              placeholder="Enter any additional details about the program"
              className={`textarea textarea-bordered w-full h-24 ${
                !isFieldEditable("additionalDetails")
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
              disabled={!isFieldEditable("additionalDetails")}
            />
          </div>

          {/* Action Buttons*/}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            {(isAdmin || isTrainingStaff) && (
              <button type="submit" className="btn btn-primary">
                {submitButtonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddProgramModal;
