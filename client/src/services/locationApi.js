import axios from 'axios';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Vendor API functions
export const vendorApi = {
  // Get nearby vendors
  getNearbyVendors: async (params) => {
    const { latitude, longitude, maxDistance = 10, includeProducts = false } = params;
    return apiRequest('/api/vendors/nearby', {
      method: 'GET',
      params: {
        latitude,
        longitude,
        maxDistance,
        includeProducts,
      },
    });
  },

  // Get vendors with products
  getVendorsWithProducts: async (params) => {
    const { latitude, longitude, maxDistance = 10, category, search } = params;
    return apiRequest('/api/vendors/with-products', {
      method: 'GET',
      params: {
        latitude,
        longitude,
        maxDistance,
        category,
        search,
      },
    });
  },

  // Get all vendors (for admin purposes)
  getAllVendors: async (params = {}) => {
    const { search, isVerified, page = 1, limit = 20 } = params;
    return apiRequest('/api/vendors', {
      method: 'GET',
      params: {
        search,
        isVerified,
        page,
        limit,
      },
    });
  },
};

// Product API functions
export const productApi = {
  // Get products with location filtering
  getProducts: async (params = {}) => {
    const { latitude, longitude, maxDistance, category, search, page = 1, limit = 20 } = params;
    return apiRequest('/api/products', {
      method: 'GET',
      params: {
        latitude,
        longitude,
        maxDistance,
        category,
        search,
        page,
        limit,
      },
    });
  },

  // Get products by specific vendor
  getProductsByVendor: async (vendorId, params = {}) => {
    const { page = 1, limit = 20 } = params;
    return apiRequest(`/api/products/vendor/${vendorId}`, {
      method: 'GET',
      params: {
        page,
        limit,
      },
    });
  },
};

// High-level search functions
export const locationSearch = {
  // Search for products nearby
  searchProductsNearby: async (params) => {
    const { latitude, longitude, maxDistance = 10, category, search } = params;
    return productApi.getProducts({
      latitude,
      longitude,
      maxDistance,
      category,
      search,
    });
  },

  // Search for vendors nearby
  searchVendorsNearby: async (params) => {
    const { latitude, longitude, maxDistance = 10, category, search } = params;
    return vendorApi.getVendorsWithProducts({
      latitude,
      longitude,
      maxDistance,
      category,
      search,
    });
  },

  // Get vendors with products nearby
  getVendorsWithProductsNearby: async (params) => {
    const { latitude, longitude, maxDistance = 10, category, search } = params;
    return vendorApi.getVendorsWithProducts({
      latitude,
      longitude,
      maxDistance,
      category,
      search,
    });
  },

  // Get all nearby vendors (without products)
  getAllNearbyVendors: async (params) => {
    const { latitude, longitude, maxDistance = 10, includeProducts = false } = params;
    return vendorApi.getNearbyVendors({
      latitude,
      longitude,
      maxDistance,
      includeProducts,
    });
  },
};

// Utility functions
export const locationUtils = {
  // Format distance for display
  formatDistance: (distance) => {
    if (!distance) return 'N/A';
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Validate coordinates
  validateCoordinates: (latitude, longitude) => {
    return (
      typeof latitude === 'number' && 
      typeof longitude === 'number' &&
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  },

  // Get current location from browser
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },
};

// Export default for convenience
export default {
  vendorApi,
  productApi,
  locationSearch,
  locationUtils,
  apiRequest,
}; 