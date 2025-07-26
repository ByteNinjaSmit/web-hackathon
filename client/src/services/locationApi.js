const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Location-based vendor API functions
export const vendorApi = {
  // Get nearby vendors
  getNearbyVendors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendors/nearby?${queryString}`);
  },

  // Get vendors with products
  getVendorsWithProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendors/with-products?${queryString}`);
  },

  // Get all vendors (admin)
  getAllVendors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendors?${queryString}`);
  },
};

// Location-based product API functions
export const productApi = {
  // Get products with location filtering
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products?${queryString}`);
  },

  // Get products by vendor
  getProductsByVendor: async (vendorId, params = {}) => {
    const queryString = new URLSearchParams({ vendorId, ...params }).toString();
    return apiRequest(`/products?${queryString}`);
  },
};

// Location-based search functions
export const locationSearch = {
  // Search for products near user location
  searchProductsNearby: async (searchParams = {}) => {
    const {
      latitude,
      longitude,
      maxDistance = 10000,
      category,
      search,
      limit = 20,
      skip = 0,
      ...otherParams
    } = searchParams;

    const params = {
      ...otherParams,
      limit,
      skip,
    };

    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
      params.maxDistance = maxDistance;
    }

    if (category) {
      params.category = category;
    }

    if (search) {
      params.search = search;
    }

    return productApi.getProducts(params);
  },

  // Search for vendors near user location
  searchVendorsNearby: async (searchParams = {}) => {
    const {
      latitude,
      longitude,
      maxDistance = 10000,
      includeProducts = false,
      limit = 20,
      skip = 0,
      ...otherParams
    } = searchParams;

    const params = {
      ...otherParams,
      limit,
      skip,
    };

    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
      params.maxDistance = maxDistance;
    }

    if (includeProducts) {
      params.includeProducts = includeProducts;
    }

    return vendorApi.getNearbyVendors(params);
  },

  // Get vendors with their products near user location
  getVendorsWithProductsNearby: async (searchParams = {}) => {
    const {
      latitude,
      longitude,
      maxDistance = 10000,
      category,
      search,
      limit = 20,
      skip = 0,
      ...otherParams
    } = searchParams;

    const params = {
      ...otherParams,
      limit,
      skip,
    };

    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
      params.maxDistance = maxDistance;
    }

    if (category) {
      params.category = category;
    }

    if (search) {
      params.search = search;
    }

    return vendorApi.getVendorsWithProducts(params);
  },
};

// Utility functions
export const locationUtils = {
  // Format distance for display
  formatDistance: (distanceInMeters) => {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)}km`;
    }
  },

  // Calculate distance between two points (client-side fallback)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 1000); // Return in meters
  },

  // Validate coordinates
  validateCoordinates: (latitude, longitude) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  },
}; 