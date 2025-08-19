import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon, CaretDownIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import AccountRequestModal from '../../components/Admin/AccountRequestModal';
import { useGetAllUsersQuery } from '../../features/api/adminEndpoints';
import { useAuth } from '../../hooks/useAuth';

const AdAccountConfirmation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [accountStatusFilter, setAccountStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery({ 
    page, 
    limit: itemsPerPage, 
    search: searchTerm, 
    role: roleFilter, 
    accountStatus: accountStatusFilter,
    sortBy,
    sortOrder
  }, { skip: !isAdmin });
  
  // Debug logging
  console.log('Account Confirmation Debug:', { user, isAdmin, data, isLoading, isError, error });
  
  const accountRequests = useMemo(() => {
    const list = data?.data?.users || [];
    console.log('Raw users data:', list);
    return list.map(u => ({
      id: u.id,
      serviceId: u.serviceId,
      name: u.fullName || `${u.firstName} ${u.lastName}`,
      role: (u.role || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      unit: u.unit,
      branchOfService: u.branchOfService,
      division: u.division,
      createdDate: u.createdAt,
      status: (u.accountStatus || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      raw: u,
    }));
  }, [data]);

  // itemsPerPage moved above to match server pagination

  // Filter and search logic - REMOVED: Using server-side filtering instead
  // const filteredRequests = useMemo(() => {
  //   return accountRequests.filter(request => {
  //     const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                          request.raw?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                          request.role.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesRole = roleFilter === '' || request.role === roleFilter;
  //     const matchesStatus = statusFilter === '' || request.status.toLowerCase().includes(statusFilter.toLowerCase());
  //     return matchesSearch && matchesRole && matchesStatus;
  //   });
  // }, [accountRequests, searchTerm, roleFilter, statusFilter]);

  // Pagination logic - Use server-side pagination
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const paginatedRequests = accountRequests; // Use API data directly since server handles filtering

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setPage(1);
  }, [searchTerm, roleFilter, accountStatusFilter, sortBy, sortOrder]);

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
    // Trigger a refetch to get updated data
    refetch();
    handleCloseModal();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setAccountStatusFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const goToPage = (p) => {
    setCurrentPage(p);
    setPage(p);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPage(currentPage - 1);
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

  const getStatusBadge = (user) => {
    const { isActive, isVerified, accountStatus } = user.raw || {};
    
    // Determine the primary status to display
    let statusText = '';
    let statusClass = '';
    
    if (accountStatus === 'pending') {
      statusText = 'Pending';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-warning text-warning-content';
    } else if (accountStatus === 'email_verification') {
      statusText = 'Email Verification';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-gray-300 text-neutral';
    } else if (accountStatus === 'approved') {
      statusText = 'Approved';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-info text-info-content';
    } else if (accountStatus === 'declined') {
      statusText = 'Declined';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-error text-error-content';
    } else if (accountStatus === 'active') {
      statusText = 'Active';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-success text-success-content';
    } else if (accountStatus === 'inactive') {
      statusText = 'Inactive';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-neutral text-neutral-content';
    } else {
      // Fallback for unknown statuses
      statusText = accountStatus || 'Unknown';
      statusClass = 'px-4 py-1 text-[12px] font-bold rounded-full bg-neutral text-neutral-content';
    }
    
    return <span className={statusClass}>{statusText}</span>;
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
                <option value="admin">Admin</option>
                <option value="training_staff">Training Staff</option>
                <option value="trainee">Trainee</option>
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
                value={accountStatusFilter}
                onChange={(e) => setAccountStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="email_verification">Email Verification</option>
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Sort By</p>
            <div className="relative">
              <select
                className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Request Date</option>
                <option value="fullName">Full Name</option>
                <option value="role">Role</option>
                <option value="unit">Unit</option>
              </select>
              <CaretDownIcon
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Sort Order */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-gray">Order</p>
            <div className="relative">
              <select
                className="bg-white/90 border w-70 appearance-none rounded-md border-gray-300 p-2"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
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
            <div className="text-center py-8 text-red-500">
              Failed to load users. {error?.data?.message || error?.message || ''}
            </div>
          ) : paginatedRequests.length > 0 ? (
            <table className="table table-zebra w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-semibold text-gray-700">Full Name</th>
                  <th className="font-semibold text-gray-700">Email</th>
                  <th className="font-semibold text-gray-700">Role</th>
                  <th className="font-semibold text-gray-700">Status</th>
                  <th className="font-semibold text-gray-700">Request Date</th>
                  <th className="font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="font-medium text-gray-900">{request.name}</td>
                    <td className="text-gray-700">{request.raw?.email || 'N/A'}</td>
                    <td className="text-gray-700">{request.role}</td>
                    <td className=''>{getStatusBadge(request)}</td>
                    <td className="text-gray-700">{formatDateTime(request.createdDate)}</td>
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
             {paginatedRequests.length > 0 ? (
               `Showing page ${currentPage} of ${totalPages} (${data?.data?.pagination?.totalItems || paginatedRequests.length} total records)`
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