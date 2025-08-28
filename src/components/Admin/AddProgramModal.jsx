import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useCreateTrainingProgramMutation } from "../../features/api/adminEndpoints";

const AddProgramModal = ({
  open,
  onClose,
  onAdd,
  onEdit,
  mode = "add", // "add" or "edit"
  programData = null, // For edit mode
}) => {
  const { user } = useAuth();
  const [createProgram, { isLoading: isCreating }] =
    useCreateTrainingProgramMutation();

  const [formData, setFormData] = useState({
    programName: "",
    startDate: "",
    endDate: "",
    enrollmentStartDate: "",
    enrollmentEndDate: "",
    startTime: "",
    endTime: "",
    instructor: "",
    venue: "",
    maxParticipants: "",
    additionalDetails: "",
  });
  const [submitError, setSubmitError] = useState("");

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
    if (submitError) setSubmitError("");
  };

  // Function to determine status based on dates
  const getStatusFromDates = (startDate) => {
    if (!startDate) return "upcoming";
    const today = new Date();
    const start = new Date(startDate);
    if (start > today) return "upcoming";
    if (start <= today) return "ongoing";
    return "completed";
  };

  const sanitizeApiError = (responseBody) => {
    const rawMessage = (responseBody && responseBody.message) || "";
    const errorsArray = Array.isArray(responseBody?.errors)
      ? responseBody.errors
      : [];
    if (errorsArray.length) return errorsArray.join("\n");
    const cleaned = rawMessage.replace(/validation failed[:]?/i, "").trim();
    return cleaned || "Request failed. Please review your inputs.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.programName &&
      formData.startDate &&
      formData.endDate &&
      formData.enrollmentStartDate &&
      formData.enrollmentEndDate &&
      formData.startTime &&
      formData.endTime &&
      formData.instructor &&
      formData.venue &&
      formData.maxParticipants
    ) {
      const requestBody = {
        programName: formData.programName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrollmentStartDate: formData.enrollmentStartDate,
        enrollmentEndDate: formData.enrollmentEndDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        instructor: formData.instructor,
        venue: formData.venue,
        maxParticipants: parseInt(formData.maxParticipants),
        additionalDetails: formData.additionalDetails || "",
        status: getStatusFromDates(formData.startDate),
        createdBy: user?.id || "",
      };

      try {
        if (mode === "edit") {
          onEdit(requestBody);
          toast.success("Program updated successfully");
        } else {
          // Use RTK Query mutation
          const created = await createProgram(requestBody).unwrap();
          onAdd(created);
          toast.success("Training program created successfully");
          handleCancel();
        }
      } catch (err) {
        const data = err?.data || err; // RTKQ error shape
        const friendly = sanitizeApiError(data);
        setSubmitError(friendly);
        if (Array.isArray(data?.errors) && data.errors.length) {
          data.errors.forEach((msg) => {
            const m = (msg || "").toString().trim();
            if (m) toast.error(m);
          });
        } else {
          toast.error(friendly);
        }
        // eslint-disable-next-line no-console
        console.error("Create program failed:", data);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      programName: "",
      startDate: "",
      endDate: "",
      enrollmentStartDate: "",
      enrollmentEndDate: "",
      startTime: "",
      endTime: "",
      instructor: "",
      venue: "",
      maxParticipants: "",
      additionalDetails: "",
    });
    setSubmitError("");
    onClose();
  };

  // All fields are editable for training staff
  const isFieldEditable = () => true;

  if (!open) return null;

  const modalTitle =
    mode === "edit" ? "Edit Training Program" : "Add New Training Program";
  const submitButtonText = mode === "edit" ? "Update Program" : "Add Program";

  return (
    <dialog open={open} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-2xl relative bg-white p-0 overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
          {/* X Close Button*/}
          <form method="dialog" className="absolute top-6 right-6">
            <button
              className="btn btn-xs sm:btn-sm btn-circle btn-ghost"
              onClick={onClose}
            >
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

          <h3 className="font-bold text-lg sm:text-2xl text-black pr-16">
            {modalTitle}
          </h3>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-md">
              {/* Program Name*/}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Training Program Name*
                  </span>
                </label>
                <input
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  placeholder="Enter program name"
                  className="input input-bordered w-full"
                  required
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
                  className="input input-bordered w-full"
                  required
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
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Enrollment Start Date*/}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Enrollment Start Date*
                  </span>
                </label>
                <input
                  type="date"
                  name="enrollmentStartDate"
                  value={formData.enrollmentStartDate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Enrollment End Date*/}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Enrollment End Date*
                  </span>
                </label>
                <input
                  type="date"
                  name="enrollmentEndDate"
                  value={formData.enrollmentEndDate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Time*/}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Start Time*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* End Time*/}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">End Time*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
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
                  className="input input-bordered w-full"
                  required
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
                  className="input input-bordered w-full"
                  required
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
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="Enter max participants"
                  min="1"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* Additional Details*/}
            <div className="text-sm sm:text-md">
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
                className="textarea textarea-bordered w-full h-24"
              />
            </div>

            {/* Action Buttons*/}
            <div className="flex justify-end gap-2 sm:gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline btn-sm sm:btn-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md"
              >
                {submitButtonText}
              </button>
            </div>

            {submitError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <ul className="list-disc pl-5 text-sm text-red-700">
                  {submitError
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AddProgramModal;
