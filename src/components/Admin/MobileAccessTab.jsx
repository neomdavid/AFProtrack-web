import { CaretDownIcon, PlusIcon } from '@phosphor-icons/react'
import React, { useState, useMemo } from 'react'
import { personnelData } from '../../utils'
import AccessCard from './AccessCard'
import CreateAccountModal from './CreateAccountModal'

const MobileAccessTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique units and branches for filter options
  const units = [...new Set(personnelData.map(person => person.unit))];
  const branches = [...new Set(personnelData.map(person => person.branchOfService))];

  // Filter personnel based on search and filters
  const filteredPersonnel = useMemo(() => {
    return personnelData.filter(person => {
      const matchesSearch = searchTerm === '' || 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.afpId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUnit = selectedUnit === '' || person.unit === selectedUnit;
      const matchesBranch = selectedBranch === '' || person.branchOfService === selectedBranch;
      
      return matchesSearch && matchesUnit && matchesBranch;
    });
  }, [searchTerm, selectedUnit, selectedBranch]);

  return (
    <div className='flex flex-col gap-4'>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='flex text-[14px]  items-center gap-2 bg-primary text-white py-2 px-4 rounded-md self-start btn-hover'
        >
            <PlusIcon size={17}/>
            <p className=''>Create Account</p>
        </button>
        <section className='flex flex-col'>
        <div className="flex flex-wrap gap-2 mb-6 text-[14px]">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray ">Search</p>
          <input
            placeholder="Search Staff Name, Service ID, or Email"
            className="bg-white/90 border w-70  rounded-md border-gray-300 p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray">Filter</p>
          <div className="relative">
            <select 
              className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
            >
              <option value="">All Units</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <CaretDownIcon
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray">Branch of Service</p>
          <div className="relative">
            <select 
              className="bg-white/90 border w-70 appearance-none  rounded-md border-gray-300 p-2"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <CaretDownIcon
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
       
      </div>
        </section>

        {/* Personnel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPersonnel.map((person) => (
            <AccessCard key={person.id} person={person} />
          ))}
        </div>

        {/* Create Account Modal */}
        <CreateAccountModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          accountType="mobile"
        />
    </div>
  )
}

export default MobileAccessTab