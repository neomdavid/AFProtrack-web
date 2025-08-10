import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, EyeIcon, CaretDownIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import AccountRequestModal from '../../components/Admin/AccountRequestModal';

const AdAccountConfirmation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Sample data for account requests
  const accountRequests = [
    {
      id: "REQ-001",
      serviceId: "AFP-2024-001",
      name: "John Doe",
      role: "Staff",
      unit: "1st Infantry Division",
      branchOfService: "Army",
      division: "Infantry",
      dateEnlisted: "2020-03-15",
      createdDate: "2024-01-15T09:30:00",
      status: "Pending"
    },
    {
      id: "REQ-002",
      serviceId: "AFP-2024-002",
      name: "Jane Smith",
      role: "Trainer",
      unit: "2nd Infantry Division",
      branchOfService: "Air Force",
      division: "Medical",
      dateEnlisted: "2019-07-22",
      createdDate: "2024-01-14T14:15:00",
      status: "Approved"
    },
    {
      id: "REQ-003",
      serviceId: "AFP-2024-003",
      name: "Mike Johnson",
      role: "Staff",
      unit: "3rd Infantry Division",
      branchOfService: "Navy",
      division: "Logistics",
      dateEnlisted: "2021-11-08",
      createdDate: "2024-01-13T11:45:00",
      status: "Declined"
    },
    {
      id: "REQ-004",
      serviceId: "AFP-2024-004",
      name: "Sarah Wilson",
      role: "Admin",
      unit: "4th Infantry Division",
      branchOfService: "Marine Corps",
      division: "Intelligence",
      dateEnlisted: "2022-05-12",
      createdDate: "2024-01-12T16:20:00",
      status: "Pending"
    }
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(accountRequests.length / itemsPerPage);

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return accountRequests.filter(request => {
      const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.status.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === '' || request.role === roleFilter;
      const matchesStatus = statusFilter === '' || request.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  // Pagination logic
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleStatusUpdate = (requestId, newStatus) => {
    // Here you would typically update the status in your backend
    console.log(`Updating request ${requestId} to status: ${newStatus}`);
    handleCloseModal();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'px-4 py-1 text-[12px] font-bold rounded-full bg-warning-content text-white',
      'Approved': ' px-4 py-1 text-[12px] font-bold rounded-full bg-success-content text-white',
      'Declined': ' px-4 py-1 text-[12px] font-bold rounded-full bg-error text-white'
    };
    return <span className={statusClasses[status] || 'badge badge-neutral'}>{status}</span>;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Account Confirmation</h1>
        <p className="text-gray-600 mt-2">Review and manage account creation requests</p>
      </div>

                     {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-1 text-[14px]">
          {/* Search */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Search</p>
            <input
              placeholder="Search by name, service ID, or status..."
              className="bg-white/90 border w-70 rounded-md border-gray-300 p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Role</p>
            <div className="relative">
              <select
                className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Staff">Staff</option>
                <option value="Trainer">Trainer</option>
                <option value="Admin">Admin</option>
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Status</p>
            <div className="relative">
              <select
                className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray opacity-0">Clear</p>
            <button
              onClick={handleClearFilters}
              className="bg-gray-100 text-gray-700 border w-70 rounded-md border-gray-300 p-2 hover:bg-gray-200 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="font-semibold text-gray-700">Request ID</th>
                <th className="font-semibold text-gray-700">Service ID</th>
                <th className="font-semibold text-gray-700">Name</th>
                <th className="font-semibold text-gray-700">Created Date</th>
                <th className="font-semibold text-gray-700 ">Status</th>
                <th className="font-semibold text-gray-700 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="font-medium text-gray-900">{request.id}</td>
                  <td className="text-gray-700">{request.serviceId}</td>
                  <td className="text-gray-700">{request.name}</td>
                  <td className="text-gray-700">{formatDateTime(request.createdDate)}</td>
                  <td className=''>{getStatusBadge(request.status)}</td>
                  <td className=' '>
                    <button
                      onClick={() => handleViewRequest(request)}
                      className="bg-primary min-w-22.5 text-[12px] text-white py-1 px-3 rounded-sm hover:bg-primary/80 hover:cursor-pointer transition-all duration-300 flex items-center gap-2"
                    >
                      {/* <EyeIcon size={16} /> */}
                      View Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

                 {/* Pagination */}
         <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
           <div className="text-sm text-gray-600">
             Showing page {currentPage} of {totalPages} ({filteredRequests.length} records)
           </div>
           <div className="flex items-center gap-2">
                           <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline disabled:opacity-50"
              >
                <CaretLeftIcon size={16} />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline disabled:opacity-50"
              >
                <CaretRightIcon size={16} />
              </button>
           </div>
         </div>
      </div>

      {/* Account Request Modal */}
      <AccountRequestModal
        open={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AdAccountConfirmation; 