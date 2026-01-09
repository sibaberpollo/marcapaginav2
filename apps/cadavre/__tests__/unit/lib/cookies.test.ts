/**
 * Unit tests for cookies.ts - Cookie-based identity management
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Fresh data stores for each test run
let cookieStore: Map<string, string>;
let localStorageData: Map<string, string>;

// Mock functions
let mockGetItem: ReturnType<typeof vi.fn>;
let mockSetItem: ReturnType<typeof vi.fn>;
let mockRemoveItem: ReturnType<typeof vi.fn>;
let mockRandomUUID: ReturnType<typeof vi.fn>;
let mockGetRandomValues: ReturnType<typeof vi.fn>;

describe("Cookie Utilities", () => {
  beforeEach(() => {
    // Create fresh data stores for each test
    cookieStore = new Map<string, string>();
    localStorageData = new Map<string, string>();

    // Create fresh mock functions
    mockGetItem = vi.fn((key: string): string | null => {
      return localStorageData.get(key) ?? null;
    });
    mockSetItem = vi.fn((key: string, value: string): void => {
      localStorageData.set(key, value);
    });
    mockRemoveItem = vi.fn((key: string): void => {
      localStorageData.delete(key);
    });
    mockRandomUUID = vi.fn(() => "12345678-1234-4123-8123-123456789012");
    mockGetRandomValues = vi.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = i % 256;
      }
      return array;
    });

    // Setup browser mocks
    Object.defineProperty(window, "document", {
      value: {
        get cookie() {
          const entries: string[] = [];
          cookieStore.forEach((value, key) => {
            entries.push(`${key}=${value}`);
          });
          return entries.join("; ");
        },
        set cookie(value: string) {
          const pairs = value
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);
          for (const pair of pairs) {
            const [key, ...valueParts] = pair.split("=");
            const cookieValue = valueParts.join("=");
            if (key) {
              cookieStore.set(key, cookieValue);
            }
          }
        },
      },
      writable: true,
    });

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: () => {
          localStorageData.clear();
        },
      },
      writable: true,
    });

    Object.defineProperty(window, "crypto", {
      value: {
        randomUUID: mockRandomUUID,
        getRandomValues: mockGetRandomValues,
      },
      writable: true,
    });
  });

  describe("generateUuid()", () => {
    it("should generate valid UUID v4 format", async () => {
      const { generateUuid } = await import("@/lib/cookies");
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("should use crypto.randomUUID when available", async () => {
      mockRandomUUID.mockReturnValue("87654321-4321-4123-8123-210987654321");
      const { generateUuid } = await import("@/lib/cookies");
      const uuid = generateUuid();
      expect(uuid).toBe("87654321-4321-4123-8123-210987654321");
      expect(mockRandomUUID).toHaveBeenCalled();
    });

    it("should fallback to crypto.getRandomValues when randomUUID unavailable", async () => {
      mockRandomUUID.mockReturnValue(undefined);
      const { generateUuid } = await import("@/lib/cookies");
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(mockGetRandomValues).toHaveBeenCalled();
    });

    it("should fallback to Math.random when crypto unavailable", async () => {
      const originalCrypto = global.crypto;
      delete (global as any).crypto;

      const { generateUuid } = await import("@/lib/cookies");
      const uuid = generateUuid();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      global.crypto = originalCrypto;
    });

    it("should generate unique UUIDs on consecutive calls", async () => {
      mockRandomUUID.mockReturnValue(undefined);
      let callCount = 0;
      mockGetRandomValues.mockImplementation((array: Uint8Array) => {
        callCount++;
        for (let i = 0; i < array.length; i++) {
          array[i] = (i + callCount * 17) % 256;
        }
        return array;
      });
      const { generateUuid } = await import("@/lib/cookies");
      const uuid1 = generateUuid();
      const uuid2 = generateUuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("getAnonymousId()", () => {
    it("should generate new UUID when no cookie exists", async () => {
      const { getAnonymousId } = await import("@/lib/cookies");
      const id = getAnonymousId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(mockSetItem).toHaveBeenCalledWith("cadavre_anon_id", id);
    });

    it("should return existing cookie value when valid", async () => {
      const existingId = "87654321-4321-4123-8123-210987654321";
      cookieStore.set("cadavre_anon_id", existingId);
      const { getAnonymousId } = await import("@/lib/cookies");
      const id = getAnonymousId();
      expect(id).toBe(existingId);
    });

    it("should sync LocalStorage to cookie when cookie missing but LocalStorage has valid ID", async () => {
      const localStorageId = "abcd1234-5678-4123-8123-abcdef123456";
      mockGetItem.mockReturnValue(localStorageId);
      const { getAnonymousId } = await import("@/lib/cookies");
      const id = getAnonymousId();
      expect(id).toBe(localStorageId);
    });

    it("should generate new ID when both cookie and LocalStorage are invalid", async () => {
      cookieStore.set("cadavre_anon_id", "invalid-uuid");
      mockGetItem.mockReturnValue("also-invalid");
      const { getAnonymousId } = await import("@/lib/cookies");
      const id = getAnonymousId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe("trackSession()", () => {
    it("should add new session to history", async () => {
      const { trackSession } = await import("@/lib/cookies");
      trackSession("session-123", "contributor");

      const cookieCall = mockSetItem.mock.calls.find(
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

    it("should handle multiple sessions", async () => {
      const { trackSession } = await import("@/lib/cookies");
      trackSession("session-1", "contributor");
      trackSession("session-2", "observer");
      trackSession("session-3", "contributor");

      const sessionCalls = mockSetItem.mock.calls.filter(
        (call) => call[0] === "cadavre_sessions",
      );
      const lastCall = sessionCalls[sessionCalls.length - 1];
      const storedData = JSON.parse(lastCall[1]);
      expect(storedData).toHaveLength(3);
      expect(storedData.map((s: any) => s.sessionId)).toEqual([
        "session-1",
        "session-2",
        "session-3",
      ]);
    });

    it("should handle malformed existing cookie data", async () => {
      mockGetItem.mockReturnValue("invalid-json");
      const { trackSession } = await import("@/lib/cookies");
      expect(() => trackSession("session-123", "contributor")).not.toThrow();

      const cookieCall = mockSetItem.mock.calls.find(
        (call) => call[0] === "cadavre_sessions",
      );
      const storedData = JSON.parse(cookieCall![1]);
      expect(storedData).toHaveLength(1);
    });
  });

  describe("getSessionHistory()", () => {
    it("should return empty array when no sessions exist", async () => {
      const { getSessionHistory } = await import("@/lib/cookies");
      const history = getSessionHistory();
      expect(history).toEqual([]);
    });

    it("should filter out sessions older than 30 days", async () => {
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
      localStorageData.set("cadavre_sessions", JSON.stringify(mockSessions));

      const { getSessionHistory } = await import("@/lib/cookies");
      const history = getSessionHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sessionId).toBe("recent");
    });

    it("should filter out sessions older than 30 days from cookie", async () => {
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
      cookieStore.set("cadavre_sessions", JSON.stringify(mockSessions));

      const { getSessionHistory } = await import("@/lib/cookies");
      const history = getSessionHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sessionId).toBe("recent");
    });

    it("should handle malformed cookie data", async () => {
      cookieStore.set("cadavre_sessions", "not-json");

      const { getSessionHistory } = await import("@/lib/cookies");
      const history = getSessionHistory();
      expect(history).toEqual([]);
    });

    it("should handle malformed LocalStorage data", async () => {
      localStorageData.set("cadavre_sessions", "also-not-json");

      const { getSessionHistory } = await import("@/lib/cookies");
      const history = getSessionHistory();
      expect(history).toEqual([]);
    });
  });

  describe("getAnonymousIdentity()", () => {
    it("should return anonymous identity with ID", async () => {
      const validUuid = "abcd1234-5678-4123-8123-abcdef123456";
      mockGetItem.mockReturnValue(validUuid);

      const { getAnonymousIdentity } = await import("@/lib/cookies");
      const identity = getAnonymousIdentity();
      expect(identity.id).toBe(validUuid);
      expect(identity.createdAt).toBeInstanceOf(Date);
      expect(identity.lastSeenAt).toBeInstanceOf(Date);
    });

    it("should handle empty session history", async () => {
      mockGetItem.mockImplementation((key: string) => {
        if (key === "cadavre_anon_id") {
          return "abcd1234-5678-4123-8123-abcdef123456";
        }
        return null;
      });

      const { getAnonymousIdentity } = await import("@/lib/cookies");
      const identity = getAnonymousIdentity();
      expect(identity.sessions).toEqual([]);
    });
  });
});
