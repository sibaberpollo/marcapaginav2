/**
 * Cadavre Collaborative Writing - Session Landing Page
 *
 * Displays session based on link type (contributor/observer) and session status.
 * Route: /cadavre/session/[sessionId]/[linkType]/[token]
 */

import type { Metadata } from "next";

import { sessionStore } from "@/lib/store";
import type { LinkType } from "@/lib/links";
import type { SessionState } from "@/lib/types";

import { SessionLoading } from "@/components/session/SessionLoading";
import { SessionError } from "@/components/session/SessionError";
import { SessionWaiting } from "@/components/session/SessionWaiting";
import { SessionActiveContributor } from "@/components/session/SessionActiveContributor";
import { SessionActiveObserver } from "@/components/session/SessionActiveObserver";
import { SessionCompleted } from "@/components/session/SessionCompleted";
import { SessionModeration } from "@/components/session/SessionModeration";

interface SessionPageProps {
  params: Promise<{
    sessionId: string;
    linkType: string;
    token: string;
  }>;
}

// =============================================================================
// Metadata
// =============================================================================

export async function generateMetadata({
  params,
}: SessionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const session = sessionStore.getSession(resolvedParams.sessionId);

  if (!session) {
    return {
      title: "Sesión no encontrada | Cadavre",
    };
  }

  return {
    title: session.theme
      ? `${session.theme} | Cadavre`
      : "Historia colaborativa | Cadavre",
    description: `Únete a esta historia colaborativa${
      session.theme ? ` sobre "${session.theme}"` : ""
    }`,
  };
}

// =============================================================================
// Validation Helper
// =============================================================================

interface ValidationResult {
  valid: boolean;
  error?: string;
  sessionState?: SessionState;
  linkType?: LinkType;
}

function validateRouteParams(
  sessionId: string,
  linkType: string,
  token: string,
): ValidationResult {
  // Validate sessionId format (8 chars alphanumeric)
  if (!/^[A-Za-z0-9]{8}$/.test(sessionId)) {
    return { valid: false, error: "Invalid session ID format" };
  }

  // Validate linkType
  if (linkType !== "contributor" && linkType !== "observer") {
    return { valid: false, error: "Invalid link type" };
  }

  // Validate token format (16 chars alphanumeric)
  if (!/^[A-Za-z0-9]{16}$/.test(token)) {
    return { valid: false, error: "Invalid token format" };
  }

  // Check if session exists
  const session = sessionStore.getSession(sessionId);
  if (!session) {
    return { valid: false, error: "Session not found" };
  }

  // Validate link token
  const link = sessionStore.getLinkByToken(token);
  if (!link) {
    return { valid: false, error: "Link expired or invalid" };
  }

  // Check link type matches route
  if (link.linkType !== linkType) {
    return { valid: false, error: "Link type mismatch" };
  }

  // Check session is not rejected
  if (session.status === "rejected") {
    return { valid: false, error: "This story was not approved" };
  }

  return { valid: true, linkType: linkType as LinkType };
}

// =============================================================================
// Session Data Fetcher
// =============================================================================

async function getSessionState(
  sessionId: string,
  linkType: LinkType,
  token: string,
): Promise<SessionState | null> {
  // Get contributor by token to identify user
  const contributor = sessionStore.getContributorByToken(sessionId, token);

  if (!contributor) {
    return null;
  }

  return sessionStore.getSessionState(sessionId, contributor.userId);
}

// =============================================================================
// Main Page Component
// =============================================================================

export default async function SessionPage({ params }: SessionPageProps) {
  const resolvedParams = await params;
  const { sessionId, linkType, token } = resolvedParams;

  // Validate route parameters
  const validation = validateRouteParams(sessionId, linkType, token);
  if (!validation.valid) {
    return <SessionError error={validation.error || "Invalid session"} />;
  }

  // Get session state for rendering
  const sessionState = await getSessionState(
    sessionId,
    validation.linkType!,
    token,
  );

  if (!sessionState) {
    return <SessionError error="Unable to load session state" />;
  }

  const { session, isMyTurn, myPosition } = sessionState;

  // Route to appropriate component based on session status
  switch (session.status) {
    case "waiting":
      return (
        <SessionWaiting
          sessionState={sessionState}
          linkType={validation.linkType!}
        />
      );

    case "active":
    case "voting":
      if (validation.linkType === "contributor") {
        return (
          <SessionActiveContributor
            sessionState={sessionState}
            isMyTurn={isMyTurn}
            myPosition={myPosition}
          />
        );
      } else {
        return <SessionActiveObserver sessionState={sessionState} />;
      }

    case "completed":
      return <SessionCompleted sessionState={sessionState} />;

    case "moderation":
      return <SessionModeration sessionState={sessionState} />;

    case "published":
      // Published sessions redirect to the main site
      return <SessionCompleted sessionState={sessionState} />;

    case "rejected":
      return <SessionError error="This story was not approved" />;

    default:
      return <SessionError error="Unknown session status" />;
  }
}

// =============================================================================
// Loading State
// =============================================================================

export function SessionPageLoading() {
  return <SessionLoading />;
}
