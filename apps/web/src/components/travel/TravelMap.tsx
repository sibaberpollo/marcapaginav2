"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "@/lib/types/article";

// Fix for default marker icons in Leaflet with Next.js
const createNumberedIcon = (number: number, isActive: boolean = false) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full 
        ${isActive ? "bg-brand-yellow text-brand-black-static scale-125" : "bg-brand-black-static text-brand-yellow"} 
        font-bold text-sm shadow-lg transition-all duration-300 border-2 border-white">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.5 });
  }, [center, zoom, map]);
  return null;
}

interface TravelMapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
  activeLocationId?: string | null;
  // Type signature parameter - intentionally unused in definition
  // eslint-disable-next-line no-unused-vars
  onLocationClick?: (location: Location) => void;
  showRoute?: boolean;
  routeOrder?: string[];
}

export default function TravelMap({
  locations,
  center,
  zoom = 13,
  activeLocationId,
  onLocationClick,
  showRoute = true,
  routeOrder,
}: TravelMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to defer the state update
    // This avoids synchronous setState in useEffect which can cause cascading renders
    const rafId = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-surface-2 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-text-secondary">Cargando mapa...</span>
      </div>
    );
  }

  // Calculate center from locations if not provided
  const mapCenter =
    center ||
    (() => {
      const lats = locations.map((l) => l.coordinates[0]);
      const lngs = locations.map((l) => l.coordinates[1]);
      return [
        (Math.min(...lats) + Math.max(...lats)) / 2,
        (Math.min(...lngs) + Math.max(...lngs)) / 2,
      ] as [number, number];
    })();

  // Create route polyline coordinates
  const routeCoordinates = routeOrder
    ? routeOrder
        .map((id) => locations.find((l) => l.id === id))
        .filter((l): l is Location => l !== undefined)
        .map((l) => l.coordinates)
    : locations.sort((a, b) => a.order - b.order).map((l) => l.coordinates);

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater
        center={
          activeLocationId
            ? locations.find((l) => l.id === activeLocationId)?.coordinates ||
              mapCenter
            : mapCenter
        }
        zoom={activeLocationId ? 15 : zoom}
      />

      {showRoute && routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: "#faff00",
            weight: 3,
            opacity: 0.7,
            dashArray: "10, 10",
          }}
        />
      )}

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.coordinates}
          icon={createNumberedIcon(
            location.order,
            activeLocationId === location.id,
          )}
          eventHandlers={{
            click: () => onLocationClick?.(location),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                {location.icon && (
                  <span className="text-lg">{location.icon}</span>
                )}
                <h3 className="font-bold text-brand-black-static">
                  {location.name}
                </h3>
              </div>
              {location.subtitle && (
                <p className="text-xs text-gray-500 mb-2">
                  {location.subtitle}
                </p>
              )}
              {location.address && (
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <span>📍</span> {location.address}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
