// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('afprotrack_token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'Program', 'AccountRequest', 'Dashboard'],
  endpoints: () => ({}), // endpoints will be injected per domain
});
