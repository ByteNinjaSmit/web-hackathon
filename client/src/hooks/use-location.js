import { useState, useEffect, useCallback } from 'react';

export function useLocation({ desiredAccuracy = 20, timeout = 10000, maxAge = 300000 } = {}) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'

  // Get browser permission status using Permissions API
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) return;

    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(status.state);

      status.onchange = () => {
        setPermission(status.state);
      };
    } catch (err) {
      console.warn('Permissions API not supported or failed:', err);
    }
  }, []);

  // Main function to get current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      setLoading(true);
      setError(null);

      const options = {
        enableHighAccuracy: true,
        timeout: timeout, // e.g., 10 seconds
        maximumAge: maxAge, // e.g., 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const locationData = {
            latitude,
            longitude,
            accuracy,
            timestamp: position.timestamp
          };

          if (accuracy <= desiredAccuracy || !desiredAccuracy) {
            setLocation(locationData);
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setPermission('granted');
            setLoading(false);
            resolve(locationData);
          } else {
            setError(`Low accuracy: ${accuracy}m`);
            setLoading(false);
            reject(new Error(`Location accuracy ${accuracy}m is worse than desired ${desiredAccuracy}m.`));
          }
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
        options
      );
    });
  }, [desiredAccuracy, timeout, maxAge]);

  // Retry logic: relaxed accuracy if high fails
  const requestLocation = useCallback(async () => {
    try {
      const result = await getCurrentLocation();
      return result;
    } catch (err) {
      console.warn('High accuracy failed, retrying with relaxed settings...');
      // Retry with relaxed settings (fallback)
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const locationData = {
              latitude,
              longitude,
              accuracy,
              timestamp: position.timestamp
            };
            setLocation(locationData);
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setLoading(false);
            setError(null);
            resolve(locationData);
          },
          (error) => {
            setLoading(false);
            setError(error.message);
            reject(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 600000 // 10 mins
          }
        );
      });
    }
  }, [getCurrentLocation]);

  const setLocationManually = useCallback((lat, lng) => {
    const locationData = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      accuracy: null,
      timestamp: Date.now()
    };
    setLocation(locationData);
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    setError(null);
    return locationData;
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    localStorage.removeItem('userLocation');
  }, []);

  const isLocationAvailable = useCallback(() => {
    return (
      location !== null &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number'
    );
  }, [location]);

  useEffect(() => {
    checkPermission();

    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        const now = Date.now();

        // Only use if it's recent and accurate enough
        if (
          parsed.latitude &&
          parsed.longitude &&
          (!desiredAccuracy || parsed.accuracy <= desiredAccuracy) &&
          now - parsed.timestamp < maxAge
        ) {
          setLocation(parsed);
        } else {
          localStorage.removeItem('userLocation');
        }
      } catch (e) {
        console.error('Error parsing location from localStorage:', e);
        localStorage.removeItem('userLocation');
      }
    }
  }, [checkPermission, desiredAccuracy, maxAge]);

  return {
    location,
    loading,
    error,
    permission,
    getCurrentLocation,
    requestLocation,
    setLocationManually,
    clearLocation,
    isLocationAvailable,
  };
}
