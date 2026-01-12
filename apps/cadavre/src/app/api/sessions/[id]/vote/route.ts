/**
 * Cadavre Collaborative Writing - Vote to End Session API
 *
 * POST /api/sessions/[id]/vote
 * Allows a contributor to vote to end the session early.
 */

import { NextRequest, NextResponse } from "next/server";

import { sessionStore } from "@/lib/store";
import { getAnonymousIdFromRequest } from "@/lib/cookies";
import type { SessionState } from "@/lib/types";

// =============================================================================
// Types
// =============================================================================

interface VoteResponse {
  success: boolean;
  sessionState: SessionState;
  message: string;
  votePassed?: boolean;
  votesForEnd?: number;
  totalVotes?: number;
}

// =============================================================================
// API Route Handler
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<VoteResponse | { success: false; error: string }>> {
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
        {
          success: false,
          error: "Voting is only allowed during active sessions",
        },
        { status: 403 },
      );
    }

    // Check minimum contributions have been made
    if (!sessionStore.canProposeEnd(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Need at least 5 contributions before voting to end",
        },
        { status: 403 },
      );
    }

    // Get user identity from request cookies
    const userId = getAnonymousIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Anonymous identity required" },
        { status: 403 },
      );
    }

    // Get contributor record
    const contributor = sessionStore.getContributor(sessionId, userId);
    if (!contributor) {
      return NextResponse.json(
        { success: false, error: "You are not a participant in this session" },
        { status: 403 },
      );
    }

    // Check if contributor has already voted
    const voteStatus = sessionStore.getVoteStatus(sessionId, userId);
    if (voteStatus.hasVoted) {
      return NextResponse.json(
        { success: false, error: "You have already voted" },
        { status: 400 },
      );
    }

    // Record the vote
    const votePassed = sessionStore.voteToEnd(sessionId, contributor.id);

    // Get updated session state
    const sessionState = sessionStore.getSessionState(sessionId, userId);

    if (!sessionState) {
      return NextResponse.json(
        { success: false, error: "Failed to retrieve updated session state" },
        { status: 500 },
      );
    }

    if (votePassed) {
      return NextResponse.json({
        success: true,
        sessionState,
        message: "¡Votos suficientes! La historia ha sido completada.",
        votePassed: true,
        votesForEnd: sessionState.voteStatus?.votesForEnd,
        totalVotes: sessionState.voteStatus?.totalVotes,
      });
    }

    return NextResponse.json({
      success: true,
      sessionState,
      message: "Voto registrado. Esperando más votos...",
      votesForEnd: sessionState.voteStatus?.votesForEnd,
      totalVotes: sessionState.voteStatus?.totalVotes,
    });
  } catch (error) {
    console.error("Error processing vote:", error);

    return NextResponse.json(
      { success: false, error: "Failed to process vote" },
      { status: 500 },
    );
  }
}
