import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { canPerformAction, ROLES } from "../../utils/rolePermissions";
import AddProgramModal from "./AddProgramModal";
import ProgramModal from "./ProgramModal";
import { PlusIcon } from "@phosphor-icons/react";

const ProgramsTable = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: "Advanced Combat Training",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      time: "08:00",
      instructor: "Col. Santos",
      venue: "Training Ground A",
      participants: "25",
      additionalDetails: "Comprehensive combat training program for advanced personnel."
    },
    {
      id: 2,
      name: "Leadership Development",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      time: "09:00",
      instructor: "Maj. Rodriguez",
      venue: "Conference Hall B",
      participants: "15",
      additionalDetails: "Leadership skills development for senior officers."
    }
  ]);

  const handleAddProgram = (newProgram) => {
    const programWithId = {
      ...newProgram,
      id: Date.now()
    };
    setPrograms(prev => [...prev, programWithId]);
    setShowAddModal(false);
  };

  const handleEditProgram = (updatedProgram) => {
    setPrograms(prev => 
      prev.map(program => 
        program.id === selectedProgram.id ? { ...updatedProgram, id: program.id } : program
      )
    );
    setShowDetailsModal(false);
    setSelectedProgram(null);
  };

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setShowDetailsModal(true);
  };

  const canCreate = canPerformAction(user?.role, 'create_program');
  const canEdit = canPerformAction(user?.role, 'edit_program');
  const canDelete = canPerformAction(user?.role, 'delete_program');

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Training Programs</h2>
        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-1.5 rounded-md  text-[14px] flex items-center gap-2 btn-hover"
          >
           <PlusIcon size={16}  weight="bold"/>
            Add New Program
          </button>
        )}
      </div>

      {/* Programs Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Instructor</th>
              <th>Date Range</th>
              <th>Venue</th>
              <th className="text-center">Participants</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="font-medium">{program.name}</td>
                <td>{program.instructor}</td>
                <td>
                  {program.startDate} - {program.endDate}
                </td>
                <td>{program.venue}</td>
                <td className="text-center">{program.participants}</td>
                <td className="flex justify-center items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(program)}
                      className="bg-primary  min-w-24.5 text-[12px] text-white py-1 px-3 rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
                    >
                      View Details
                    </button>
                    {/* {canEdit && (
                      <button
                        onClick={() => {
                          setSelectedProgram(program);
                          setShowDetailsModal(true);
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this program?')) {
                            setPrograms(prev => prev.filter(p => p.id !== program.id));
                          }
                        }}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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