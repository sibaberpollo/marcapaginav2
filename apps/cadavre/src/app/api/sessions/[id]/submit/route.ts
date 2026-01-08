/**
 * Cadavre Collaborative Writing - Submit Segment API
 *
 * POST /api/sessions/[id]/submit
 * Allows a contributor to submit their segment for the current turn.
 */

import { NextRequest, NextResponse } from "next/server";

import {
  type SubmitSegmentRequest,
  type SubmitSegmentResponse,
  type SessionStatus,
  DEFAULT_WORD_COUNT_RANGE,
} from "@/lib/types";
import { sessionStore } from "@/lib/store";
import { getAnonymousId } from "@/lib/cookies";

// =============================================================================
// Constants
// =============================================================================

const ALLOW_SUBMIT_STATUSES: SessionStatus[] = ["active", "voting"];

// =============================================================================
// Validation Functions
// =============================================================================

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function validateRequest(body: unknown): {
  isValid: boolean;
  errors: { content?: string };
  data: SubmitSegmentRequest | null;
} {
  const errors: { content?: string } = {};

  if (!body || typeof body !== "object") {
    return {
      isValid: false,
      errors: { content: "Request body is required" },
      data: null,
    };
  }

  const typedBody = body as Record<string, unknown>;

  if (!Object.hasOwn(typedBody, "content")) {
    errors.content = "Segment content is required";
    return { isValid: false, errors, data: null };
  }

  if (typeof typedBody.content !== "string") {
    errors.content = "Segment content must be a string";
    return { isValid: false, errors, data: null };
  }

  const wordCount = countWords(typedBody.content);

  if (wordCount < DEFAULT_WORD_COUNT_RANGE.min) {
    errors.content = `Minimum ${DEFAULT_WORD_COUNT_RANGE.min} words required (currently ${wordCount})`;
  } else if (wordCount > DEFAULT_WORD_COUNT_RANGE.max) {
    errors.content = `Maximum ${DEFAULT_WORD_COUNT_RANGE.max} words allowed (currently ${wordCount})`;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, data: null };
  }

  return {
    isValid: true,
    errors: {},
    data: { content: typedBody.content },
  };
}

// =============================================================================
// API Route Handler
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<SubmitSegmentResponse | { success: false; error: string }>
> {
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

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const validation = validateRequest(body);
    if (!validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.content || "Invalid segment content",
        },
        { status: 400 },
      );
    }

    const { content } = validation.data;

    // Validate session status allows submission
    if (!ALLOW_SUBMIT_STATUSES.includes(session.status)) {
      return NextResponse.json(
        { success: false, error: "Session is not accepting submissions" },
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
        { success: false, error: "It is not your turn to submit" },
        { status: 403 },
      );
    }

    // Check if contributor has already submitted for this turn (shouldn't happen with proper state)
    const segments = sessionStore.getSegments(sessionId);
    const hasSubmitted = segments.some(
      (s) => s.authorId === userId && s.position === session.currentTurnIndex,
    );
    if (hasSubmitted) {
      return NextResponse.json(
        { success: false, error: "You have already submitted for this turn" },
        { status: 400 },
      );
    }

    // Add the segment
    const newSegment = sessionStore.addSegment(sessionId, {
      authorId: userId,
      authorName: "Anon",
      isAnonymous: true,
      content,
    });

    if (!newSegment) {
      return NextResponse.json(
        { success: false, error: "Failed to submit segment" },
        { status: 500 },
      );
    }

    // Advance the turn
    const turnAdvanced = sessionStore.advanceTurn(sessionId);

    // Check if session is now complete
    const updatedSession = sessionStore.getSession(sessionId);
    const isComplete =
      updatedSession?.status === "completed" ||
      updatedSession?.status === "voting";

    // Get updated session state
    const sessionState = sessionStore.getSessionState(sessionId, userId);

    if (!sessionState) {
      return NextResponse.json(
        { success: false, error: "Failed to retrieve updated session state" },
        { status: 500 },
      );
    }

    let message = "Segment submitted successfully";
    if (isComplete) {
      message = "¡Historia completada! En revisión editorial.";
    } else if (!turnAdvanced) {
      message = "Segment submitted. Waiting for next contributor...";
    }

    return NextResponse.json({
      success: true,
      sessionState,
      message,
    });
  } catch (error) {
    console.error("Error submitting segment:", error);

    return NextResponse.json(
      { success: false, error: "Failed to submit segment" },
      { status: 500 },
    );
  }
}
