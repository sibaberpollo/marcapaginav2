/**
 * Cadavre Collaborative Writing - Session State Polling API
 *
 * GET /api/sessions/[id]/state
 * Returns the current state of a session for real-time polling.
 */

import { NextRequest, NextResponse } from "next/server";

import { sessionStore } from "@/lib/store";
import { getAnonymousId } from "@/lib/cookies";
import type { SessionState } from "@/lib/types";

// =============================================================================
// Response Types
// =============================================================================

interface SuccessResponse {
  success: true;
  state: SessionState;
}

interface ErrorResponse {
  success: false;
  error: string;
}

// =============================================================================
// API Route Handler
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { id: sessionId } = await params;

    // Validate session exists
    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // Get user identity from query parameter or cookie
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");
    const userId = userIdParam ?? getAnonymousId();

    // Get session state
    const sessionState = sessionStore.getSessionState(sessionId, userId);

    if (!sessionState) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // Return success response with cache-preventing headers
    return NextResponse.json(
      {
        success: true,
        state: sessionState,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching session state:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch session state" },
      { status: 500 },
    );
  }
}
