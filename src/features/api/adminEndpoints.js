// features/api/adminEndpoints.js
import { apiSlice } from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingUsers: builder.query({
      query: () => "/users/pending",
      providesTags: [{ type: "User", id: "PENDING_LIST" }],
      transformResponse: (response) => response.data,
    }),
    createPendingUser: builder.mutation({
      query: (payload) => ({
        url: "/users/pending/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "User", id: "PENDING_LIST" }],
    }),
    createWebUser: builder.mutation({
      query: (payload) => ({
        url: "/users/web/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "User", id: "PENDING_LIST" }],
    }),
    getOrgStructure: builder.query({
      query: () => ({
        url: "/meta/org-structure",
        method: "GET",
      }),
    }),
    getRanks: builder.query({
      query: (serviceCode) => ({
        url: `/meta/ranks/${serviceCode}`,
        method: "GET",
      }),
    }),
    getAllUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        role = "",
        accountStatus = "",
        unit = "",
        sortBy = "",
        sortOrder = "desc",
        branchOfService = "",
      } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set("page", String(page));
        if (limit) params.set("limit", String(limit));
        if (search) params.set("search", search);
        if (role) params.set("role", role);
        if (accountStatus) params.set("accountStatus", accountStatus);
        if (unit) params.set("unit", unit);
        if (branchOfService) params.set("branchOfService", branchOfService);
        if (sortBy) params.set("sortBy", sortBy);
        if (sortOrder) params.set("sortOrder", sortOrder);
        return {
          url: `/users/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "User", id: "ALL_USERS" }],
    }),

    // Combined users endpoint with comprehensive filtering
    getUsers: builder.query({
      query: ({
        status = "all",
        roles = [],
        search = "",
        rank = "",
        division = "",
        unit = "",
        branchOfService = "",
        page = 1,
        limit = 100,
      } = {}) => {
        const params = new URLSearchParams();

        // Status filter
        if (status !== "all") {
          params.set("status", status);
        }

        // Role filters
        roles.forEach((r) => params.append("role", r));

        // Search filter
        if (search) {
          params.set("search", search);
        }

        // Additional filters
        if (rank) params.set("rank", rank);
        if (division) params.set("division", division);
        if (unit) params.set("unit", unit);
        if (branchOfService) params.set("branchOfService", branchOfService);

        // Pagination
        params.set("page", String(page));
        params.set("limit", String(limit));

        return {
          url: `/users?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data || response,
      providesTags: [{ type: "User", id: "ALL_USERS" }],
    }),

    // Active users by roles (supports multiple role params) - kept for backward compatibility
    getActiveUsers: builder.query({
      query: ({
        roles = [],
        page = 1,
        limit = 100,
        search = "",
        unit = "",
        branchOfService = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        roles.forEach((r) => params.append("role", r));
        if (search) params.set("search", search);
        if (unit) params.set("unit", unit);
        if (branchOfService) params.set("branchOfService", branchOfService);
        return {
          url: `/users/active?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data || response,
      providesTags: [{ type: "User", id: "ACTIVE_USERS" }],
    }),

    // Inactive users by roles (supports multiple role params) - kept for backward compatibility
    getInactiveUsers: builder.query({
      query: ({
        roles = [],
        page = 1,
        limit = 100,
        search = "",
        unit = "",
        branchOfService = "",
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        roles.forEach((r) => params.append("role", r));
        if (search) params.set("search", search);
        if (unit) params.set("unit", unit);
        if (branchOfService) params.set("branchOfService", branchOfService);
        return {
          url: `/users/inactive?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data || response,
      providesTags: [{ type: "User", id: "INACTIVE_USERS" }],
    }),

    // Active user details by id (same route with id param)
    getActiveUserById: builder.query({
      query: (userId) => ({
        url: `/users/active?id=${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: (result, error, arg) => [{ type: "User", id: arg }],
    }),

    // Inactive user details by id
    getInactiveUserById: builder.query({
      query: (userId) => ({
        url: `/users/inactive?id=${userId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: (result, error, arg) => [{ type: "User", id: arg }],
    }),

    // Soft delete (archive) a user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "ACTIVE_USERS" },
        { type: "User", id: "INACTIVE_USERS" },
        { type: "User", id: arg },
      ],
    }),

    // Update user account status (active/inactive)
    updateUserStatus: builder.mutation({
      query: ({ userId, accountStatus }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: { accountStatus },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "ACTIVE_USERS" },
        { type: "User", id: "INACTIVE_USERS" },
        { type: "User", id: arg.userId },
      ],
    }),

    // Verify current user's password for security confirmations
    verifyPassword: builder.mutation({
      query: (password) => ({
        url: "/users/verify-password",
        method: "POST",
        body: { password },
      }),
    }),
    approveUser: builder.mutation({
      query: (userId) => ({
        url: `/users/pending/${userId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "User", id: "ALL_USERS" }],
    }),
    rejectUser: builder.mutation({
      query: (userId) => ({
        url: `/users/pending/${userId}/decline`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "User", id: "ALL_USERS" }],
    }),
    verifyEmailToken: builder.query({
      query: (token) => ({
        url: `/users/verify-token/${token}`,
        method: "GET",
      }),
    }),
    verifyEmail: builder.mutation({
      query: ({ token, password }) => ({
        url: `/users/verify-email?token=${token}`,
        method: "POST",
        body: { password },
      }),
    }),

    // Training Programs list
    getTrainingPrograms: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        return {
          url: `/training-programs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        const base = [{ type: "Program", id: "LIST" }];
        const items = result?.data?.programs || result?.programs || [];
        return base.concat(
          items.map((p) => ({ type: "Program", id: p.id || p._id }))
        );
      },
      transformResponse: (response) => {
        return {
          programs: response?.data?.programs || [],
          pagination: response?.data?.pagination || null,
        };
      },
    }),

    // Program details (for attendance header/dates)
    getTrainingProgramById: builder.query({
      query: (programId) => ({
        url: `/training-programs/${programId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "Program", id: arg }],
      transformResponse: (response) => response?.data || response,
    }),

    // Session meta by date
    getSessionMetaByDate: builder.query({
      query: ({ programId, date }) => ({
        url: `/training-programs/${programId}/sessions/${date}/meta`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "Program", id: `${arg.programId}-meta-${arg.date}` },
      ],
      transformResponse: (response) => response?.data || response,
    }),

    // Bulk session meta for all dates in a program (for DayPills indicators)
    getProgramSessionMeta: builder.query({
      query: (programId) => ({
        url: `/training-programs/${programId}/sessions/meta`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "Program", id: `${arg}-all-meta` },
      ],
      transformResponse: (response) => response?.data || response,
    }),

    // Day attendance by date
    getDayAttendanceByDate: builder.query({
      query: ({ programId, date }) => ({
        url: `/training-programs/${programId}/attendance/${date}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "Program", id: `${arg.programId}-attendance-${arg.date}` },
      ],
      transformResponse: (response) => response?.data || response,
    }),

    createTrainingProgram: builder.mutation({
      query: (payload) => ({
        url: "/training-programs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Program", id: "LIST" }],
    }),

    // Record/update a single trainee's attendance for a date
    recordTraineeAttendance: builder.mutation({
      query: ({ programId, traineeId, date, status, remarks = "" }) => ({
        url: `/training-programs/${programId}/trainee/${traineeId}/attendance`,
        method: "POST",
        body: { date, status, remarks },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Program", id: `${arg.programId}-attendance-${arg.date}` },
      ],
    }),

    // Update session meta (start/end time, status, reason) for a given date
    updateSessionMeta: builder.mutation({
      query: ({ programId, date, startTime, endTime, status, reason }) => ({
        url: `/training-programs/${programId}/sessions/${date}/meta`,
        method: "PUT",
        body: { startTime, endTime, status, reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Program", id: `${arg.programId}-meta-${arg.date}` },
        { type: "Program", id: `${arg.programId}-all-meta` },
      ],
    }),

    // Update program end date
    updateProgramEndDate: builder.mutation({
      query: ({ programId, endDate, reason }) => ({
        url: `/training-programs/${programId}/end-date`,
        method: "PATCH",
        body: { endDate, reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Program", id: arg.programId },
      ],
    }),

    // Mark day as completed
    markDayCompleted: builder.mutation({
      query: ({ programId, date, reason }) => ({
        url: `/training-programs/${programId}/sessions/${date}/complete`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Program", id: `${arg.programId}-meta-${arg.date}` },
        { type: "Program", id: `${arg.programId}-all-meta` },
      ],
    }),

    // Reopen completed day
    reopenCompletedDay: builder.mutation({
      query: ({ programId, date }) => ({
        url: `/training-programs/${programId}/sessions/${date}/complete`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Program", id: `${arg.programId}-meta-${arg.date}` },
        { type: "Program", id: `${arg.programId}-all-meta` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPendingUsersQuery,
  useCreatePendingUserMutation,
  useGetOrgStructureQuery,
  useGetRanksQuery,
  useCreateWebUserMutation,
  useGetAllUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useVerifyEmailTokenQuery,
  useVerifyEmailMutation,
  useGetTrainingProgramsQuery,
  useCreateTrainingProgramMutation,
  useGetTrainingProgramByIdQuery,
  useGetSessionMetaByDateQuery,
  useGetDayAttendanceByDateQuery,
  useRecordTraineeAttendanceMutation,
  useUpdateSessionMetaMutation,
  useGetUsersQuery,
  useGetActiveUsersQuery,
  useGetInactiveUsersQuery,
  useGetActiveUserByIdQuery,
  useGetInactiveUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useUpdateProgramEndDateMutation,
  useMarkDayCompletedMutation,
  useReopenCompletedDayMutation,
  useGetProgramSessionMetaQuery,
  useVerifyPasswordMutation,
} = adminApi;
