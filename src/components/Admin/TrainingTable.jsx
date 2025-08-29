import React, { useState } from "react";
import PersonnelModal from "./PersonnelModal";

const PersonnelTable = ({ data }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  const handleExport = () => {
    // Mock export functionality
    alert("Exporting training records...");
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table text-black">
          <thead className="text-gray-800/90 text-[14px] font-semibold">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Service ID</th>
              <th>Email</th>
              <th>Rank</th>
              <th>Unit</th>
              <th className="text-center">Trainings Attended</th>
              <th className="text-center">Total Enrollments</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person) => (
              <tr key={person.id}>
                <td>
                  <div className="flex justify-center items-center">
                    {person.profilePhoto?.cloudinaryUrl ? (
                      <img 
                        src={person.profilePhoto.cloudinaryUrl} 
                        alt={person.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {person.avatar}
                      </div>
                    )}
                  </div>
                </td>
                <td className="font-medium">{person.name}</td>
                <td className="font-mono text-sm">{person.serviceId}</td>
                <td>{person.email}</td>
                <td>{person.rank}</td>
                <td className="max-w-xs truncate" title={person.unit}>
                  {person.unit}
                </td>
                <td className="text-center">{person.trainingsAttended}</td>
                <td className="text-center">{person.totalEnrollments}</td>
                <td className="flex justify-center items-center">
                  <button
                    className=" bg-primary  min-w-24.5 text-[12px] text-white py-1 px-3 rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
                    onClick={() => handleViewDetails(person)}
                  >
                    View Details
                  </button>
                </td>
              </tr> 
            ))}
          </tbody>
        </table>
      </div>

      {/* Personnel Modal */}
      <PersonnelModal
        person={selectedPerson}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PersonnelTable;
