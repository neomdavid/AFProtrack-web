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
  }),
  overrideExisting: true,
});

export const {
  useGetPendingUsersQuery,
  useCreatePendingUserMutation,
} = adminApi;
