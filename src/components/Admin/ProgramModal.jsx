import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/rolePermissions";
import { useGetTrainingProgramByIdQuery } from "../../features/api/adminEndpoints";

const sampleTrainees = [
  {
    name: "John Doe",
    email: "john.doe@email.com",
    rank: "Private",
    grade: "A",
    attendance: 95,
    progress: 80,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@email.com",
    rank: "Corporal",
    grade: "B+",
    attendance: 88,
    progress: 70,
  },
];

const handleExport = () => {
  // Mock export functionality
  alert("Exporting training records...");
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const ProgramModal = ({ open, onClose, program, onEdit }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const isTrainingStaff = user?.role === ROLES.TRAINING_STAFF;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(program || {});

  // Fetch complete program details when modal opens
  const { data: completeProgram, isLoading } = useGetTrainingProgramByIdQuery(
    program?.id,
    {
      skip: !open || !program?.id,
    }
  );

  // Use complete program data if available, otherwise fall back to basic program data
  const programData = completeProgram || program;

  // Update editData when complete program data is fetched
  useEffect(() => {
    if (completeProgram && !isEditing) {
      setEditData(completeProgram);
    }
  }, [completeProgram, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData(programData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(programData);
  };

  const handleSaveEdit = () => {
    onEdit(editData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Determine if field is editable based on permissions
  const isFieldEditable = (fieldName) => {
    return user?.permissions?.canUpdateTrainingPrograms || false;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date range for display
  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return "N/A";
    if (startDate && !endDate) return formatDate(startDate);
    if (!startDate && endDate) return formatDate(endDate);
    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
  };

  // Format time range for display
  const formatTimeRange = (startTime, endTime) => {
    if (!startTime && !endTime) return "N/A";
    if (startTime && !endTime) return formatTime(startTime);
    if (!startTime && endTime) return formatTime(endTime);
    return `${formatTime(startTime)} to ${formatTime(endTime)}`;
  };

  if (!open || !program) return null;

  // Show loading state while fetching complete program data
  if (isLoading && !completeProgram) {
    return (
      <dialog open={open} className="modal z-[10000]">
        <div className="modal-box w-11/12 max-w-4xl relative bg-white p-8">
          <div className="flex justify-center items-center h-32">
            <div className="loading loading-spinner loading-lg"></div>
            <span className="ml-4 text-lg">Loading program details...</span>
          </div>
        </div>
      </dialog>
    );
  }

  return (
    <dialog open={open} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-4xl relative bg-white p-8">
        {/* X Close Button in form */}
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

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="font-bold text-2xl mb-6">
              {isEditing
                ? "Edit Program Details"
                : programData.programName || programData.name}
            </h3>

            {/* Program Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[100px]">
                    Batch:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="batch"
                      value={editData.batch || ""}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm flex-1 ml-3"
                      disabled={!isFieldEditable("batch")}
                    />
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {programData.batch || "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[100px]">
                    Instructor:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="instructor"
                      value={editData.instructor || ""}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm flex-1 ml-3"
                      disabled={!isFieldEditable("instructor")}
                    />
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {programData.instructor}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[100px]">
                    Venue:
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="venue"
                      value={editData.venue || ""}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm flex-1 ml-3"
                      disabled={!isFieldEditable("venue")}
                    />
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {programData.venue || "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[100px]">
                    Status:
                  </span>
                  {isEditing ? (
                    <select
                      name="status"
                      value={editData.status || ""}
                      onChange={handleInputChange}
                      className="select select-bordered select-sm flex-1 ml-3"
                      disabled={!isFieldEditable("status")}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className="ml-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          programData.status === "upcoming"
                            ? "bg-warning text-warning-content border-warning-content"
                            : programData.status === "ongoing"
                            ? "bg-primary text-white border-primary"
                            : programData.status === "completed"
                            ? "bg-success text-success-content border-success-content"
                            : programData.status === "cancelled"
                            ? "bg-error text-error-content border-error-content"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }`}
                      >
                        {programData.status
                          ? programData.status.charAt(0).toUpperCase() +
                            programData.status.slice(1)
                          : "Not specified"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[140px]">
                    Max Participants:
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      name="maxParticipants"
                      value={editData.maxParticipants || ""}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm flex-1 ml-3"
                      disabled={!isFieldEditable("maxParticipants")}
                    />
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {programData.maxParticipants || "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[140px]">
                    Enrollment Period:
                  </span>
                  {isEditing ? (
                    <div className="flex gap-2 flex-1 ml-3">
                      <input
                        type="date"
                        name="enrollmentStartDate"
                        value={
                          editData.enrollmentStartDate
                            ? editData.enrollmentStartDate.split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        className="input input-bordered input-sm flex-1"
                        disabled={!isFieldEditable("enrollmentStartDate")}
                      />
                      <span className="text-gray-400 self-center">to</span>
                      <input
                        type="date"
                        name="enrollmentEndDate"
                        value={
                          editData.enrollmentEndDate
                            ? editData.enrollmentEndDate.split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        className="input input-bordered input-sm flex-1"
                        disabled={!isFieldEditable("enrollmentEndDate")}
                      />
                    </div>
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {formatDateRange(
                        programData.enrollmentStartDate,
                        programData.enrollmentEndDate
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[140px]">
                    Time:
                  </span>
                  {isEditing ? (
                    <div className="flex gap-2 flex-1 ml-3">
                      <input
                        type="time"
                        name="startTime"
                        value={editData.startTime || ""}
                        onChange={handleInputChange}
                        className="input input-bordered input-sm flex-1"
                        disabled={!isFieldEditable("startTime")}
                      />
                      <span className="text-gray-400 self-center">to</span>
                      <input
                        type="time"
                        name="endTime"
                        value={editData.endTime || ""}
                        onChange={handleInputChange}
                        className="input input-bordered input-sm flex-1"
                        disabled={!isFieldEditable("endTime")}
                      />
                    </div>
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {formatTimeRange(
                        programData.startTime,
                        programData.endTime
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray min-w-[140px]">
                    Program Dates:
                  </span>
                  {isEditing ? (
                    <div className="flex gap-2 flex-1 ml-3">
                      <input
                        type="date"
                        name="startDate"
                        value={
                          editData.startDate
                            ? editData.startDate.split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                        className="input input-bordered input-sm flex-1"
                        disabled={!isFieldEditable("startDate")}
                      />
                      <span className="text-gray-400 self-center">to</span>
                      <input
                        type="date"
                        name="endDate"
                        value={
                          editData.endDate ? editData.endDate.split("T")[0] : ""
                        }
                        onChange={handleInputChange}
                        className="input input-bordered input-sm flex-1"
                        disabled={!isFieldEditable("endDate")}
                      />
                    </div>
                  ) : (
                    <span className="ml-3 text-gray-800">
                      {formatDateRange(
                        programData.startDate,
                        programData.endDate
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            {!isEditing && user?.permissions?.canUpdateTrainingPrograms && (
              <button
                onClick={handleEditClick}
                className="btn btn-primary btn-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Details
              </button>
            )}
          </div>
        </div>

        {/* Permission-based notice when editing */}
        {isEditing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {user?.permissions?.canUpdateTrainingPrograms
                ? isAdmin
                  ? "You have full editing permissions as an administrator."
                  : "You have editing permissions for this training program."
                : "You have limited editing permissions."}
            </p>
          </div>
        )}

        {/* Program Details Section */}
        {isEditing && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-4">Program Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Program Name</span>
                </label>
                <input
                  type="text"
                  name="programName"
                  value={editData.programName || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    !isFieldEditable("programName")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFieldEditable("programName")}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Instructor</span>
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={editData.instructor || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    !isFieldEditable("instructor")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFieldEditable("instructor")}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Venue</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={editData.venue || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    !isFieldEditable("venue")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFieldEditable("venue")}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Start Time</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={editData.startTime || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    !isFieldEditable("startTime")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFieldEditable("startTime")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Trainees Table Header Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg text-gray">
            List of Trainees
          </span>
          <div className="flex gap-2">
            {isEditing && (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-sm btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn btn-sm btn-primary"
                >
                  Save Changes
                </button>
              </>
            )}
            <button onClick={handleExport} className="btn btn-sm btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Records
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Rank</th>
                <th>Grade</th>
                <th>Attendance %</th>
                <th>Progress %</th>
              </tr>
            </thead>
            <tbody>
              {sampleTrainees.map((t, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {getInitials(t.name)}
                    </div>
                  </td>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.rank}</td>
                  <td>{t.grade}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <progress
                        className="progress text-success-content w-24"
                        value={t.attendance}
                        max="100"
                      ></progress>
                      <span>{t.attendance}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <progress
                        className="progress text-success-content w-24"
                        value={t.progress}
                        max="100"
                      ></progress>
                      <span>{t.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </dialog>
  );
};

export default ProgramModal;
