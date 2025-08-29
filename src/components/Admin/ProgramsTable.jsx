import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddProgramModal from "./AddProgramModal";
import ProgramModal from "./ProgramModal";
import { PlusIcon } from "@phosphor-icons/react";

const ProgramsTable = ({ programs = [], onViewDetails }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [localPrograms, setLocalPrograms] = useState([
    {
      id: 1,
      name: "Advanced Combat Training",
      duration: "5 days",
      instructor: "Col. Santos",
      participants: "25",
      status: "Ongoing",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      time: "08:00",
      venue: "Training Ground A",
      additionalDetails:
        "Comprehensive combat training program for advanced personnel.",
    },
    {
      id: 2,
      name: "Leadership Development",
      duration: "1 week",
      instructor: "Maj. Rodriguez",
      participants: "15",
      status: "Scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      time: "09:00",
      venue: "Conference Hall B",
      additionalDetails: "Leadership skills development for senior officers.",
    },
    {
      id: 3,
      name: "Basic Training Course",
      duration: "12 weeks",
      instructor: "Sgt. Johnson",
      participants: "40",
      status: "Completed",
      startDate: "2023-10-01",
      endDate: "2023-12-20",
      time: "07:00",
      venue: "Training Center",
      additionalDetails: "Basic military training for new recruits.",
    },
  ]);

  // Use programs prop if provided, otherwise use local state
  const displayPrograms = programs; // Always use the programs prop, no fallback

  const handleAddProgram = (newProgram) => {
    const programWithId = {
      ...newProgram,
      id: Date.now(),
    };
    setLocalPrograms((prev) => [...prev, programWithId]);
    setShowAddModal(false);
  };

  const handleEditProgram = (updatedProgram) => {
    setLocalPrograms((prev) =>
      prev.map((program) =>
        program.id === selectedProgram.id
          ? { ...updatedProgram, id: program.id }
          : program
      )
    );
    setShowDetailsModal(false);
    setSelectedProgram(null);
  };

  const handleViewDetails = (program) => {
    if (onViewDetails) {
      onViewDetails(program);
    } else {
      setSelectedProgram(program);
      setShowDetailsModal(true);
    }
  };

  // Use the new permission system
  const canCreate = user?.permissions?.canCreateTrainingPrograms;
  const canEdit = user?.permissions?.canUpdateTrainingPrograms;
  const canDelete = user?.permissions?.canDeleteTrainingPrograms;

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Training Programs
        </h2>
        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-1.5 rounded-md text-xs sm:text-[14px] flex items-center gap-2 btn-hover"
          >
            <PlusIcon weight="bold" />
            Add New Program
          </button>
        )}
      </div>

      {/* Programs Table */}
      <div className="overflow-x-auto">
        {displayPrograms.length > 0 ? (
          <table className="table table-zebra w-full">
            <thead className="text-[13px] m:text-md">
              <tr>
                <th>Program</th>
                <th>Duration</th>
                <th>Instructor</th>
                <th className="text-center">Number of Participants</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] sm:text-md">
              {displayPrograms.map((program) => {
                const status = (program.status || "").toLowerCase();
                const statusLabel = status
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : "";
                const statusClass =
                  status === "upcoming"
                    ? "bg-warning text-warning-content border-warning-content"
                    : status === "available"
                    ? "bg-info text-info-content border-info-content"
                    : status === "ongoing"
                    ? "bg-primary text-white border-primary"
                    : status === "completed"
                    ? "bg-base-success text-success-content border-success-content"
                    : status === "cancelled"
                    ? "bg-red-100 text-red-800 border-red-300"
                    : "bg-gray-100 text-gray-800";

                return (
                  <tr key={program.id}>
                    <td className="font-medium">{program.name}</td>
                    <td className="">{program.duration}</td>
                    <td>{program.instructor}</td>
                    <td className="text-center">{program.participants}</td>
                    <td className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="flex justify-center items-center ">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(program)}
                          className="bg-primary  min-w-24.5 text-[12px] text-white py-1 px-3 rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
                        >
                          View Details
                        </button>
                        <a
                          href={`/admin/programs/${program.id}/attendance`}
                          className="btn btn-ghost btn-xs text-[12px]"
                          title="Open Attendance Page"
                        >
                          Attendance
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No programs found matching your criteria.</p>
            <p className="text-sm mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add Program Modal */}
      <AddProgramModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProgram}
        mode="add"
      />

      {/* Program Modal */}
      <ProgramModal
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
        onEdit={handleEditProgram}
      />
    </div>
  );
};

export default ProgramsTable;
