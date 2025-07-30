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

  // Mock training records data
  const getTrainingRecords = (personId) => [
    {
      id: 1,
      date: "2025-01-15",
      program: "Advanced Combat Training",
      instructor: "Col. Maria Santos",
      grade: "A+",
      attendance: 100,
      progress: 95,
    },
    {
      id: 2,
      date: "2025-01-10",
      program: "Leadership Development",
      instructor: "Maj. Juan Dela Cruz",
      grade: "A",
      attendance: 95,
      progress: 88,
    },
    {
      id: 3,
      date: "2025-01-05",
      program: "Strategic Planning",
      instructor: "Lt. Col. Ana Reyes",
      grade: "A-",
      attendance: 100,
      progress: 92,
    },
    {
      id: 4,
      date: "2024-12-20",
      program: "Tactical Operations",
      instructor: "Capt. Pedro Martinez",
      grade: "B+",
      attendance: 90,
      progress: 85,
    },
    {
      id: 5,
      date: "2024-12-15",
      program: "Communication Skills",
      instructor: "Lt. Carmen Lopez",
      grade: "A",
      attendance: 100,
      progress: 90,
    },
  ];

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
              <th>Email</th>
              <th>Rank</th>
              <th>Trainings Attended</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person) => (
              <tr key={person.id}>
                <td>
                  <div className="flex justify-center items-center">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {person.avatar}
                    </div>
                  </div>
                </td>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.rank}</td>
                <td>{person.trainingsAttended}</td>
                <td className="flex justify-center items-center">
                  <button
                    className="w-full bg-primary text-[12px] text-white py-1 rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
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
