/**
 * Cadavre Collaborative Writing - Join Session API
 *
 * POST /api/sessions/[id]/join
 * Allows users to join a session's contribution queue using a link token.
 */

import { NextRequest, NextResponse } from "next/server";

import {
  type JoinSessionRequest,
  type JoinSessionResponse,
  type SessionStatus,
} from "@/lib/types";
import { sessionStore } from "@/lib/store";
import { getAnonymousIdFromRequest } from "@/lib/cookies";
import { buildObserverLink } from "@/lib/links";

// =============================================================================
// Constants
// =============================================================================

const AVERAGE_CONTRIBUTION_MINUTES = 3;

const ALLOW_JOIN_STATUSES: SessionStatus[] = ["waiting", "active", "voting"];

// =============================================================================
// Validation Functions
// =============================================================================

function validateRequest(body: unknown): {
  isValid: boolean;
  data: JoinSessionRequest | null;
} {
  if (!body || typeof body !== "object") {
    return { isValid: false, data: null };
  }

  const typedBody = body as Record<string, unknown>;

  if (!Object.hasOwn(typedBody, "linkToken")) {
    return { isValid: false, data: null };
  }

  if (typeof typedBody.linkToken !== "string") {
    return { isValid: false, data: null };
  }

  if (typedBody.linkToken.trim().length === 0) {
    return { isValid: false, data: null };
  }

  return {
    isValid: true,
    data: { linkToken: typedBody.linkToken },
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

function canJoinSession(status: SessionStatus): boolean {
  return ALLOW_JOIN_STATUSES.includes(status);
}

function getQueuePosition(sessionId: string, contributorId: string): number {
  const contributors = sessionStore.getContributors(sessionId);
  const index = contributors.findIndex((c) => c.id === contributorId);
  return index >= 0 ? index : -1;
}

function calculateEstimatedWait(position: number): number {
  return position * AVERAGE_CONTRIBUTION_MINUTES;
}

// =============================================================================
// API Route Handler
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<
  NextResponse<
    | JoinSessionResponse
    | { success: false; error: string; observerLink?: string }
  >
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
        { success: false, error: "Invalid link token" },
        { status: 400 },
      );
    }

    const { linkToken } = validation.data;

    // Validate link token
    const link = sessionStore.getLinkByToken(linkToken);
    if (!link) {
      return NextResponse.json(
        { success: false, error: "Invalid link token" },
        { status: 400 },
      );
    }

    // Verify link belongs to this session
    if (link.sessionId !== sessionId) {
      return NextResponse.json(
        { success: false, error: "Invalid link token" },
        { status: 400 },
      );
    }

    // Check if link is active
    if (!link.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid link token" },
        { status: 400 },
      );
    }

    // Check if link has expired
    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Invalid link token" },
        { status: 400 },
      );
    }

    // Get anonymous ID for the user from request cookies
    const anonymousId = getAnonymousIdFromRequest(request);
    if (!anonymousId) {
      return NextResponse.json(
        { success: false, error: "Anonymous identity required" },
        { status: 401 },
      );
    }

    // Check if user already joined (by user ID)
    const existingContributorByUserId = sessionStore.getContributor(
      sessionId,
      anonymousId,
    );
    if (existingContributorByUserId) {
      const position = getQueuePosition(
        sessionId,
        existingContributorByUserId.id,
      );
      const sessionState = sessionStore.getSessionState(sessionId, anonymousId);

      if (!sessionState) {
        return NextResponse.json(
          { success: false, error: "Session not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        queuePosition: position,
        estimatedWaitMinutes: calculateEstimatedWait(position),
        sessionState,
      });
    }

    // Validate session status allows joining
    if (!canJoinSession(session.status)) {
      const observerLink = buildObserverLink(sessionId, "", request);

      return NextResponse.json(
        {
          success: false,
          error: "Session is no longer accepting contributions",
          observerLink,
        },
        { status: 403 },
      );
    }

    // Check session capacity
    const contributorCount = sessionStore.getContributorCount(sessionId);
    if (contributorCount >= session.maxContributors) {
      const observerLink = buildObserverLink(sessionId, "", request);

      return NextResponse.json(
        {
          success: false,
          error: "Session is full",
          observerLink,
        },
        { status: 403 },
      );
    }

    // Add contributor to queue
    const newContributor = sessionStore.addContributor(sessionId, {
      userId: anonymousId,
      linkToken,
      linkType: link.linkType,
      status: "pending",
      hasPassed: false,
    });

    if (!newContributor) {
      return NextResponse.json(
        { success: false, error: "Failed to join session" },
        { status: 500 },
      );
    }

    // Record link click
    sessionStore.recordLinkClick(linkToken);

    // Get queue position
    const position = getQueuePosition(sessionId, newContributor.id);

    // Get session state
    const sessionState = sessionStore.getSessionState(sessionId, anonymousId);

    if (!sessionState) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      queuePosition: position,
      estimatedWaitMinutes: calculateEstimatedWait(position),
      sessionState,
    });
  } catch (error) {
    console.error("Error joining session:", error);

    return NextResponse.json(
      { success: false, error: "Failed to join session" },
      { status: 500 },
    );
  }
}
