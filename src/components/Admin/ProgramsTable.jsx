import React from "react";

const ProgramsTable = ({ onViewDetails, programs = [] }) => {
  return (
    <table className="table ">
      <thead className="text-black text-center">
        <tr className="border-b-1 border-gray-200">
          <th>Program</th>
          <th>Duration</th>
          <th>Instructor</th>
          <th>Participants</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {programs.map((program, idx) => (
          <tr
            key={program.id}
            className="text-center border-b-1 border-gray-200 last:border-b-0"
          >
            <td>{program.name}</td>
            <td>{program.duration}</td>
            <td>{program.instructor}</td>
            <td>{program.participants}</td>
                         <td className="flex justify-center items-center">
               <div className={`px-3 py-0.5 rounded-full font-semibold text-[12px] border ${
                 program.status === "Completed" 
                   ? "bg-success text-success-content border-success-content"
                   : program.status === "Upcoming"
                   ? "bg-warning text-warning-content border-warning-content"
                   : "bg-info text-info-content border-info-content"
               }`}>
                 {program.status}
               </div>
             </td>
            <td>
              <button
                className="px-4 bg-primary text-[12px] text-white py-1 mt-[-1px] rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
                onClick={() => onViewDetails(program)}
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProgramsTable; 