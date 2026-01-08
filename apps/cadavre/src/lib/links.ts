/**
 * Cadavre Collaborative Writing - Link Generation Utilities
 *
 * Utilities for building and parsing session URLs for contributors and observers.
 * Provides type-safe URL construction and pathname parsing.
 */

import type { NextRequest } from "next/server";

// =============================================================================
// Path Constants
// =============================================================================

/**
 * Base path for all Cadavre routes.
 */
export const CADAVRE_PATH = "/cadavre";

/**
 * Path segment for session routes.
 */
export const SESSION_PATH = `${CADAVRE_PATH}/session`;

/**
 * Link type identifier for contributors.
 */
export const CONTRIBUTOR_TYPE = "contributor" as const;

/**
 * Link type identifier for observers.
 */
export const OBSERVER_TYPE = "observer" as const;

/**
 * Valid link type values.
 */
export type LinkType = typeof CONTRIBUTOR_TYPE | typeof OBSERVER_TYPE;

// =============================================================================
// Base URL Detection
// =============================================================================

/**
 * Detect the base URL from request headers.
 *
 * Checks headers in order:
 * 1. X-Forwarded-Host (for proxy deployments)
 * 2. Host header
 * 3. Falls back to localhost for development
 *
 * @param request - Optional Next.js request object for header detection
 * @returns The detected base URL with protocol
 */
export function getBaseUrl(request?: NextRequest): string {
  // If no request provided, use default development URL
  if (!request) {
    return "http://localhost:3001";
  }

  // Check for X-Forwarded-Host first (for deployments behind proxies)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto || "https"}://${forwardedHost}`;
  }

  // Fall back to Host header
  const host = request.headers.get("host");
  if (host) {
    return `https://${host}`;
  }

  // Last resort: use localhost for development
  return "http://localhost:3001";
}

// =============================================================================
// Link Building
// =============================================================================

/**
 * Build a full contributor link URL for a session.
 *
 * @param sessionId - The unique session identifier
 * @param token - The contributor link token
 * @param request - Optional request for base URL detection
 * @returns The complete contributor link URL
 *
 * @example
 * ```typescript
 * const url = buildContributorLink("abc12345", "token123");
 * // Returns: "http://localhost:3001/cadavre/session/abc12345/contributor/token123"
 * ```
 */
export function buildContributorLink(
  sessionId: string,
  token: string,
  request?: NextRequest,
): string {
  const baseUrl = getBaseUrl(request);
  return `${baseUrl}${SESSION_PATH}/${sessionId}/${CONTRIBUTOR_TYPE}/${token}`;
}

/**
 * Build a full observer link URL for a session.
 *
 * @param sessionId - The unique session identifier
 * @param token - The observer link token
 * @param request - Optional request for base URL detection
 * @returns The complete observer link URL
 *
 * @example
 * ```typescript
 * const url = buildObserverLink("abc12345", "token456");
 * // Returns: "http://localhost:3001/cadavre/session/abc12345/observer/token456"
 * ```
 */
export function buildObserverLink(
  sessionId: string,
  token: string,
  request?: NextRequest,
): string {
  const baseUrl = getBaseUrl(request);
  return `${baseUrl}${SESSION_PATH}/${sessionId}/${OBSERVER_TYPE}/${token}`;
}

/**
 * Build both contributor and observer links for a session.
 *
 * @param sessionId - The unique session identifier
 * @param contributorToken - The contributor link token
 * @param observerToken - The observer link token
 * @param request - Optional request for base URL detection
 * @returns Object containing both full link URLs
 *
 * @example
 * ```typescript
 * const links = buildSessionLinks("abc12345", "contribToken", "obsToken");
 * // Returns: { contributor: "...", observer: "..." }
 * ```
 */
export function buildSessionLinks(
  sessionId: string,
  contributorToken: string,
  observerToken: string,
  request?: NextRequest,
): { contributor: string; observer: string } {
  return {
    contributor: buildContributorLink(sessionId, contributorToken, request),
    observer: buildObserverLink(sessionId, observerToken, request),
  };
}

// =============================================================================
// URL Parsing
// =============================================================================

/**
 * Regular expression for matching session URL pathnames.
 * Matches: /cadavre/session/{sessionId}/{linkType}/{token}
 */
const SESSION_URL_PATTERN =
  /^\/cadavre\/session\/([A-Za-z0-9]{8})\/(contributor|observer)\/([A-Za-z0-9]{16})$/;

/**
 * Parse a session URL pathname into its components.
 *
 * @param pathname - The URL pathname to parse
 * @returns Parsed components or null if invalid format
 *
 * @example
 * ```typescript
 * const result = parseSessionUrl("/cadavre/session/abc12345/contributor/token123");
 * // Returns: { sessionId: "abc12345", linkType: "contributor", token: "token123" }
 * ```
 *
 * @example
 * ```typescript
 * const invalid = parseSessionUrl("/cadavre/session/abc/contributor/token");
 * // Returns: null (sessionId must be 8 chars, token must be 16 chars)
 * ```
 */
export function parseSessionUrl(
  pathname: string,
): {
  sessionId: string;
  linkType: "contributor" | "observer";
  token: string;
} | null {
  const match = pathname.match(SESSION_URL_PATTERN);

  if (!match) {
    return null;
  }

  return {
    sessionId: match[1],
    linkType: match[2] as "contributor" | "observer",
    token: match[3],
  };
}

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard to check if a string is a valid LinkType.
 *
 * @param value - The value to check
 * @returns True if the value is "contributor" or "observer"
 */
export function isLinkType(value: unknown): value is LinkType {
  return value === CONTRIBUTOR_TYPE || value === OBSERVER_TYPE;
}
