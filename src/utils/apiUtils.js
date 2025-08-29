// src/utils/apiUtils.js
// Utility functions for making API calls with environment-aware URLs
import { config } from "../config/env";

/**
 * Make a direct API call with authentication
 * @param {string} endpoint - API endpoint (e.g., '/users', '/auth/login')
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("afprotrack_token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = config.getApiUrl(endpoint);

  return fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });
};

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const apiGet = (endpoint, options = {}) => {
  return apiCall(endpoint, { ...options, method: "GET" });
};

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const apiPost = (endpoint, data, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const apiPut = (endpoint, data, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>}
 */
export const apiDelete = (endpoint, options = {}) => {
  return apiCall(endpoint, { ...options, method: "DELETE" });
};

/**
 * Get the full backend URL for a specific endpoint
 * @param {string} endpoint - Backend endpoint
 * @returns {string} Full backend URL
 */
export const getBackendUrl = (endpoint = "") => {
  return config.getBackendUrl(endpoint);
};

/**
 * Get the full API URL for a specific endpoint
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint = "") => {
  return config.getApiUrl(endpoint);
};

export default {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getBackendUrl,
  getApiUrl,
};
