/**
 * Cadavre Collaborative Writing - Session Creation API
 *
 * POST /api/sessions
 * Creates a new collaborative writing session with the creator as the first contributor.
 */

import { NextRequest, NextResponse } from "next/server";

import {
  type CreateSessionRequest,
  DEFAULT_MAX_CONTRIBUTORS,
  DEFAULT_WORD_COUNT_RANGE,
  VALID_MAX_CONTRIBUTORS_RANGE,
} from "@/lib/types";
import { sessionStore } from "@/lib/store";
import { getAnonymousId, trackSession } from "@/lib/cookies";

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Count words in a text string.
 * Words are separated by whitespace, ignoring empty strings.
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/**
 * Validate the session creation request body.
 */
function validateRequest(body: unknown): {
  isValid: boolean;
  errors: Partial<Record<keyof CreateSessionRequest, string>>;
  data: CreateSessionRequest | null;
} {
  const errors: Partial<Record<keyof CreateSessionRequest, string>> = {};
  let data: CreateSessionRequest | null = null;

  // Check if body is an object
  if (!body || typeof body !== "object") {
    return {
      isValid: false,
      errors: { openingSegment: "Request body is required" },
      data: null,
    };
  }

  const typedBody = body as Record<string, unknown>;

  // Validate openingSegment is present
  if (!Object.hasOwn(typedBody, "openingSegment")) {
    errors.openingSegment = "Opening segment is required";
    return { isValid: false, errors, data: null };
  }

  // Validate openingSegment is a string
  if (typeof typedBody.openingSegment !== "string") {
    errors.openingSegment = "Opening segment must be a string";
    return { isValid: false, errors, data: null };
  }

  // Validate openingSegment word count
  const wordCount = countWords(typedBody.openingSegment);
  if (
    wordCount < DEFAULT_WORD_COUNT_RANGE.min ||
    wordCount > DEFAULT_WORD_COUNT_RANGE.max
  ) {
    errors.openingSegment = `Must be ${DEFAULT_WORD_COUNT_RANGE.min}-${DEFAULT_WORD_COUNT_RANGE.max} words (currently ${wordCount})`;
  }

  // Validate maxContributors if provided
  if (Object.hasOwn(typedBody, "maxContributors")) {
    const maxContributors = typedBody.maxContributors;
    if (typeof maxContributors !== "number") {
      errors.maxContributors = "Must be a number";
    } else if (
      maxContributors < VALID_MAX_CONTRIBUTORS_RANGE.min ||
      maxContributors > VALID_MAX_CONTRIBUTORS_RANGE.max
    ) {
      errors.maxContributors = `Must be between ${VALID_MAX_CONTRIBUTORS_RANGE.min} and ${VALID_MAX_CONTRIBUTORS_RANGE.max}`;
    }
  }

  // Validate theme if provided
  if (Object.hasOwn(typedBody, "theme") && typedBody.theme !== undefined) {
    if (typeof typedBody.theme !== "string") {
      (errors as Record<string, string>).theme = "Theme must be a string";
    }
  }

  // If there are errors, return early
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, data: null };
  }

  // Build validated data object
  data = {
    openingSegment: typedBody.openingSegment,
    maxContributors:
      typeof typedBody.maxContributors === "number"
        ? typedBody.maxContributors
        : DEFAULT_MAX_CONTRIBUTORS,
  };

  if (typeof typedBody.theme === "string") {
    data.theme = typedBody.theme;
  }

  return { isValid: true, errors, data };
}

// =============================================================================
// URL Building
// =============================================================================

/**
 * Build a full session URL for a link token.
 */
function buildSessionUrl(
  baseUrl: string,
  sessionId: string,
  linkType: "contributor" | "observer",
  token: string,
): string {
  return `${baseUrl}/cadavre/session/${sessionId}/${linkType}/${token}`;
}

/**
 * Extract the base URL from the request headers.
 */
function getBaseUrl(request: NextRequest): string {
  // Try to get from X-Forwarded-Host first (for deployments behind proxies)
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
// API Route Handler
// =============================================================================

/**
 * POST /api/sessions
 *
 * Creates a new collaborative writing session.
 *
 * Request body:
 * - theme?: string - Optional theme/prompt
 * - openingSegment: string - Required opening segment (50-100 words)
 * - maxContributors?: number - Max contributors (7-10, default 7)
 *
 * Returns:
 * - 201: Session created successfully with links
 * - 400: Validation errors
 * - 500: Server error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Validate request
    const validation = validateRequest(body);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    // Get anonymous identity for the creator
    const anonymousId = getAnonymousId();

    // Create the session
    const result = sessionStore.createSession({
      theme: validation.data.theme ?? null,
      openingSegment: validation.data.openingSegment,
      maxContributors:
        validation.data.maxContributors ?? DEFAULT_MAX_CONTRIBUTORS,
      createdBy: anonymousId,
      creatorName: "Creador",
      creatorIsAnonymous: true,
    });

    // Get the base URL for building links
    const baseUrl = getBaseUrl(request);

    // Build full URLs for the links
    const contributorLink = buildSessionUrl(
      baseUrl,
      result.session.id,
      "contributor",
      result.contributorLink.split("/").pop() ?? "",
    );
    const observerLink = buildSessionUrl(
      baseUrl,
      result.session.id,
      "observer",
      result.observerLink.split("/").pop() ?? "",
    );

    // Track the session in cookies
    trackSession(result.session.id, "contributor");

    // Return success response
    return NextResponse.json(
      {
        success: true,
        session: result.session,
        contributorLink,
        observerLink,
      },
      { status: 201 },
    );
  } catch (error) {
    // Log error for debugging
    console.error("Error creating session:", error);

    // Return server error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create session",
      },
      { status: 500 },
    );
  }
}
