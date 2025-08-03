import React from "react";

const PersonnelModal = ({ person, isOpen, onClose }) => {
  // Mock training records data
  const getTrainingRecords = (personId) => [
    {
      id: 1,
      date: "2025-01-15",
      program: "Advanced Combat Training",
      instructor: "Col. Maria Santos",
      grade: "A+",
      attendance: 100,
      progress: 95
    },
    {
      id: 2,
      date: "2025-01-10",
      program: "Leadership Development",
      instructor: "Maj. Juan Dela Cruz",
      grade: "A",
      attendance: 95,
      progress: 88
    },
    {
      id: 3,
      date: "2025-01-05",
      program: "Strategic Planning",
      instructor: "Lt. Col. Ana Reyes",
      grade: "A-",
      attendance: 100,
      progress: 92
    },
    {
      id: 4,
      date: "2024-12-20",
      program: "Tactical Operations",
      instructor: "Capt. Pedro Martinez",
      grade: "B+",
      attendance: 90,
      progress: 85
    },
    {
      id: 5,
      date: "2024-12-15",
      program: "Communication Skills",
      instructor: "Lt. Carmen Lopez",
      grade: "A",
      attendance: 100,
      progress: 90
    }
  ];

  const handleExport = () => {
    // Mock export functionality
    alert('Exporting training records...');
  };

  if (!person) return null;

  return (
    <dialog id="person_modal" className="modal z-[10000]" open={isOpen}>
      <div className="modal-box w-11/12 max-w-4xl relative bg-white">
        <form method="dialog" className="absolute top-4 right-4">
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {person.avatar}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-2xl text-primary mb-2">{person.name}</h3>
            <p className="text-gray-600 mb-1">{person.rank}</p>
            <p className="text-sm text-gray-500 mb-1">AFP - {person.id.toString().padStart(6, '0')}</p>
            <p className="text-sm text-gray-500">{person.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg text-gray-700">Training Records</h4>
            <button 
              onClick={handleExport}
              className="btn btn-sm btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Records
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-black">
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
                {getTrainingRecords(person.id).map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium">{record.date}</td>
                    <td>{record.program}</td>
                    <td>{record.instructor}</td>
                    <td>
                      <span className={`badge badge-sm ${
                        record.grade.startsWith('A') ? 'bg-success' : 
                        record.grade.startsWith('B') ? 'badge-warning' : 'badge-error'
                      }`}>
                        {record.grade}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-base-300 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              record.attendance >= 95 ? 'bg-success-content' :
                              record.attendance >= 85 ? 'bg-primary' :
                              record.attendance >= 75 ? 'bg-warning' : 'bg-error'
                            }`} 
                            style={{ width: `${record.attendance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{record.attendance}%</span>

                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-base-300 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              record.progress >= 90 ? 'bg-success-content' :
                              record.progress >= 80 ? 'bg-primary' :
                              record.progress >= 70 ? 'bg-warning' : 'bg-error'
                            }`} 
                            style={{ width: `${record.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{record.progress}%</span>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 p-4 bg-base-200 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{getTrainingRecords(person.id).length}</p>
              <p className="text-sm text-gray-600">Total Programs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-content">A+</p>
              <p className="text-sm text-gray-600">Average Grade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">97%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-content">90%</p>
              <p className="text-sm text-gray-600">Average Progress</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default PersonnelModal; 