// src/config/env.js
// Environment configuration for dynamic backend URLs

// Debug: Log all environment variables
console.log("🔍 Debug - All VITE_ environment variables:", {
  VITE_MODE: import.meta.env.VITE_MODE,
  VITE_DEV_API_BASE_URL: import.meta.env.VITE_DEV_API_BASE_URL,
  VITE_DEV_BACKEND_URL: import.meta.env.VITE_DEV_BACKEND_URL,
  VITE_PROD_API_BASE_URL: import.meta.env.VITE_PROD_API_BASE_URL,
  VITE_PROD_BACKEND_URL: import.meta.env.VITE_PROD_BACKEND_URL,
});

const isDev = import.meta.env.VITE_MODE === "dev";

// Debug: Log the logic
console.log("🔍 Debug - Logic check:", {
  VITE_MODE: import.meta.env.VITE_MODE,
  isDev: isDev,
  comparison: `"${import.meta.env.VITE_MODE}" === "dev"`,
  result: import.meta.env.VITE_MODE === "dev",
});

export const config = {
  // API Configuration
  api: {
    baseUrl: isDev
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL,
    backendUrl: isDev
      ? import.meta.env.VITE_DEV_BACKEND_URL
      : import.meta.env.VITE_PROD_BACKEND_URL,
  },

  // Environment info
  isDev,
  isProd: !isDev,
  mode: import.meta.env.VITE_MODE || "dev",

  // Helper functions
  getApiUrl: (endpoint = "") => {
    const baseUrl = isDev
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL;
    return `${baseUrl}${endpoint}`;
  },

  getBackendUrl: (endpoint = "") => {
    const baseUrl = isDev
      ? import.meta.env.VITE_DEV_BACKEND_URL
      : import.meta.env.VITE_PROD_BACKEND_URL;
    return `${baseUrl}${endpoint}`;
  },
};

// Log configuration in development
console.log("🔧 Environment Configuration:", {
  mode: config.mode,
  isDev: config.isDev,
  apiBaseUrl: config.api.baseUrl,
  backendUrl: config.api.backendUrl,
});

// Debug: Show what URLs will be used
console.log("🔧 URL Selection:", {
  mode: config.mode,
  isDev: config.isDev,
  selectedApiUrl: config.api.baseUrl,
  selectedBackendUrl: config.api.backendUrl,
  "dev URL": import.meta.env.VITE_DEV_API_BASE_URL,
  "prod URL": import.meta.env.VITE_PROD_API_BASE_URL,
});

export default config;
