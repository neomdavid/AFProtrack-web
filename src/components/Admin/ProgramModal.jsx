import React, { useMemo, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("details");

  // --- Attendance state ---
  const STATUS = [
    { value: "present", label: "Present", color: "text-green-600" },
    { value: "late", label: "Late", color: "text-amber-600" },
    { value: "excused", label: "Excused", color: "text-blue-600" },
    { value: "absent", label: "Absent", color: "text-red-600" },
  ];

  const toDate = (str) => (str ? new Date(str) : null);
  const formatDayLabel = (d) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formatYMD = (d) => d.toISOString().slice(0, 10);
  const getDateRange = (start, end) => {
    if (!start || !end) return [];
    const days = [];
    const cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const sessions = useMemo(
    () => getDateRange(toDate(program?.startDate), toDate(program?.endDate)),
    [program]
  );

  const today = new Date();
  const defaultSelected = useMemo(() => {
    if (!sessions.length) return null;
    const inRange = today >= sessions[0] && today <= sessions[sessions.length - 1];
    return inRange ? today : sessions[0];
  }, [sessions]);
  const [selectedDate, setSelectedDate] = useState(defaultSelected);

  // Attendance map: { [dateYMD]: { [traineeKey]: { status, timeIn, timeOut, note } } }
  const [attendance, setAttendance] = useState({});

  const selectedKey = selectedDate ? formatYMD(selectedDate) : null;
  const dayAttendance = attendance[selectedKey] || {};

  const updateAttendance = (traineeKey, patch) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedKey]: {
        ...(prev[selectedKey] || {}),
        [traineeKey]: { ...(prev[selectedKey]?.[traineeKey] || {}), ...patch },
      },
    }));
  };

  const bulkSetStatus = (value) => {
    const next = { ...(attendance[selectedKey] || {}) };
    sampleTrainees.forEach((t) => {
      const key = t.email || t.name;
      next[key] = { ...(next[key] || {}), status: value };
    });
    setAttendance((prev) => ({ ...prev, [selectedKey]: next }));
  };

  const daySummary = useMemo(() => {
    const counts = { present: 0, late: 0, excused: 0, absent: 0 };
    sampleTrainees.forEach((t) => {
      const key = t.email || t.name;
      const s = dayAttendance[key]?.status;
      if (s && counts[s] !== undefined) counts[s] += 1;
    });
    return counts;
  }, [dayAttendance]);

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

        {/* Header with Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-2xl mb-1">
              {activeTab === "details"
                ? isEditing
                  ? "Edit Program Details"
                  : program.name
                : `${program.name} • Attendance`}
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
          <div className="flex items-center gap-2">
            <div className="join hidden sm:inline-flex">
              <button
                className={`join-item btn btn-sm ${
                  activeTab === "details" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`join-item btn btn-sm ${
                  activeTab === "attendance" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setActiveTab("attendance")}
              >
                Attendance
              </button>
            </div>
            {activeTab === "details" && !isEditing && (isAdmin || isTrainingStaff) && (
              <button onClick={handleEditClick} className="btn btn-primary btn-sm">
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
        {activeTab === "details" && isEditing && (
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

        {activeTab === "details" && (
          <>
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
          </>
        )}

        {activeTab === "attendance" && (
          <div className="flex flex-col gap-4">
            {/* Date Navigator */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {program?.startDate} – {program?.endDate} • {sessions.length} days
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-2 py-1">
                {sessions.map((d) => {
                  const isActive = selectedKey === formatYMD(d);
                  const isToday = formatYMD(d) === formatYMD(today);
                  return (
                    <button
                      key={formatYMD(d)}
                      onClick={() => setSelectedDate(d)}
                      className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${
                        isActive
                          ? "border-primary text-primary bg-primary/10"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                      title={d.toDateString()}
                    >
                      {formatDayLabel(d)}{isToday ? " • Today" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded border border-gray-200 bg-green-50">
                <div className="text-xs text-gray-500">Present</div>
                <div className="text-lg font-semibold text-green-700">{daySummary.present}</div>
              </div>
              <div className="p-2 rounded border border-gray-200 bg-amber-50">
                <div className="text-xs text-gray-500">Late</div>
                <div className="text-lg font-semibold text-amber-700">{daySummary.late}</div>
              </div>
              <div className="p-2 rounded border border-gray-200 bg-blue-50">
                <div className="text-xs text-gray-500">Excused</div>
                <div className="text-lg font-semibold text-blue-700">{daySummary.excused}</div>
              </div>
              <div className="p-2 rounded border border-gray-200 bg-red-50">
                <div className="text-xs text-gray-500">Absent</div>
                <div className="text-lg font-semibold text-red-700">{daySummary.absent}</div>
              </div>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 self-center">Quick mark:</span>
              {STATUS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => bulkSetStatus(s.value)}
                  className="btn btn-xs btn-outline"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Attendance table */}
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Trainee</th>
                    <th>Status</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleTrainees.map((t) => {
                    const key = t.email || t.name;
                    const rec = dayAttendance[key] || {};
                    return (
                      <tr key={key}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                              {getInitials(t.name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{t.name}</span>
                              <span className="text-xs text-gray-500">{t.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                            className="select select-bordered select-sm"
                            value={rec.status || ""}
                            onChange={(e) => updateAttendance(key, { status: e.target.value })}
                          >
                            <option value="">Select</option>
                            {STATUS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="time"
                            className="input input-bordered input-sm"
                            value={rec.timeIn || ""}
                            onChange={(e) => updateAttendance(key, { timeIn: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="input input-bordered input-sm"
                            value={rec.timeOut || ""}
                            onChange={(e) => updateAttendance(key, { timeOut: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="input input-bordered input-sm w-64"
                            placeholder="Add note"
                            value={rec.note || ""}
                            onChange={(e) => updateAttendance(key, { note: e.target.value })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Save row */}
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => console.log("discard day changes")}>Discard</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  // Mock bulk save payload for selected day
                  const payload = sampleTrainees.map((t) => {
                    const key = t.email || t.name;
                    const rec = (attendance[selectedKey] || {})[key] || {};
                    return {
                      enrollmentId: key, // replace with real id
                      sessionDate: selectedKey,
                      status: rec.status || null,
                      timeIn: rec.timeIn || null,
                      timeOut: rec.timeOut || null,
                      note: rec.note || null,
                    };
                  });
                  console.log("Saving attendance:", payload);
                }}
              >
                Save Attendance
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default ProgramModal;
