import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../utils/rolePermissions";

const AttendanceHeader = ({ 
  program, 
  sessions, 
  onEditEndDate, 
  onExport, 
  onSettings 
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const canUpdateTrainingPrograms = user?.permissions?.canUpdateTrainingPrograms;

  return (
    <>
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/training_data_overview">Programs</Link>
          </li>
          <li>{program.name}</li>
          <li className="font-semibold">Attendance</li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{program.name} • Attendance</h2>
          <p className="text-gray-500 text-sm">
            {program.startDate} – {program.endDate} • {sessions.length} days
          </p>
        </div>
        <div className="flex gap-2">
          {canUpdateTrainingPrograms && (
            <button
              className="btn btn-sm btn-outline"
              onClick={onEditEndDate}
            >
              Edit End Date
            </button>
          )}
          <button className="btn btn-sm btn-outline" onClick={onExport}>
            Export
          </button>
          <button className="btn btn-sm btn-outline" onClick={onSettings}>
            Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default AttendanceHeader;
