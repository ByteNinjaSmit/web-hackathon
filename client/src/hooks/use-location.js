import { useState, useEffect, useCallback } from 'react';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'

  // Get current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setLocation(locationData);
          setLoading(false);
          setPermission('granted');
          resolve(locationData);
        },
        (error) => {
          setLoading(false);
          setError(error.message);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setPermission('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              setPermission('prompt');
              break;
            case error.TIMEOUT:
              setPermission('prompt');
              break;
            default:
              setPermission('prompt');
          }
          
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Request location permission and get location
  const requestLocation = useCallback(async () => {
    try {
      const result = await getCurrentLocation();
      return result;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }, [getCurrentLocation]);

  // Set location manually (for testing or user input)
  const setLocationManually = useCallback((lat, lng) => {
    const locationData = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      accuracy: null,
      timestamp: Date.now()
    };
    setLocation(locationData);
    setError(null);
    return locationData;
  }, []);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  // Check if location is available
  const isLocationAvailable = useCallback(() => {
    return location !== null && location.latitude && location.longitude;
  }, [location]);

  // Get location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation(parsedLocation);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location));
    }
  }, [location]);

  return {
    location,
    loading,
    error,
    permission,
    getCurrentLocation,
    requestLocation,
    setLocationManually,
    clearLocation,
    isLocationAvailable
  };
}

// Hook for location-based API queries
export function useLocationQuery() {
  const { location, requestLocation, isLocationAvailable } = useLocation();

  const queryWithLocation = useCallback(async (queryFn, options = {}) => {
    const {
      requireLocation = true,
      maxDistance = 10000,
      fallbackToGlobal = false,
      authToken = null,
      ...queryParams
    } = options;

    // If location is required but not available, try to get it
    if (requireLocation && !isLocationAvailable()) {
      try {
        await requestLocation();
      } catch (error) {
        if (!fallbackToGlobal) {
          throw new Error('Location is required but not available');
        }
      }
    }

    // Build query parameters
    const params = new URLSearchParams(queryParams);
    
    if (isLocationAvailable()) {
      params.append('latitude', location.latitude);
      params.append('longitude', location.longitude);
      params.append('maxDistance', maxDistance);
    }

    return queryFn(params.toString(), authToken);
  }, [location, requestLocation, isLocationAvailable]);

  return {
    queryWithLocation,
    location,
    isLocationAvailable
  };
}