import React from "react";
import { formatDateShort } from "../../utils";
import { useGetTraineeRecordsQuery } from "../../features/api/adminEndpoints";
import LoadingSpinner from "../LoadingSpinner";

const PersonnelModal = ({ person, isOpen, onClose }) => {
  // Fetch trainee records if person is selected
  const {
    data: traineeData,
    isLoading,
    error
  } = useGetTraineeRecordsQuery(person?.id, {
    skip: !person?.id || !isOpen
  });

  const handleExport = () => {
    // Mock export functionality
    alert("Exporting training records...");
  };

  if (!person) return null;

  // Get trainee info and records from API
  const trainee = traineeData?.trainee;
  const records = traineeData?.records || [];
  const statistics = traineeData?.statistics || {};

  return (
    <dialog id="person_modal" className="modal z-[10000]" open={isOpen}>
      <div className="modal-box w-11/12 max-w-4xl relative bg-white max-h-[90vh]">
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

        <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-3 sm:gap-6 mb-5 sm:mb-6">
          {person.profilePhoto?.cloudinaryUrl ? (
            <img 
              src={person.profilePhoto.cloudinaryUrl} 
              alt={person.name}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 text-center sm:text-left bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {person.avatar}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-xl sm:text-2xl text-black mb-0.5">
              {person.name}
            </h3>
            <p className="text-gray-600 mb-1">{person.rank}</p>
            <p className="text-sm text-gray-500 mb-1">
              {person.serviceId}
            </p>
            <p className="text-sm text-gray-500">{person.email}</p>
            {person.unit && (
              <p className="text-sm text-gray-500">{person.unit}</p>
            )}
            {person.branchOfService && (
              <p className="text-sm text-gray-500">{person.branchOfService}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-md sm:text-lg text-gray-700 ">
              Training Records
            </h4>
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

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              Failed to load training records
            </div>
          ) : records.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No training records found for this trainee
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra text-sm sm:text-md w-full text-black">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Program</th>
                    <th>Instructor</th>
                    <th>Grade</th>
                    <th>Attendance</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="font-medium">
                        {formatDateShort(record.date)}
                      </td>
                      <td>{record.program}</td>
                      <td>{record.instructor}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            record.grade?.startsWith("A")
                              ? "bg-success"
                              : record.grade?.startsWith("B")
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {record.grade || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-base-300 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (record.attendance || 0) >= 95
                                  ? "bg-success-content"
                                  : (record.attendance || 0) >= 85
                                  ? "bg-primary"
                                  : (record.attendance || 0) >= 75
                                  ? "bg-warning"
                                  : "bg-error"
                              }`}
                              style={{ width: `${record.attendance || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {record.attendance || 0}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-base-300 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (record.progress || 0) >= 90
                                  ? "bg-success-content"
                                  : (record.progress || 0) >= 80
                                  ? "bg-primary"
                                  : (record.progress || 0) >= 70
                                  ? "bg-warning"
                                  : "bg-error"
                              }`}
                              style={{ width: `${record.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {record.progress || 0}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-4 mt-6 p-4 bg-base-200 rounded-lg">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {statistics.totalPrograms || 0}
              </p>
              <p className="text-sm text-gray-600">Total Programs</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-success-content">
                {statistics.completedPrograms || 0}
              </p>
              <p className="text-sm text-gray-600">Completed Programs</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {statistics.attendanceRate || 0}%
              </p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-success-content">
                {statistics.averageProgress || 0}%
              </p>
              <p className="text-sm text-gray-600">Average Progress</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default PersonnelModal;
