import React, { createContext, useContext, useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  coords: Coordinates | null;
  radiusKm: number | null;
  setRadiusKm: (radius: number | null) => void;
  requestCurrentLocation: () => Promise<void>;
  calculateDistance: (lat: number, lon: number) => number | null;
  formatDistance: (km: number | null) => string;
}

// Haversine formula
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LocationContext = createContext<LocationContextType>({
  coords: null,
  radiusKm: null,
  setRadiusKm: () => {},
  requestCurrentLocation: async () => {},
  calculateDistance: () => null,
  formatDistance: () => '',
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Buenos Aires center or stored location
  const [coords, setCoords] = useState<Coordinates | null>(() => {
    try {
      const saved = localStorage.getItem('emprendeya_coords');
      return saved ? JSON.parse(saved) : { latitude: -34.6037, longitude: -58.3816 };
    } catch {
      return { latitude: -34.6037, longitude: -58.3816 };
    }
  });

  const [radiusKm, setRadiusKm] = useState<number | null>(null);

  const requestCurrentLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCoords(newCoords);
        localStorage.setItem('emprendeya_coords', JSON.stringify(newCoords));
      },
      (err) => {
        console.warn('Geolocation access not granted, using default:', err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    requestCurrentLocation();
  }, []);

  const calculateDistance = (lat: number, lon: number): number | null => {
    if (!coords) return null;
    return getDistanceInKm(coords.latitude, coords.longitude, lat, lon);
  };

  const formatDistance = (km: number | null): string => {
    if (km === null) return '';
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        radiusKm,
        setRadiusKm,
        requestCurrentLocation,
        calculateDistance,
        formatDistance,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
