/**
 * Cadavre Collaborative Writing - Pass Turn API
 *
 * POST /api/sessions/[id]/pass
 * Allows a contributor to pass their turn.
 */

import { NextRequest, NextResponse } from "next/server";

import { sessionStore } from "@/lib/store";
import { getAnonymousId } from "@/lib/cookies";
import type { SessionState } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface PassResponse {
  success: boolean;
  sessionState: SessionState;
  message: string;
}

// =============================================================================
// API Route Handler
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<PassResponse | { success: false; error: string }>> {
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

    // Check if session is active
    if (session.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Cannot pass turn during non-active session" },
        { status: 403 },
      );
    }

    // Get user identity
    const userId = getAnonymousId();

    // Get contributor record
    const contributor = sessionStore.getContributor(sessionId, userId);
    if (!contributor) {
      return NextResponse.json(
        { success: false, error: "You are not a participant in this session" },
        { status: 403 },
      );
    }

    // Check if it's user's turn
    if (session.currentTurnIndex !== contributor.turnIndex) {
      return NextResponse.json(
        { success: false, error: "It is not your turn" },
        { status: 403 },
      );
    }

    // Check if contributor has already passed
    if (contributor.hasPassed) {
      return NextResponse.json(
        { success: false, error: "You have already passed your turn" },
        { status: 400 },
      );
    }

    // Pass the turn
    const passed = sessionStore.passTurn(sessionId, contributor.id);

    if (!passed) {
      return NextResponse.json(
        { success: false, error: "Failed to pass turn" },
        { status: 500 },
      );
    }

    // Get updated session state
    const sessionState = sessionStore.getSessionState(sessionId, userId);

    if (!sessionState) {
      return NextResponse.json(
        { success: false, error: "Failed to retrieve updated session state" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sessionState,
      message: "Turno pasado. Esperando al siguiente colaborador...",
    });
  } catch (error) {
    console.error("Error passing turn:", error);

    return NextResponse.json(
      { success: false, error: "Failed to pass turn" },
      { status: 500 },
    );
  }
}
