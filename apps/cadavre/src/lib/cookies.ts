/**
 * Cadavre Collaborative Writing - Cookie-based Identity Management
 *
 * Cookie and LocalStorage utilities for tracking anonymous users.
 * Provides session continuity without requiring user registration.
 */

import type { AnonymousIdentity } from "@/lib/types";

// =============================================================================
// Cookie Configuration
// =============================================================================

const ANON_COOKIE = "cadavre_anon_id";
const SESSIONS_COOKIE = "cadavre_sessions";
const IDENTITY_LIFESPAN_DAYS = 30;

/**
 * Cookie options for anonymous identity.
 */
interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Session history entry stored in cookies.
 */
interface StoredSessionEntry {
  sessionId: string;
  role: "contributor" | "observer";
  joinedAt: string; // ISO date string for cookie storage
}

// =============================================================================
// Server vs Client Detection
// =============================================================================

/**
 * Check if we're running in a browser environment.
 * Safe to use in both server and client contexts.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Get cookie value by name (browser).
 */
function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length !== 2) return null;

  const cookieValue = parts.pop()?.split(";").shift() ?? null;
  return cookieValue;
}

/**
 * Set cookie value (browser only).
 */
function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (!isBrowser()) return;

  const cookieParts = [`${name}=${value}`];

  if (options.expires) {
    cookieParts.push(`expires=${options.expires.toUTCString()}`);
  }
  if (options.maxAge !== undefined) {
    cookieParts.push(`max-age=${options.maxAge}`);
  }
  if (options.path) {
    cookieParts.push(`path=${options.path}`);
  }
  if (options.domain) {
    cookieParts.push(`domain=${options.domain}`);
  }
  if (options.secure) {
    cookieParts.push("secure");
  }
  if (options.httpOnly) {
    cookieParts.push("httponly");
  }
  if (options.sameSite) {
    cookieParts.push(`samesite=${options.sameSite}`);
  }

  document.cookie = cookieParts.join("; ");
}

/**
 * Delete cookie by name (browser only).
 */
function deleteCookie(name: string): void {
  if (!isBrowser()) return;

  document.cookie = `${name}=; max-age=0; path=/`;
}

// =============================================================================
// LocalStorage Fallback (for cookie-less browsers)
// =============================================================================

const LOCALSTORAGE_KEYS = {
  ANON_ID: "cadavre_anon_id",
  SESSIONS: "cadavre_sessions",
} as const;

/**
 * Get anonymous ID from LocalStorage fallback.
 */
function getLocalStorageAnonId(): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(LOCALSTORAGE_KEYS.ANON_ID);
  } catch {
    // LocalStorage may be disabled or full
    return null;
  }
}

/**
 * Set anonymous ID in LocalStorage fallback.
 */
function setLocalStorageAnonId(id: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(LOCALSTORAGE_KEYS.ANON_ID, id);
  } catch {
    // LocalStorage may be disabled or full - silently fail
  }
}

/**
 * Get session history from LocalStorage fallback.
 */
function getLocalStorageSessions(): StoredSessionEntry[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(LOCALSTORAGE_KEYS.SESSIONS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? (parsed as StoredSessionEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Set session history in LocalStorage fallback.
 */
function setLocalStorageSessions(sessions: StoredSessionEntry[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(LOCALSTORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    // LocalStorage may be disabled or full - silently fail
  }
}

/**
 * Clear session history from LocalStorage fallback.
 */
function clearLocalStorageSessions(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(LOCALSTORAGE_KEYS.SESSIONS);
  } catch {
    // LocalStorage may be disabled - silently fail
  }
}

// =============================================================================
// Cookie Options
// =============================================================================

/**
 * Standard cookie options for identity cookies.
 */
const IDENTITY_COOKIE_OPTIONS: CookieOptions = {
  path: "/",
  secure: true,
  httpOnly: false, // Must be false for client-side access
  sameSite: "lax",
  maxAge: getMaxAgeSeconds(),
};

// =============================================================================
// Date Utilities
// =============================================================================

/**
 * Get max age in seconds for 30 days.
 */
function getMaxAgeSeconds(): number {
  return IDENTITY_LIFESPAN_DAYS * 24 * 60 * 60;
}

// =============================================================================
// Cookie Options
// =============================================================================

/**
 * Generate a new UUID v4.
 * Uses the Web Crypto API for cryptographically secure random values.
 */
export function generateUuid(): string {
  // Use crypto.randomUUID() when available (Node.js 19+, modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  // UUID v4 structure: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const randomValues = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Last resort fallback - not cryptographically secure
    for (let i = 0; i < 16; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  // Set version bits (4) and variant bits (8, 9, A, or B)
  randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
  randomValues[8] = (randomValues[8] & 0x3f) | 0x80;

  const hex = Array.from(randomValues)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Read the anonymous ID from cookie or LocalStorage fallback.
 * Generates a new ID if none exists.
 *
 * @returns The UUID v4 anonymous identifier
 */
export function getAnonymousId(): string {
  // Try cookie first (primary storage)
  const cookieId = getCookie(ANON_COOKIE);
  if (cookieId && isValidUuid(cookieId)) {
    return cookieId;
  }

  // Try LocalStorage fallback
  const localStorageId = getLocalStorageAnonId();
  if (localStorageId && isValidUuid(localStorageId)) {
    // Sync to cookie for future requests
    setCookie(ANON_COOKIE, localStorageId, IDENTITY_COOKIE_OPTIONS);
    return localStorageId;
  }

  // Generate new ID
  const newId = generateUuid();

  // Store in both cookie and LocalStorage
  setCookie(ANON_COOKIE, newId, IDENTITY_COOKIE_OPTIONS);
  setLocalStorageAnonId(newId);

  return newId;
}

/**
 * Validate UUID v4 format.
 */
function isValidUuid(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Set the anonymous ID cookie with 30-day expiration.
 *
 * @param id - The anonymous UUID to set
 */
export function setAnonymousId(id: string): void {
  if (!isValidUuid(id)) {
    console.warn("Invalid UUID passed to setAnonymousId:", id);
    return;
  }

  // Update cookie
  setCookie(ANON_COOKIE, id, IDENTITY_COOKIE_OPTIONS);

  // Update LocalStorage fallback
  setLocalStorageAnonId(id);

  // Also update the sessions cookie to include new lastSeenAt
  const sessions = getLocalStorageSessions();
  if (sessions.length > 0) {
    // We need to sync the sessions cookie too
    const storedSessions = getCookie(SESSIONS_COOKIE);
    if (storedSessions) {
      try {
        const parsed: StoredSessionEntry[] = JSON.parse(storedSessions);
        setCookie(
          SESSIONS_COOKIE,
          JSON.stringify(parsed),
          IDENTITY_COOKIE_OPTIONS,
        );
      } catch {
        // Ignore parse errors
      }
    }
  }
}

/**
 * Add a session to the user's session history.
 *
 * @param sessionId - The session ID to track
 * @param role - The user's role in the session
 */
export function trackSession(
  sessionId: string,
  role: "contributor" | "observer",
): void {
  const now = new Date().toISOString();
  const anonId = getAnonymousId();

  // Get current sessions from cookie
  let sessions: StoredSessionEntry[] = [];
  const cookieSessions = getCookie(SESSIONS_COOKIE);
  if (cookieSessions) {
    try {
      sessions = JSON.parse(cookieSessions) as StoredSessionEntry[];
    } catch {
      sessions = [];
    }
  }

  // Check if session already tracked
  const existingIndex = sessions.findIndex((s) => s.sessionId === sessionId);
  if (existingIndex !== -1) {
    // Update existing entry's role if changed
    sessions[existingIndex] = {
      sessionId,
      role,
      joinedAt: sessions[existingIndex].joinedAt,
    };
  } else {
    // Add new session entry
    sessions.push({
      sessionId,
      role,
      joinedAt: now,
    });
  }

  // Store in cookie
  setCookie(SESSIONS_COOKIE, JSON.stringify(sessions), IDENTITY_COOKIE_OPTIONS);

  // Also update LocalStorage fallback
  setLocalStorageSessions(sessions);

  // Update anonymous ID cookie to reset expiration (lastSeenAt behavior)
  setCookie(ANON_COOKIE, anonId, IDENTITY_COOKIE_OPTIONS);
}

/**
 * Get the user's session history.
 * Filters out sessions older than 30 days and sorts by most recent first.
 *
 * @returns Array of session history entries
 */
export function getSessionHistory(): Array<{
  sessionId: string;
  role: "contributor" | "observer";
  joinedAt: Date;
}> {
  // Get sessions from cookie first
  let sessions: StoredSessionEntry[] = [];
  const cookieSessions = getCookie(SESSIONS_COOKIE);
  if (cookieSessions) {
    try {
      sessions = JSON.parse(cookieSessions) as StoredSessionEntry[];
    } catch {
      // Fall through to LocalStorage
    }
  }

  // Fallback to LocalStorage if cookie had no data
  if (sessions.length === 0) {
    sessions = getLocalStorageSessions();
  }

  // Parse and filter expired sessions
  const expiryThreshold = new Date();
  expiryThreshold.setDate(expiryThreshold.getDate() - IDENTITY_LIFESPAN_DAYS);

  const filteredSessions = sessions
    .map((entry) => ({
      sessionId: entry.sessionId,
      role: entry.role as "contributor" | "observer",
      joinedAt: new Date(entry.joinedAt),
    }))
    .filter((entry) => entry.joinedAt >= expiryThreshold);

  // Sort by most recent first
  filteredSessions.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());

  return filteredSessions;
}

/**
 * Clear all session history from cookies and LocalStorage.
 */
export function clearSessionHistory(): void {
  // Clear cookie
  deleteCookie(SESSIONS_COOKIE);

  // Clear LocalStorage fallback
  clearLocalStorageSessions();
}

/**
 * Get the complete anonymous identity.
 * Creates a new identity if none exists.
 *
 * @returns AnonymousIdentity object with ID, timestamps, and session history
 */
export function getAnonymousIdentity(): AnonymousIdentity {
  const id = getAnonymousId();
  const now = new Date();

  // Get session history (already filtered and sorted)
  const sessions = getSessionHistory();

  return {
    id,
    createdAt: now, // Note: In a real implementation, you'd store creation date
    lastSeenAt: now,
    sessions,
  };
}

// =============================================================================
// Re-export for convenience
// =============================================================================

export type { AnonymousIdentity } from "@/lib/types";
