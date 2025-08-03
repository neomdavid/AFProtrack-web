import React from "react";

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
  alert('Exporting training records...');
};
const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
const ProgramModal = ({ open, onClose, program }) => {
  if (!open || !program) return null;

  return (
    <dialog open={open} className="modal z-[10000]">
      <div className="modal-box w-11/12 max-w-4xl relative bg-white p-8">
        {/* X Close Button in form */}
        <form method="dialog" className="absolute top-4 right-4">
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
        <h3 className="font-bold text-2xl  mb-1">{program.name}</h3>
        <div className="mb-6 flex flex-col gap-1 text-gray">
          <p><span className="font-semibold"></span> {program.id}</p>
          <p><span className="font-semibold">Instructor:</span> {program.instructor}</p>
        </div>
        {/* Trainees Table Header Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg text-gray">List of Trainees</span>
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
                      <progress className="progress text-success-content w-24" value={t.attendance} max="100"></progress>
                      <span>{t.attendance}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <progress className="progress text-success-content w-24" value={t.progress} max="100"></progress>
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