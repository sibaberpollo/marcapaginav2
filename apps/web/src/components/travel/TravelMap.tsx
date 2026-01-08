"use client";

import { useEffect, useState, useMemo } from "react";
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
    // Validar que las coordenadas sean números válidos antes de usar
    if (!Array.isArray(center) || center.length !== 2) {
      return;
    }

    const lat = center[0];
    const lng = center[1];

    // Validación exhaustiva
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng) ||
      !isFinite(lat) ||
      !isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      console.warn("MapUpdater: Invalid coordinates", { lat, lng, center });
      return;
    }

    try {
      // Verificar que el mapa esté inicializado
      if (map && typeof map.flyTo === "function") {
        map.flyTo(center as [number, number], zoom, { duration: 0.5 });
      }
    } catch (error) {
      // Silenciar errores de Leaflet si el mapa no está listo
      console.warn("Error updating map center:", error);
    }
  }, [center, zoom, map]);
  return null;
}

interface MapInteractionDisablerProps {
  dragging: boolean;
  touchZoom: boolean;
  doubleClickZoom: boolean;
  scrollWheelZoom: boolean;
}

function MapInteractionDisabler({
  dragging,
  touchZoom,
  doubleClickZoom,
  scrollWheelZoom,
}: MapInteractionDisablerProps) {
  const map = useMap();

  useEffect(() => {
    // Ensure map is fully initialized before accessing interaction controls
    if (!map) return;

    // Deshabilitar interacciones según las props
    if (map.dragging) {
      if (!dragging) {
        map.dragging.disable();
      } else {
        map.dragging.enable();
      }
    }

    if (map.touchZoom) {
      if (!touchZoom) {
        map.touchZoom.disable();
      } else {
        map.touchZoom.enable();
      }
    }

    if (map.doubleClickZoom) {
      if (!doubleClickZoom) {
        map.doubleClickZoom.disable();
      } else {
        map.doubleClickZoom.enable();
      }
    }

    if (map.scrollWheelZoom) {
      if (!scrollWheelZoom) {
        map.scrollWheelZoom.disable();
      } else {
        map.scrollWheelZoom.enable();
      }
    }

    // Prevenir que el scroll se quede en el mapa - propagar a la página
    const mapContainer =
      map.getContainer && typeof map.getContainer === "function"
        ? map.getContainer()
        : null;
    if (mapContainer) {
      // Interceptar eventos de scroll y propagarlos al contenedor padre
      const handleWheel = (e: WheelEvent) => {
        if (!scrollWheelZoom) {
          e.preventDefault();
          e.stopPropagation();
          const parent = mapContainer.parentElement;
          if (parent) {
            parent.scrollBy({
              top: e.deltaY,
              behavior: "auto",
            });
          }
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!dragging && !touchZoom) {
          // Permitir que el scroll se propague
          const target = e.target as HTMLElement;
          if (target.closest(".leaflet-container")) {
            // Solo prevenir si no es un marcador o popup
            if (
              !target.closest(".leaflet-marker-icon") &&
              !target.closest(".leaflet-popup")
            ) {
              // No hacer nada, dejar que el scroll se propague naturalmente
            }
          }
        }
      };

      mapContainer.addEventListener("wheel", handleWheel, { passive: false });
      mapContainer.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });

      return () => {
        mapContainer.removeEventListener("wheel", handleWheel);
        mapContainer.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [map, dragging, touchZoom, doubleClickZoom, scrollWheelZoom]);

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
  scrollWheelZoom?: boolean;
  dragging?: boolean;
  touchZoom?: boolean;
  doubleClickZoom?: boolean;
}

export default function TravelMap({
  locations,
  center,
  zoom = 13,
  activeLocationId,
  onLocationClick,
  showRoute = true,
  routeOrder,
  scrollWheelZoom = true,
  dragging = true,
  touchZoom = true,
  doubleClickZoom = true,
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

  // Calculate center from locations if not provided - usando useMemo para estabilidad
  // IMPORTANTE: Los hooks deben estar antes de cualquier early return
  const mapCenter = useMemo((): [number, number] => {
    // Si hay un center válido, usarlo
    if (center && Array.isArray(center) && center.length === 2) {
      const [lat, lng] = center;
      if (
        typeof lat === "number" &&
        typeof lng === "number" &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        isFinite(lat) &&
        isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return [lat, lng] as [number, number];
      }
    }

    // Calcular desde las ubicaciones
    if (locations && locations.length > 0) {
      const validLocations = locations.filter(
        (l) =>
          l &&
          l.coordinates &&
          Array.isArray(l.coordinates) &&
          l.coordinates.length === 2 &&
          typeof l.coordinates[0] === "number" &&
          typeof l.coordinates[1] === "number" &&
          !isNaN(l.coordinates[0]) &&
          !isNaN(l.coordinates[1]) &&
          isFinite(l.coordinates[0]) &&
          isFinite(l.coordinates[1]) &&
          l.coordinates[0] >= -90 &&
          l.coordinates[0] <= 90 &&
          l.coordinates[1] >= -180 &&
          l.coordinates[1] <= 180,
      );

      if (validLocations.length > 0) {
        const lats = validLocations.map((l) => l.coordinates[0]);
        const lngs = validLocations.map((l) => l.coordinates[1]);
        const calculatedLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const calculatedLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

        // Validar que el cálculo no resulte en NaN
        if (
          !isNaN(calculatedLat) &&
          !isNaN(calculatedLng) &&
          isFinite(calculatedLat) &&
          isFinite(calculatedLng)
        ) {
          return [calculatedLat, calculatedLng] as [number, number];
        }
      }
    }

    // Fallback: coordenadas por defecto (Madrid)
    return [40.4168, -3.7038] as [number, number];
  }, [center, locations]);

  // Calculate active center - usando useMemo para estabilidad
  const activeCenter = useMemo((): [number, number] => {
    if (activeLocationId) {
      const activeLocation = locations.find((l) => l.id === activeLocationId);
      if (
        activeLocation &&
        activeLocation.coordinates &&
        Array.isArray(activeLocation.coordinates) &&
        activeLocation.coordinates.length === 2
      ) {
        const [lat, lng] = activeLocation.coordinates;
        if (
          typeof lat === "number" &&
          typeof lng === "number" &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          isFinite(lat) &&
          isFinite(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          return [lat, lng] as [number, number];
        }
      }
    }
    return mapCenter;
  }, [activeLocationId, locations, mapCenter]);

  // Helper function to validate coordinates
  const isValidCoord = (coord: unknown): coord is [number, number] => {
    if (!Array.isArray(coord) || coord.length !== 2) return false;
    const [lat, lng] = coord;
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      isFinite(lat) &&
      isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // Filter locations with valid coordinates
  const validLocations = useMemo(() => {
    return locations.filter(
      (l) => l && l.coordinates && isValidCoord(l.coordinates),
    );
  }, [locations]);

  // Create route polyline coordinates
  const routeCoordinates = routeOrder
    ? routeOrder
        .map((id) => validLocations.find((l) => l.id === id))
        .filter((l): l is Location => l !== undefined)
        .map((l) => l.coordinates)
    : validLocations
        .sort((a, b) => a.order - b.order)
        .map((l) => l.coordinates);

  // Early return después de todos los hooks
  if (!isMounted) {
    return (
      <div className="w-full h-full bg-surface-2 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-text-secondary">Cargando mapa...</span>
      </div>
    );
  }

  // Validación final antes de renderizar - asegurar que mapCenter sea válido
  // Usar una función helper para validar coordenadas (type guard)
  const isValidCoordinate = (coord: unknown): coord is [number, number] => {
    if (!Array.isArray(coord) || coord.length !== 2) return false;
    const [lat, lng] = coord;
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      isFinite(lat) &&
      isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  const defaultCenter: [number, number] = [40.4168, -3.7038];

  // Validación final antes de renderizar - asegurar que mapCenter sea válido
  const safeMapCenter: [number, number] = isValidCoordinate(mapCenter)
    ? mapCenter
    : defaultCenter;

  // Validación final para activeCenter
  const safeActiveCenter: [number, number] = isValidCoordinate(activeCenter)
    ? activeCenter
    : safeMapCenter;

  // Verificación final antes de renderizar - nunca renderizar con coordenadas inválidas
  if (!isValidCoordinate(safeMapCenter)) {
    return (
      <div className="w-full h-full bg-surface-2 rounded-lg flex items-center justify-center">
        <span className="text-text-secondary">Error al cargar el mapa</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={safeMapCenter}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      scrollWheelZoom={scrollWheelZoom}
      dragging={dragging}
      touchZoom={touchZoom}
      doubleClickZoom={doubleClickZoom}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater
        center={safeActiveCenter}
        zoom={activeLocationId ? 15 : zoom}
      />

      <MapInteractionDisabler
        dragging={dragging}
        touchZoom={touchZoom}
        doubleClickZoom={doubleClickZoom}
        scrollWheelZoom={scrollWheelZoom}
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

      {validLocations.map((location) => (
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
          data-testid="marker"
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
