import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canEditField, ROLES } from "../../utils/rolePermissions";

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

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData(program);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(program);
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

  // Determine if field is editable based on role
  const isFieldEditable = (fieldName) => {
    return canEditField(user?.role, fieldName);
  };

  if (!open || !program) return null;

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

        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-2xl mb-1">
              {isEditing ? "Edit Program Details" : program.name}
            </h3>
            <div className="flex flex-col gap-1 text-gray">
              <p>
                <span className="font-semibold">Program ID:</span> {program.id}
              </p>
              <p>
                <span className="font-semibold">Instructor:</span>{" "}
                {program.instructor}
              </p>
            </div>
          </div>
          {!isEditing && (isAdmin || isTrainingStaff) && (
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

        {/* Role-based notice when editing */}
        {isEditing && (
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
                  name="name"
                  value={editData.name || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    !isFieldEditable("name")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFieldEditable("name")}
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
                  <span className="label-text font-semibold">Time</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={editData.time || ""}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    !isFieldEditable("time")
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!isFieldEditable("time")}
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
