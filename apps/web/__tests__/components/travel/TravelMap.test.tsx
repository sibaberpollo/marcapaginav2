import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TravelMap from "@/components/travel/TravelMap";
import { Location } from "@/lib/types/article";

// Mock Leaflet and react-leaflet
vi.mock("leaflet", () => ({
  default: {
    icon: vi.fn(() => ({})),
    divIcon: vi.fn(() => ({})),
  },
  icon: vi.fn(() => ({})),
  divIcon: vi.fn(() => ({})),
}));

vi.mock("react-leaflet", () => ({
  MapContainer: vi.fn(
    ({
      children,
      center,
      zoom,
      className,
    }: {
      children: React.ReactNode;
      center: [number, number];
      zoom: number;
      className: string;
    }) => (
      <div
        data-testid="map-container"
        data-center={JSON.stringify(center)}
        data-zoom={zoom}
        className={className}
      >
        {children}
      </div>
    ),
  ),
  TileLayer: vi.fn(() => <div data-testid="tile-layer" />),
  Marker: vi.fn(
    ({
      children,
      position,
      eventHandlers,
    }: {
      children: React.ReactNode;
      position: [number, number];
      eventHandlers: { click: () => void };
    }) => (
      <div
        data-testid="marker"
        data-position={JSON.stringify(position)}
        onClick={eventHandlers.click}
      >
        {children}
      </div>
    ),
  ),
  Popup: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  )),
  Polyline: vi.fn(() => <div data-testid="polyline" />),
  useMap: vi.fn(() => ({
    flyTo: vi.fn(),
  })),
}));

const mockLocations: Location[] = [
  {
    id: "loc1",
    name: "Plaza Mayor",
    subtitle: "Historic square",
    description: "Main square of Madrid",
    coordinates: [40.4168, -3.7038],
    address: "Calle Mayor",
    icon: "🏛️",
    order: 1,
  },
  {
    id: "loc2",
    name: "Royal Palace",
    subtitle: "Royal residence",
    description: "Official residence of the Spanish monarch",
    coordinates: [40.418, -3.7192],
    address: "Calle Bailén",
    icon: "👑",
    order: 2,
  },
  {
    id: "loc3",
    name: "Retiro Park",
    subtitle: "City park",
    description: "Beautiful park in the city center",
    coordinates: [40.4088, -3.6924],
    address: "Calle de Alcalá",
    icon: "🌳",
    order: 3,
  },
];

describe("TravelMap", () => {
  const defaultProps = {
    locations: mockLocations,
  };

  const onLocationClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Client-side rendering", () => {
    it("renders placeholder on server (prevents hydration mismatch)", () => {
      render(<TravelMap {...defaultProps} />);
      expect(screen.getByText("Cargando mapa...")).toBeInTheDocument();
    });

    it("renders MapContainer when mounted on client", async () => {
      render(<TravelMap {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
      });
    });
  });

  describe("Marker rendering", () => {
    it("renders 3 markers for 3 locations", async () => {
      render(<TravelMap {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getAllByTestId("marker")).toHaveLength(3);
      });
    });

    it("markers have correct positions", async () => {
      render(<TravelMap {...defaultProps} />);
      await waitFor(() => {
        const markers = screen.getAllByTestId("marker");
        expect(markers[0]).toHaveAttribute(
          "data-position",
          JSON.stringify([40.4168, -3.7038]),
        );
      });
    });
  });

  describe("Popup rendering", () => {
    it("renders at least one popup", async () => {
      render(<TravelMap {...defaultProps} />);
      await waitFor(() => {
        const popups = screen.getAllByTestId("popup");
        expect(popups.length).toBeGreaterThan(0);
      });
    });

    it("popup contains location name", async () => {
      render(<TravelMap {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText("Plaza Mayor")).toBeInTheDocument();
      });
    });
  });

  describe("Marker click handling", () => {
    it("calls onLocationClick when marker is clicked", async () => {
      render(<TravelMap {...defaultProps} onLocationClick={onLocationClick} />);
      await waitFor(() => {
        const markers = screen.getAllByTestId("marker");
        expect(markers.length).toBe(3);
      });
      const markers = screen.getAllByTestId("marker");
      fireEvent.click(markers[0]);
      expect(onLocationClick).toHaveBeenCalledWith(mockLocations[0]);
    });
  });

  describe("TileLayer", () => {
    it("renders TileLayer with OpenStreetMap attribution", async () => {
      render(<TravelMap {...defaultProps} />);
      await waitFor(() => {
        const tileLayer = screen.getByTestId("tile-layer");
        expect(tileLayer).toBeInTheDocument();
      });
    });
  });
});
