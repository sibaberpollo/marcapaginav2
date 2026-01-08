/**
 * Unit tests for cookies.ts - Cookie-based identity management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock the browser environment
const mockDocument = {
  cookie: "",
};

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockCrypto = {
  randomUUID: vi.fn(),
  getRandomValues: vi.fn(),
};

// Setup browser mocks
Object.defineProperty(window, "document", {
  value: mockDocument,
  writable: true,
});

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(window, "crypto", {
  value: mockCrypto,
  writable: true,
});

// Import after mocks are set up
import {
  generateUuid,
  getAnonymousId,
  setAnonymousId,
  trackSession,
  getSessionHistory,
  clearSessionHistory,
  getAnonymousIdentity,
} from "@/lib/cookies";

describe("Cookie Utilities", () => {
  beforeEach(() => {
    // Reset mocks
    mockDocument.cookie = "";
    vi.clearAllMocks();

    // Reset crypto mocks
    mockCrypto.randomUUID.mockReturnValue(
      "12345678-1234-4123-8123-123456789012",
    );
    mockCrypto.getRandomValues.mockImplementation((array: Uint8Array) => {
      // Fill with predictable values for UUID generation
      for (let i = 0; i < array.length; i++) {
        array[i] = i % 256;
      }
    });

    // Reset localStorage mocks
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});
    mockLocalStorage.removeItem.mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up any cookies that might have been set
    mockDocument.cookie = "";
  });

  describe("generateUuid()", () => {
    it("should generate valid UUID v4 format", () => {
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should use crypto.randomUUID when available", () => {
      mockCrypto.randomUUID.mockReturnValue(
        "87654321-4321-4123-8123-210987654321",
      );
      const uuid = generateUuid();
      expect(uuid).toBe("87654321-4321-4123-8123-210987654321");
      expect(mockCrypto.randomUUID).toHaveBeenCalled();
    });

    it("should fallback to crypto.getRandomValues when randomUUID unavailable", () => {
      mockCrypto.randomUUID.mockReturnValue(undefined);
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(mockCrypto.getRandomValues).toHaveBeenCalled();
    });

    it("should fallback to Math.random when crypto unavailable", () => {
      // Temporarily remove crypto
      const originalCrypto = global.crypto;
      delete (global as any).crypto;

      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      // Restore crypto
      global.crypto = originalCrypto;
    });

    it("should generate unique UUIDs on consecutive calls", () => {
      const uuid1 = generateUuid();
      const uuid2 = generateUuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("getAnonymousId()", () => {
    it("should generate new UUID when no cookie exists", () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const id = getAnonymousId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(mockDocument.cookie).toContain("cadavre_anon_id=");
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "cadavre_anon_id",
        id,
      );
    });

    it("should return existing cookie value when valid", () => {
      const existingId = "87654321-4321-4123-8123-210987654321";
      mockDocument.cookie = `cadavre_anon_id=${existingId}; path=/; max-age=2592000`;

      const id = getAnonymousId();
      expect(id).toBe(existingId);
      expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
    });

    it("should sync LocalStorage to cookie when cookie missing but LocalStorage has valid ID", () => {
      const localStorageId = "abcd1234-5678-4123-8123-abcdef123456";
      mockLocalStorage.getItem.mockReturnValue(localStorageId);

      const id = getAnonymousId();
      expect(id).toBe(localStorageId);
      expect(mockDocument.cookie).toContain(
        `cadavre_anon_id=${localStorageId}`,
      );
    });

    it("should generate new ID when both cookie and LocalStorage are invalid", () => {
      mockDocument.cookie = "cadavre_anon_id=invalid-uuid; path=/";
      mockLocalStorage.getItem.mockReturnValue("also-invalid");

      const id = getAnonymousId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should handle LocalStorage errors gracefully", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("LocalStorage disabled");
      });

      const id = getAnonymousId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should handle malformed cookie data", () => {
      mockDocument.cookie = "cadavre_anon_id=not-a-uuid-at-all; path=/";
      mockLocalStorage.getItem.mockReturnValue(null);

      const id = getAnonymousId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe("setAnonymousId()", () => {
    it("should set valid UUID in both cookie and LocalStorage", () => {
      const testId = "abcd1234-5678-4123-8123-abcdef123456";
      setAnonymousId(testId);

      expect(mockDocument.cookie).toContain(`cadavre_anon_id=${testId}`);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "cadavre_anon_id",
        testId,
      );
    });

    it("should reject invalid UUID format", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      setAnonymousId("not-a-uuid");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Invalid UUID passed to setAnonymousId:",
        "not-a-uuid",
      );
      expect(mockDocument.cookie).not.toContain("cadavre_anon_id=not-a-uuid");

      consoleSpy.mockRestore();
    });

    it("should handle LocalStorage errors gracefully", () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("LocalStorage full");
      });

      const testId = "abcd1234-5678-4123-8123-abcdef123456";
      expect(() => setAnonymousId(testId)).not.toThrow();
      expect(mockDocument.cookie).toContain(`cadavre_anon_id=${testId}`);
    });

    it("should handle empty UUID string", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      setAnonymousId("");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("trackSession()", () => {
    it("should add new session to history", () => {
      trackSession("session-123", "contributor");

      expect(mockDocument.cookie).toContain("cadavre_sessions=");
      const cookieCall = mockLocalStorage.setItem.mock.calls.find(
        (call) => call[0] === "cadavre_sessions",
      );
      expect(cookieCall).toBeDefined();

      const storedData = JSON.parse(cookieCall![1]);
      expect(storedData).toHaveLength(1);
      expect(storedData[0]).toEqual({
        sessionId: "session-123",
        role: "contributor",
        joinedAt: expect.any(String),
      });
    });

    it("should update existing session role if different", () => {
      // First track as contributor
      trackSession("session-123", "contributor");

      // Then track as observer
      trackSession("session-123", "observer");

      const cookieCall = vi
        .mocked(mockLocalStorage.setItem)
        .mock.calls.find((call) => call[0] === "cadavre_sessions");
      const storedData = JSON.parse(cookieCall![1]);
      expect(storedData).toHaveLength(1);
      expect(storedData[0].role).toBe("observer");
    });

    it("should handle multiple sessions", () => {
      trackSession("session-1", "contributor");
      trackSession("session-2", "observer");
      trackSession("session-3", "contributor");

      const cookieCall = vi
        .mocked(mockLocalStorage.setItem)
        .mock.calls.find((call) => call[0] === "cadavre_sessions");
      const storedData = JSON.parse(cookieCall![1]);
      expect(storedData).toHaveLength(3);
      expect(storedData.map((s: any) => s.sessionId)).toEqual([
        "session-1",
        "session-2",
        "session-3",
      ]);
    });

    it("should handle LocalStorage errors gracefully", () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage full");
      });

      expect(() => trackSession("session-123", "contributor")).not.toThrow();
      expect(mockDocument.cookie).toContain("cadavre_sessions=");
    });

    it("should handle malformed existing cookie data", () => {
      mockDocument.cookie = "cadavre_sessions=invalid-json; path=/";

      expect(() => trackSession("session-123", "contributor")).not.toThrow();

      const cookieCall = vi
        .mocked(mockLocalStorage.setItem)
        .mock.calls.find((call) => call[0] === "cadavre_sessions");
      const storedData = JSON.parse(cookieCall![1]);
      expect(storedData).toHaveLength(1);
    });
  });

  describe("getSessionHistory()", () => {
    it("should return empty array when no sessions exist", () => {
      const history = getSessionHistory();
      expect(history).toEqual([]);
    });

    it("should filter out sessions older than 30 days", () => {
      const now = new Date();
      const thirtyOneDaysAgo = new Date(
        now.getTime() - 31 * 24 * 60 * 60 * 1000,
      );

      const mockSessions = [
        {
          sessionId: "recent",
          role: "contributor",
          joinedAt: now.toISOString(),
        },
        {
          sessionId: "old",
          role: "observer",
          joinedAt: thirtyOneDaysAgo.toISOString(),
        },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));

      const history = getSessionHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sessionId).toBe("recent");
    });

    it("should sort sessions by most recent first", () => {
      const mockSessions = [
        {
          sessionId: "older",
          role: "contributor",
          joinedAt: "2024-01-10T10:00:00Z",
        },
        {
          sessionId: "newer",
          role: "observer",
          joinedAt: "2024-01-15T10:00:00Z",
        },
        {
          sessionId: "middle",
          role: "contributor",
          joinedAt: "2024-01-12T10:00:00Z",
        },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));

      const history = getSessionHistory();
      expect(history.map((h) => h.sessionId)).toEqual([
        "newer",
        "middle",
        "older",
      ]);
    });

    it("should fallback to LocalStorage when cookie is empty", () => {
      const mockSessions = [
        {
          sessionId: "session-1",
          role: "contributor",
          joinedAt: "2024-01-15T10:00:00Z",
        },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));

      const history = getSessionHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sessionId).toBe("session-1");
    });

    it("should filter out sessions older than 30 days", () => {
      const now = new Date();
      const thirtyOneDaysAgo = new Date(
        now.getTime() - 31 * 24 * 60 * 60 * 1000,
      );

      const mockSessions = [
        {
          sessionId: "recent",
          role: "contributor",
          joinedAt: now.toISOString(),
        },
        {
          sessionId: "old",
          role: "observer",
          joinedAt: thirtyOneDaysAgo.toISOString(),
        },
      ];
      mockDocument.cookie = `cadavre_sessions=${JSON.stringify(mockSessions)}; path=/`;

      const history = getSessionHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sessionId).toBe("recent");
    });

    it("should sort sessions by most recent first", () => {
      const mockSessions = [
        {
          sessionId: "older",
          role: "contributor",
          joinedAt: "2024-01-10T10:00:00Z",
        },
        {
          sessionId: "newer",
          role: "observer",
          joinedAt: "2024-01-15T10:00:00Z",
        },
        {
          sessionId: "middle",
          role: "contributor",
          joinedAt: "2024-01-12T10:00:00Z",
        },
      ];
      mockDocument.cookie = `cadavre_sessions=${JSON.stringify(mockSessions)}; path=/`;

      const history = getSessionHistory();
      expect(history.map((h) => h.sessionId)).toEqual([
        "newer",
        "middle",
        "older",
      ]);
    });

    it("should handle malformed cookie data", () => {
      mockDocument.cookie = "cadavre_sessions=not-json; path=/";
      mockLocalStorage.getItem.mockReturnValue(null);

      const history = getSessionHistory();
      expect(history).toEqual([]);
    });

    it("should handle malformed LocalStorage data", () => {
      mockDocument.cookie = "";
      mockLocalStorage.getItem.mockReturnValue("also-not-json");

      const history = getSessionHistory();
      expect(history).toEqual([]);
    });
  });

  describe("clearSessionHistory()", () => {
    it("should clear both cookie and LocalStorage", () => {
      clearSessionHistory();

      expect(mockDocument.cookie).toContain("cadavre_sessions=; max-age=0");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        "cadavre_sessions",
      );
    });

    it("should handle LocalStorage errors gracefully", () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      expect(() => clearSessionHistory()).not.toThrow();
      expect(mockDocument.cookie).toContain("cadavre_sessions=; max-age=0");
    });
  });

  describe("getAnonymousIdentity()", () => {
    it("should return anonymous identity with ID", () => {
      mockLocalStorage.getItem.mockReturnValue("user-123");

      const identity = getAnonymousIdentity();
      expect(identity.id).toBe("user-123");
      expect(identity.createdAt).toBeInstanceOf(Date);
      expect(identity.lastSeenAt).toBeInstanceOf(Date);
    });

    it("should handle empty session history", () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "cadavre_anon_id") return "user-123";
        return null;
      });

      const identity = getAnonymousIdentity();
      expect(identity.sessions).toEqual([]);
    });
  });
});
