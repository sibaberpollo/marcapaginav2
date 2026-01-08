/**
 * Unit tests for links.ts - Link generation and parsing utilities
 */

import { describe, it, expect } from "vitest";
import type { NextRequest } from "next/server";

import {
  SESSION_PATH,
  CONTRIBUTOR_TYPE,
  OBSERVER_TYPE,
  getBaseUrl,
  buildContributorLink,
  buildObserverLink,
  buildSessionLinks,
  parseSessionUrl,
  isLinkType,
  type LinkType,
} from "@/lib/links";

// Mock NextRequest
const createMockRequest = (headers: Record<string, string>): NextRequest => {
  const mockHeaders = new Map(Object.entries(headers));
  return {
    headers: {
      get: (key: string) => mockHeaders.get(key) || null,
    },
  } as NextRequest;
};

describe("Link Utilities", () => {
  describe("Constants", () => {
    it("should export correct path constants", () => {
      expect(SESSION_PATH).toBe("/session");
      expect(CONTRIBUTOR_TYPE).toBe("contributor");
      expect(OBSERVER_TYPE).toBe("observer");
    });
  });

  describe("getBaseUrl()", () => {
    it("should return localhost:3001 when no request provided", () => {
      const baseUrl = getBaseUrl();
      expect(baseUrl).toBe("http://localhost:3001");
    });

    it("should use X-Forwarded-Host header when available", () => {
      const request = createMockRequest({
        "x-forwarded-host": "example.com",
        "x-forwarded-proto": "https",
      });

      const baseUrl = getBaseUrl(request);
      expect(baseUrl).toBe("https://example.com");
    });

    it("should use Host header when X-Forwarded-Host not available", () => {
      const request = createMockRequest({
        host: "myapp.com",
      });

      const baseUrl = getBaseUrl(request);
      expect(baseUrl).toBe("https://myapp.com");
    });
  });

  describe("buildContributorLink()", () => {
    it("should build correct contributor link URL", () => {
      const url = buildContributorLink("abc12345", "token123456789012");
      expect(url).toBe(
        "http://localhost:3001/session/abc12345/contributor/token123456789012",
      );
    });

    it("should use custom base URL from request", () => {
      const request = createMockRequest({
        host: "myapp.com",
      });

      const url = buildContributorLink("session1", "token1234567890", request);
      expect(url).toBe(
        "https://myapp.com/session/session1/contributor/token1234567890",
      );
    });
  });

  describe("buildObserverLink()", () => {
    it("should build correct observer link URL", () => {
      const url = buildObserverLink("xyz98765", "obsToken1234567890");
      expect(url).toBe(
        "http://localhost:3001/session/xyz98765/observer/obsToken1234567890",
      );
    });
  });

  describe("buildSessionLinks()", () => {
    it("should build both contributor and observer links", () => {
      const links = buildSessionLinks(
        "session1",
        "contribToken12345",
        "obsToken1234567890",
      );

      expect(links).toEqual({
        contributor:
          "http://localhost:3001/session/session1/contributor/contribToken12345",
        observer:
          "http://localhost:3001/session/session1/observer/obsToken1234567890",
      });
    });
  });

  describe("parseSessionUrl()", () => {
    it("should parse valid contributor URL correctly", () => {
      const result = parseSessionUrl(
        "/session/abc12345/contributor/token12345678901",
      );

      expect(result).toEqual({
        sessionId: "abc12345",
        linkType: "contributor",
        token: "token12345678901",
      });
    });

    it("should parse valid observer URL correctly", () => {
      const result = parseSessionUrl(
        "/session/xyz98765/observer/obsToken12345678",
      );

      expect(result).toEqual({
        sessionId: "xyz98765",
        linkType: "observer",
        token: "obsToken12345678",
      });
    });

    it("should return null for invalid URL format", () => {
      const invalidUrls = [
        "/session/abc12345/contributor", // Missing token
        "/session/abc12345/contributor/token123", // Token too short
        "/session/abc123/contributor/token1234567890123456", // Session ID too short
        "/session/abc12345/unknown/token1234567890123456", // Invalid link type
        "/other/path/abc12345/contributor/token1234567890123456", // Wrong path
        "session/abc12345/contributor/token1234567890123456", // Missing leading slash
      ];

      invalidUrls.forEach((url) => {
        const result = parseSessionUrl(url);
        expect(result).toBeNull();
      });
    });
  });

  describe("isLinkType()", () => {
    it("should return true for valid link types", () => {
      expect(isLinkType("contributor")).toBe(true);
      expect(isLinkType("observer")).toBe(true);
    });

    it("should return false for invalid values", () => {
      expect(isLinkType("admin")).toBe(false);
      expect(isLinkType("moderator")).toBe(false);
      expect(isLinkType("")).toBe(false);
      expect(isLinkType(null)).toBe(false);
      expect(isLinkType(undefined)).toBe(false);
    });
  });
});
