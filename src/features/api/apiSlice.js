// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../config/env";

// Debug: Log what base URL the API slice is using
console.log("🔧 API Slice Configuration:", {
  baseUrl: config.api.baseUrl,
  mode: config.mode,
  isDev: config.isDev,
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: config.api.baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("afprotrack_token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User", "Program", "AccountRequest", "Dashboard"],
  endpoints: () => ({}), // endpoints will be injected per domain
});
