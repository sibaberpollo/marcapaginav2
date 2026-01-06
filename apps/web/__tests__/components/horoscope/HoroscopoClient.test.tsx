import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import HoroscopoClient from "@/components/horoscope/HoroscopoClient";
import { horoscopoData } from "@/lib/horoscope-data";
import type { ImplementedSignSlug } from "@/lib/types/horoscope";

// Type-safe accessor for horoscopoData
const getHoroscopoData = (sign: ImplementedSignSlug) => {
  return horoscopoData[sign];
};

describe("HoroscopoClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Hero Section - Author Rendering", () => {
    it("renders author name in heading for sagitario", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const data = getHoroscopoData("sagitario");
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        data.author,
      );
    });

    it("renders author name in heading for leo", () => {
      render(<HoroscopoClient signo="leo" />);
      const data = getHoroscopoData("leo");
      // Check heading specifically (not alt text which also contains the name)
      const headings = screen.getAllByRole("heading", { level: 1 });
      expect(headings[0]).toHaveTextContent(data.author);
    });

    it("renders author name in heading for cancer", () => {
      render(<HoroscopoClient signo="cancer" />);
      const data = getHoroscopoData("cancer");
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        data.author,
      );
    });

    it("renders author image with correct alt text", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const data = getHoroscopoData("sagitario");
      const authorImage = screen.getByAltText(data.author);
      expect(authorImage).toBeInTheDocument();
      expect(authorImage).toHaveAttribute("src", data.authorImage);
    });

    it("renders description text", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const data = getHoroscopoData("sagitario");
      expect(screen.getByText(data.description)).toBeInTheDocument();
    });

    it("renders author name in heading for leo", () => {
      render(<HoroscopoClient signo="leo" />);
      const authorName = horoscopoData.leo.author;
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        authorName,
      );
    });

    it("renders author name in heading for cancer", () => {
      render(<HoroscopoClient signo="cancer" />);
      const authorName = horoscopoData.cancer.author;
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        authorName,
      );
    });

    it("renders author image with correct alt text", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const authorImage = screen.getByAltText(horoscopoData.sagitario.author);
      expect(authorImage).toBeInTheDocument();
      expect(authorImage).toHaveAttribute(
        "src",
        horoscopoData.sagitario.authorImage,
      );
    });

    it("renders description text", () => {
      render(<HoroscopoClient signo="sagitario" />);
      expect(
        screen.getByText(horoscopoData.sagitario.description),
      ).toBeInTheDocument();
    });

    it("renders sign label with display name", () => {
      render(<HoroscopoClient signo="sagitario" />);
      expect(screen.getByText(/Signo:/)).toBeInTheDocument();
    });
  });

  describe("Efemerides Section", () => {
    it("renders efemerides scroll container", () => {
      render(<HoroscopoClient signo="sagitario" />);
      expect(screen.getByTestId("efemerides-scroll")).toBeInTheDocument();
    });

    it("renders all efemeride cards", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const efemerideCards = screen.getAllByTestId("efemeride-card");
      expect(efemerideCards.length).toBe(
        horoscopoData.sagitario.efemerides.length,
      );
    });

    it("renders efemeride dates", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const efemerides = horoscopoData.sagitario.efemerides;
      efemerides.forEach((efemeride) => {
        expect(screen.getByText(efemeride.date)).toBeInTheDocument();
      });
    });

    it("renders efemeride titles", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const efemerides = horoscopoData.sagitario.efemerides;
      efemerides.forEach((efemeride) => {
        expect(screen.getByText(efemeride.title)).toBeInTheDocument();
      });
    });

    it("renders efemeride descriptions", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const efemerides = horoscopoData.sagitario.efemerides;
      efemerides.forEach((efemeride) => {
        expect(screen.getByText(efemeride.description)).toBeInTheDocument();
      });
    });

    it("renders correct number of efemerides for leo", () => {
      render(<HoroscopoClient signo="leo" />);
      const efemerideCards = screen.getAllByTestId("efemeride-card");
      expect(efemerideCards.length).toBe(horoscopoData.leo.efemerides.length);
    });
  });

  describe("Current Sign Card", () => {
    it("renders current sign name", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // The sign name appears in the card
      expect(screen.getByText("Sagitario")).toBeInTheDocument();
    });

    it("renders current sign zodiac image or symbol", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // Either zodiac image or symbol should be present
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(1); // Author image + zodiac images
    });

    it("renders literary text for current sign", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // The literary text should appear in the current sign card
      const paragraphs = screen.getAllByRole("paragraph");
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  describe("Other Signs Grid", () => {
    it("renders all zodiac signs except current in grid", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // Should have 11 other signs in the grid
      const signNames = [
        "Aries",
        "Tauro",
        "Géminis",
        "Cáncer",
        "Leo",
        "Virgo",
        "Libra",
        "Escorpio",
        "Capricornio",
        "Acuario",
        "Piscis",
      ];
      signNames.forEach((signName) => {
        expect(screen.getByText(signName)).toBeInTheDocument();
      });
    });

    it("does not render current sign in other signs grid", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // Sagitario should only appear once (in current sign card, not in grid)
      const sagitarioOccurrences = screen.getAllByText("Sagitario");
      expect(sagitarioOccurrences.length).toBe(1);
    });

    it("renders 'Ver archivo' for implemented signs", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // Cancer, Leo, Virgo, Libra, Escorpio should show "Ver archivo"
      const verArchivoLinks = screen.getAllByText(/Ver archivo/);
      expect(verArchivoLinks.length).toBe(5);
    });

    it("has correct href links for implemented signs", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const links = screen.getAllByRole("link");
      const implementedSignLinks = links.filter((link) =>
        [
          "/horoscopo/cancer",
          "/horoscopo/leo",
          "/horoscopo/virgo",
          "/horoscopo/libra",
          "/horoscopo/escorpio",
        ].includes(link.getAttribute("href") || ""),
      );
      expect(implementedSignLinks.length).toBe(5);
    });

    it("future sign cards are not clickable (no link wrapper)", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // Future signs (aries, tauro, geminis, capricornio, acuario, piscis) have no links
      // They are rendered as static cards, not wrapped in <a> tags
      const links = screen.getAllByRole("link");
      const futureSignLinks = links.filter((link) =>
        ["aries", "tauro", "geminis", "capricornio", "acuario", "piscis"].some(
          (slug) => link.getAttribute("href")?.includes(slug),
        ),
      );
      expect(futureSignLinks.length).toBe(0);
    });
  });

  describe("Writers Section", () => {
    it("renders writers for leo", () => {
      render(<HoroscopoClient signo="leo" />);
      // Find the writers section - the heading text "Escritores Leo" is split into two text nodes
      const writersHeading = screen.getByRole("heading", {
        name: /Escritores/,
      });
      expect(writersHeading).toBeInTheDocument();

      // leo has writers defined
      const leoWriters = horoscopoData.leo.writers;
      expect(leoWriters).toBeDefined();
      if (leoWriters) {
        // Find writers in the writers grid (the div that follows the heading's parent div)
        const writersGrid = writersHeading.closest("div")?.nextElementSibling;
        expect(writersGrid).not.toBeNull();

        if (writersGrid) {
          // Query within the writers grid - cast to HTMLElement for within()
          const writersInGrid = within(writersGrid as HTMLElement).getAllByRole(
            "paragraph",
          );
          expect(writersInGrid.length).toBe(leoWriters.length);

          // Check a few specific writers exist in the grid
          const writerTexts = writersInGrid.map((p) => p.textContent);
          expect(writerTexts).toContain("H.P. Lovecraft");
          expect(writerTexts).toContain("Ray Bradbury");
          expect(writerTexts).toContain("Emily Brontë");
        }
      }
    });

    it("does not render writers section when undefined", () => {
      render(<HoroscopoClient signo="cancer" />);
      expect(screen.queryByText(/Escritores/)).not.toBeInTheDocument();
    });
  });

  describe("All Sign Variations", () => {
    const signs: ImplementedSignSlug[] = [
      "cancer",
      "leo",
      "virgo",
      "libra",
      "escorpio",
      "sagitario",
    ];

    signs.forEach((sign) => {
      it(`renders correctly for ${sign}`, () => {
        render(<HoroscopoClient signo={sign} />);
        const data = horoscopoData[sign];
        // Should render heading with author name
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          data.author,
        );
        // Should render author image
        expect(screen.getByAltText(data.author)).toBeInTheDocument();
        // Should render description
        expect(screen.getByText(data.description)).toBeInTheDocument();
        // Should render efemerides
        const efemerideCards = screen.getAllByTestId("efemeride-card");
        expect(efemerideCards.length).toBe(data.efemerides.length);
      });
    });
  });

  describe("Default Props", () => {
    it("uses sagitario as default sign", () => {
      render(<HoroscopoClient />);
      // Should render sagitario data
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        horoscopoData.sagitario.author,
      );
    });
  });

  describe("Sign Display Names", () => {
    it("displays correct sign name for cancer (Cáncer with accent)", () => {
      render(<HoroscopoClient signo="cancer" />);
      expect(screen.getByText("Cáncer")).toBeInTheDocument();
    });

    it("displays correct sign name for virgo", () => {
      render(<HoroscopoClient signo="virgo" />);
      expect(screen.getByText("Virgo")).toBeInTheDocument();
    });

    it("displays correct sign name for escorpio", () => {
      render(<HoroscopoClient signo="escorpio" />);
      expect(screen.getByText("Escorpio")).toBeInTheDocument();
    });

    it("displays correct sign name for géminis (with accent)", () => {
      render(<HoroscopoClient signo="sagitario" />);
      // Géminis should appear in the other signs grid
      expect(screen.getByText("Géminis")).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("has links to all implemented sign pages", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const links = screen.getAllByRole("link");
      const horoscopoLinks = links.filter((link) =>
        link.getAttribute("href")?.startsWith("/horoscopo/"),
      );
      expect(horoscopoLinks.length).toBe(5); // Cancer, Leo, Virgo, Libra, Escorpio
    });
  });

  describe("Component Structure", () => {
    it("renders heading elements", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(2); // At least: author name, "Efemérides", sign names
    });

    it("renders link elements", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("renders image elements", () => {
      render(<HoroscopoClient signo="sagitario" />);
      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(1); // Author + zodiac images
    });
  });
});
