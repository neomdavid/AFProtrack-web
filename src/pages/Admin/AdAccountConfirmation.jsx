import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon, CaretDownIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import AccountRequestModal from '../../components/Admin/AccountRequestModal';
import { useGetAllUsersQuery } from '../../features/api/adminEndpoints';
import { useAuth } from '../../hooks/useAuth';

const AdAccountConfirmation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading, isError } = useGetAllUsersQuery({ page, limit: itemsPerPage, search: searchTerm, role: roleFilter, status: statusFilter }, { skip: !isAdmin });
  const accountRequests = useMemo(() => {
    const list = data?.data?.users || [];
    return list.map(u => ({
      id: u.id,
      serviceId: u.serviceId,
      name: u.fullName || `${u.firstName} ${u.lastName}`,
      role: u.role,
      unit: u.unit,
      branchOfService: u.branchOfService,
      division: u.division,
      createdDate: u.createdAt,
      status: (u.accountStatus || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      raw: u,
    }));
  }, [data]);

  // itemsPerPage moved above to match server pagination

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
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const paginatedRequests = filteredRequests; // server paginated already

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

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

  const goToPage = (p) => {
    setCurrentPage(p);
    setPage(p);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
          {!isAdmin ? (
            <div className="text-center py-8 text-red-500">Only admins can view this page.</div>
          ) : isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">Failed to load users.</div>
          ) : paginatedRequests.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No account requests found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

                 {/* Pagination */}
         <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
           <div className="text-sm text-gray-600">
             {filteredRequests.length > 0 ? (
               `Showing page ${currentPage} of ${totalPages} (${filteredRequests.length} records)`
             ) : (
               `No record found`
             )}
           </div>
           {totalPages > 1 && (
             <div className="join">
               <button
                 onClick={goToPreviousPage}
                 disabled={currentPage === 1}
                 className="join-item btn btn-sm btn-outline"
               >
                 Previous
               </button>
               
               {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                 <button
                   key={page}
                   onClick={() => goToPage(page)}
                   className={`join-item btn btn-sm ${
                     currentPage === page
                       ? "btn-primary"
                       : "btn-outline"
                   }`}
                 >
                   {page}
                 </button>
               ))}
               
               <button
                 onClick={goToNextPage}
                 disabled={currentPage === totalPages}
                 className="join-item btn btn-sm btn-outline"
               >
                 Next
               </button>
             </div>
           )}
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