import { describe, expect, it } from "vitest";
import type {
  ZodiacSign,
  HoroscopoData,
  SignSlug,
  ImplementedSignSlug,
} from "../../src/lib/types/horoscope";
import {
  zodiacSigns,
  literaryHoroscopesCancer,
  literaryHoroscopesLeo,
  literaryHoroscopesVirgo,
  literaryHoroscopesLibra,
  literaryHoroscopesEscorpio,
  literaryHoroscopesSagitario,
  literaryHoroscopesCapricornio,
  getLiteraryTexts,
  getSignLink,
  implementedSigns,
  signDisplayNames,
} from "../../src/lib/horoscope-data";

describe("lib/types/horoscope.ts", () => {
  describe("ZodiacSign interface", () => {
    it("has all required properties (name, date, slug, symbol, image)", () => {
      const sign: ZodiacSign = {
        name: "Aries",
        date: "MAR 21-ABR 19",
        slug: "aries",
        symbol: "♈",
        image: "/static/images/horoscope/aries.png",
      };

      expect(sign).toHaveProperty("name");
      expect(sign).toHaveProperty("date");
      expect(sign).toHaveProperty("slug");
      expect(sign).toHaveProperty("symbol");
      expect(sign).toHaveProperty("image");
      expect(typeof sign.name).toBe("string");
      expect(typeof sign.date).toBe("string");
      expect(typeof sign.slug).toBe("string");
      expect(typeof sign.symbol).toBe("string");
      expect(typeof sign.image).toBe("string");
    });
  });

  describe("ImplementedSignSlug union", () => {
    it("contains exactly 6 signs (cancer, leo, virgo, libra, escorpio, sagitario)", () => {
      const expectedSigns: ImplementedSignSlug[] = [
        "cancer",
        "leo",
        "virgo",
        "libra",
        "escorpio",
        "sagitario",
        "capricornio",
      ];

      expect(implementedSigns).toHaveLength(7);
      for (const sign of expectedSigns) {
        expect(implementedSigns).toContain(sign);
      }
    });
  });

  describe("HoroscopoData interface", () => {
    it("has author, authorImage, description, efemerides, writers", () => {
      const data: HoroscopoData = {
        author: "Test Author",
        authorImage: "https://example.com/author.png",
        authorCredit: "Test Credit",
        authorSlug: "test-author",
        description: "Test description",
        efemerides: [
          {
            date: "1 de enero",
            title: "Test Event",
            description: "Test description",
            color: "from-red-50 to-orange-50",
            borderColor: "border-red-100",
            textColor: "text-red-600",
          },
        ],
        writers: ["Writer 1", "Writer 2"],
      };

      expect(data).toHaveProperty("author");
      expect(data).toHaveProperty("authorImage");
      expect(data).toHaveProperty("description");
      expect(data).toHaveProperty("efemerides");
      expect(data).toHaveProperty("writers");
      expect(Array.isArray(data.efemerides)).toBe(true);
    });
  });

  describe("SignSlug type", () => {
    it("covers all 12 zodiac signs", () => {
      const allSigns: SignSlug[] = [
        "aries",
        "tauro",
        "geminis",
        "cancer",
        "leo",
        "virgo",
        "libra",
        "escorpio",
        "sagitario",
        "capricornio",
        "acuario",
        "piscis",
      ];

      expect(allSigns).toHaveLength(12);
    });
  });
});

describe("lib/horoscope-data.ts", () => {
  describe("zodiacSigns array", () => {
    it("contains all 12 signs with unique slugs", () => {
      expect(zodiacSigns).toHaveLength(12);
      const slugs = zodiacSigns.map((sign) => sign.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(12);
    });

    it("all 12 signs have valid image paths", () => {
      for (const sign of zodiacSigns) {
        expect(sign.image).toMatch(/^\/static\/images\/horoscope\/.+\.png$/);
      }
    });
  });

  describe("implementedSigns array", () => {
    it("contains exactly 7 signs with valid slugs", () => {
      expect(implementedSigns).toHaveLength(7);
      for (const sign of implementedSigns) {
        expect(sign).toMatch(
          /^(cancer|leo|virgo|libra|escorpio|sagitario|capricornio)$/,
        );
      }
    });
  });

  describe("signDisplayNames", () => {
    it("has Spanish names for all 6 implemented signs with proper accents", () => {
      const expectedDisplayNames: Record<ImplementedSignSlug, string> = {
        cancer: "Cáncer",
        leo: "Leo",
        virgo: "Virgo",
        libra: "Libra",
        escorpio: "Escorpio",
        sagitario: "Sagitario",
        capricornio: "Capricornio",
      };

      for (const [slug, name] of Object.entries(expectedDisplayNames)) {
        expect(signDisplayNames[slug as ImplementedSignSlug]).toBe(name);
      }
    });
  });

  describe("getLiteraryTexts", () => {
    it("returns object with all 12 signs as keys", () => {
      const allSignSlugs: SignSlug[] = [
        "aries",
        "tauro",
        "geminis",
        "cancer",
        "leo",
        "virgo",
        "libra",
        "escorpio",
        "sagitario",
        "capricornio",
        "acuario",
        "piscis",
      ];

      const result = getLiteraryTexts("cancer");
      for (const sign of allSignSlugs) {
        expect(result).toHaveProperty(sign);
        expect(result[sign]).toHaveProperty("text");
      }
    });

    it("for cancer returns literaryHoroscopesCancer", () => {
      const result = getLiteraryTexts("cancer");
      expect(result).toBe(literaryHoroscopesCancer);
    });

    it("for leo returns literaryHoroscopesLeo", () => {
      const result = getLiteraryTexts("leo");
      expect(result).toBe(literaryHoroscopesLeo);
    });
  });

  describe("getSignLink", () => {
    it("returns /horoscopo for capricornio", () => {
      expect(getSignLink("capricornio")).toBe("/horoscopo");
    });

    it("returns /horoscopo/{sign} for implemented signs", () => {
      expect(getSignLink("cancer")).toBe("/horoscopo/cancer");
      expect(getSignLink("leo")).toBe("/horoscopo/leo");
      expect(getSignLink("virgo")).toBe("/horoscopo/virgo");
      expect(getSignLink("libra")).toBe("/horoscopo/libra");
      expect(getSignLink("escorpio")).toBe("/horoscopo/escorpio");
      expect(getSignLink("sagitario")).toBe("/horoscopo/sagitario");
    });

    it("returns # for future signs", () => {
      const futureSigns: SignSlug[] = [
        "aries",
        "tauro",
        "geminis",
        "acuario",
        "piscis",
      ];
      for (const sign of futureSigns) {
        expect(getSignLink(sign)).toBe("#");
      }
    });
  });

  describe("literaryHoroscopes content", () => {
    it("have text property with meaningful content (length > 50 chars)", () => {
      const allLiteraryTexts = [
        literaryHoroscopesCancer,
        literaryHoroscopesLeo,
        literaryHoroscopesVirgo,
        literaryHoroscopesLibra,
        literaryHoroscopesEscorpio,
        literaryHoroscopesSagitario,
        literaryHoroscopesCapricornio,
      ];

      for (const literaryTexts of allLiteraryTexts) {
        for (const sign in literaryTexts) {
          const text = literaryTexts[sign as keyof typeof literaryTexts].text;
          expect(text.length).toBeGreaterThan(50);
        }
      }
    });
  });
});
