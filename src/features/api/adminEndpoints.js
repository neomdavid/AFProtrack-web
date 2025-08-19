// features/api/adminEndpoints.js
import { apiSlice } from './apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingUsers: builder.query({
      query: () => '/users/pending',
      providesTags: [{ type: 'User', id: 'PENDING_LIST' }],
      transformResponse:(response)=>response.data,
    }),
    createPendingUser: builder.mutation({
      query: (payload) => ({
        url: '/users/pending/create',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'PENDING_LIST' }],
    }),
    createWebUser: builder.mutation({
      query: (payload) => ({
        url: '/users/web/create',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'PENDING_LIST' }],
    }),
    getOrgStructure: builder.query({
      query: () => ({
        url: '/meta/org-structure',
        method: 'GET',
      }),
    }),
    getRanks: builder.query({
      query: (serviceCode) => ({
        url: `/meta/ranks/${serviceCode}`,
        method: 'GET',
      }),
    }),
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', role = '', status = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', String(page));
        if (limit) params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (role) params.set('role', role);
        if (status) params.set('status', status);
        return {
          url: `/users/all?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPendingUsersQuery,
  useCreatePendingUserMutation,
  useCreateWebUserMutation,
  useGetOrgStructureQuery,
  useGetRanksQuery,
  useGetAllUsersQuery,
} = adminApi;
