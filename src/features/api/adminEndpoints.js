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
      } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set("page", String(page));
        if (limit) params.set("limit", String(limit));
        if (search) params.set("search", search);
        if (role) params.set("role", role);
        if (accountStatus) params.set("accountStatus", accountStatus);
        if (unit) params.set("unit", unit);
        if (sortBy) params.set("sortBy", sortBy);
        if (sortOrder) params.set("sortOrder", sortOrder);
        return {
          url: `/users/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "User", id: "ALL_USERS" }],
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
} = adminApi;
