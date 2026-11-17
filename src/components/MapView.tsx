import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Entrepreneur } from '../types';
import { useLocation } from '../contexts/LocationContext';

interface MapViewProps {
  entrepreneurs: Entrepreneur[];
  selectedEntrepreneur?: Entrepreneur | null;
  onSelectEntrepreneur?: (ent: Entrepreneur) => void;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  entrepreneurs,
  selectedEntrepreneur,
  onSelectEntrepreneur,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { coords } = useLocation();
  const navigate = useNavigate();

  // Custom icon creator
  const createStoreIcon = (businessName: string, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          background-color: ${isSelected ? '#E82985' : '#FF71C2'};
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          transition: transform 0.2s;
        ">
          ${businessName.charAt(0).toUpperCase()}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
  };

  const createUserIcon = () => {
    return L.divIcon({
      className: 'user-map-marker',
      html: `
        <div style="
          background-color: #7DB2FF;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 4px rgba(125, 178, 255, 0.4);
        "></div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = coords?.latitude || -34.6037;
    const initialLng = coords?.longitude || -58.3816;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenFreeMap or OSM standard tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Don't destroy on every re-render, keep instance
    };
  }, []);

  // Update user marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !coords) return;

    const userMarker = L.marker([coords.latitude, coords.longitude], {
      icon: createUserIcon(),
    }).addTo(map);

    userMarker.bindPopup('<b>Tu ubicación actual</b>');

    return () => {
      userMarker.remove();
    };
  }, [coords]);

  // Update entrepreneur markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const validEntrepreneurs = entrepreneurs.filter(
      (e) => typeof e.latitude === 'number' && typeof e.longitude === 'number'
    );

    validEntrepreneurs.forEach((ent) => {
      const isSelected = selectedEntrepreneur?.id === ent.id;
      const marker = L.marker([ent.latitude!, ent.longitude!], {
        icon: createStoreIcon(ent.business_name, isSelected),
      }).addTo(map);

      // Popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-center font-inter';
      popupContent.innerHTML = `
        <div style="font-family: 'Urbanist', sans-serif; font-weight: 700; font-size: 14px; color: #1A1A1A;">
          ${ent.business_name}
        </div>
        ${ent.category?.name ? `<div style="font-size: 11px; color: #6B7280;">${ent.category.name}</div>` : ''}
        ${ent.address ? `<div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">📍 ${ent.address}</div>` : ''}
        <button id="view-store-${ent.id}" style="
          margin-top: 8px;
          background-color: #FF71C2;
          color: white;
          border: none;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
        ">Ver Emprendimiento</button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-store-${ent.id}`);
        if (btn) {
          btn.onclick = () => navigate(`/store/${ent.id}`);
        }
      });

      marker.on('click', () => {
        if (onSelectEntrepreneur) onSelectEntrepreneur(ent);
      });

      markersRef.current.push(marker);
    });

    if (validEntrepreneurs.length > 0 && !selectedEntrepreneur) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [entrepreneurs, selectedEntrepreneur]);

  // Center on selected entrepreneur
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedEntrepreneur?.latitude || !selectedEntrepreneur?.longitude) return;

    map.flyTo(
      [selectedEntrepreneur.latitude, selectedEntrepreneur.longitude],
      15,
      { duration: 1 }
    );
  }, [selectedEntrepreneur]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height }}
      className="w-full rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm relative z-10"
    />
  );
};
