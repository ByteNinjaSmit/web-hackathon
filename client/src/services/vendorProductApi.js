import axios from 'axios';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_URI_API;

// Create axios instance with default config
const createApiClient = (authToken = null) => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: authToken } : {}),
    },
    withCredentials: true, // Important for sending cookies with requests
  });
};

// Default client without auth token
const defaultApiClient = createApiClient();

// Generic API request function with error handling
const apiRequest = async (endpoint, options = {}, authToken = null) => {
  try {
    const client = authToken ? createApiClient(authToken) : defaultApiClient;
    const response = await client({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    // Handle and transform error for consistent format
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
    const errorResponse = {
      success: false,
      message: errorMessage,
      status: error.response?.status,
    };
    throw errorResponse;
  }
};

// Vendor Product API functions
export const vendorProductApi = {
  // Get all products for the authenticated vendor
  getMyProducts: async (params = {}, authToken = null) => {
    const { page = 1, limit = 20, category, search, isAvailable } = params;
    return apiRequest('/api/products', {
      method: 'GET',
      params: {
        page,
        limit,
        category,
        search,
        isAvailable,
      },
    }, authToken);
  },

  // Get a specific product by ID
  getProductById: async (productId, authToken = null) => {
    return apiRequest(`/api/products/${productId}`, {
      method: 'GET',
    }, authToken);
  },

  // Add a new product
  addProduct: async (productData, authToken = null) => {
    return apiRequest('/api/products', {
      method: 'POST',
      data: productData,
    }, authToken);
  },

  // Update an existing product
  updateProduct: async (productId, productData, authToken = null) => {
    return apiRequest(`/api/products/${productId}`, {
      method: 'PUT',
      data: productData,
    }, authToken);
  },

  // Delete a product
  deleteProduct: async (productId, authToken = null) => {
    return apiRequest(`/api/products/${productId}`, {
      method: 'DELETE',
    }, authToken);
  },

  // Get product statistics for dashboard
  getProductStats: async (authToken = null) => {
    return apiRequest('/api/vendors/product-stats', {
      method: 'GET',
    }, authToken);
  },
};

export default vendorProductApi;