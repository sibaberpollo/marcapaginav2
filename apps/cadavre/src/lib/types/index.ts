/**
 * Cadavre Collaborative Writing - Type Definitions
 *
 * Type-safe interfaces for the collaborative storytelling platform.
 * All dates are represented as Date objects, not strings.
 */

// =============================================================================
// Session Types
// =============================================================================

/**
 * Represents the current status of a collaborative writing session.
 */
export type SessionStatus =
  | "waiting" // Waiting for contributors
  | "active" // Accepting contributions
  | "voting" // Vote to end in progress
  | "completed" // All segments submitted
  | "moderation" // Awaiting editorial review
  | "published" // Approved for Transtextos
  | "rejected"; // Not approved

/**
 * Container for a collaborative story session.
 *
 * Manages the lifecycle of a collaborative writing session including
 * theme, participants, and completion state.
 */
export interface Session {
  /** Unique 8-character alphanumeric identifier */
  id: string;
  /** URL-friendly slug for session identification */
  slug: string;
  /** Optional thematic prompt to guide writers */
  theme: string | null;
  /** Opening segment from the creator (50-100 words) */
  openingSegment: string;
  /** Maximum number of contributors (7-10, default 7) */
  maxContributors: number;
  /** Current lifecycle status of the session */
  status: SessionStatus;
  /** Index of the current turn (0-based, -1 if not started) */
  currentTurnIndex: number;
  /** Timestamp when the session was created */
  createdAt: Date;
  /** Timestamp when the session was completed, null if active */
  completedAt: Date | null;
  /** User ID or anonymous token of the session creator */
  createdBy: string;
}

// =============================================================================
// Segment Types
// =============================================================================

/**
 * Individual contribution from a writer in a session.
 *
 * Represents a single piece of the collaborative story at a specific
 * position in the narrative order.
 */
export interface Segment {
  /** Unique identifier for the segment */
  id: string;
  /** ID of the parent session */
  sessionId: string;
  /** User ID or anonymous token of the author */
  authorId: string;
  /** Display name of the author */
  authorName: string;
  /** Whether the author chose to remain anonymous */
  isAnonymous: boolean;
  /** Written content (50-100 words) */
  content: string;
  /** Position in the story (0 = opening segment) */
  position: number;
  /** Timestamp when the segment was submitted */
  submittedAt: Date;
}

// =============================================================================
// Contributor Types
// =============================================================================

/**
 * Represents the status of a contributor's participation.
 */
export type ContributorStatus =
  | "pending" // Waiting to contribute
  | "active" // Currently contributing
  | "completed" // Finished (submitted or passed)
  | "passed"; // Used pass option

/**
 * Link between a user and a session.
 *
 * Tracks a participant's role, status, and turn position within
 * a specific collaborative writing session.
 */
export interface Contributor {
  /** Unique identifier for the contributor record */
  id: string;
  /** ID of the associated session */
  sessionId: string;
  /** User ID or anonymous token */
  userId: string;
  /** Unique token for sharing the contributor link */
  linkToken: string;
  /** Type of participant access */
  linkType: "contributor" | "observer";
  /** Current participation status */
  status: ContributorStatus;
  /** Whether the contributor has passed their turn */
  hasPassed: boolean;
  /** Timestamp when the contributor joined */
  joinedAt: Date;
  /** Turn order index for this contributor */
  turnIndex: number;
}

// =============================================================================
// Session Link Types
// =============================================================================

/**
 * Shareable access token for session participation.
 *
 * Manages the lifecycle of shareable links including expiration
 * and usage tracking.
 */
export interface SessionLink {
  /** Unique identifier for the link */
  id: string;
  /** ID of the associated session */
  sessionId: string;
  /** Type of access this link provides */
  linkType: "contributor" | "observer";
  /** Unique access token */
  token: string;
  /** Whether the link is currently active */
  isActive: boolean;
  /** Optional expiration timestamp */
  expiresAt: Date | null;
  /** Timestamp when the link was created */
  createdAt: Date;
  /** Timestamp when the link was revoked, null if active */
  revokedAt: Date | null;
  /** Number of times the link has been accessed */
  clickCount: number;
}

// =============================================================================
// Session State Types
// =============================================================================

/**
 * Represents the voting status for ending a session early.
 */
export type VoteStatus = {
  /** Whether a vote is currently in progress */
  inProgress: boolean;
  /** Number of votes to end the session */
  votesForEnd: number;
  /** Total number of votes cast */
  totalVotes: number;
  /** Whether the current user has voted */
  hasVoted: boolean;
  /** Whether the user can propose ending (after 5 contributions) */
  canProposeEnd: boolean;
};

/**
 * Full state for the polling endpoint.
 *
 * Contains all information needed to render the session UI,
 * including current turn, user position, and voting status.
 */
export interface SessionState {
  /** Current session details */
  session: Session;
  /** All submitted segments in order */
  segments: Segment[];
  /** All contributors with their status */
  contributors: Contributor[];
  /** ID of the contributor whose turn it currently is */
  currentContributorId: string | null;
  /** Position of the current user in the contributor list */
  myPosition: number;
  /** Whether it's the current user's turn to write */
  isMyTurn: boolean;
  /** Current voting status, null if no vote in progress */
  voteStatus: VoteStatus | null;
}

// =============================================================================
// Identity Types
// =============================================================================

/**
 * Cookie-based tracking for anonymous users.
 *
 * Maintains identity across sessions without requiring authentication.
 */
export interface AnonymousIdentity {
  /** UUID v4 identifier for the anonymous user */
  id: string;
  /** Timestamp when the identity was first created */
  createdAt: Date;
  /** Timestamp of the most recent activity */
  lastSeenAt: Date;
  /** List of sessions this identity has participated in */
  sessions: Array<{
    /** ID of the session */
    sessionId: string;
    /** Role in that session */
    role: "contributor" | "observer";
    /** Timestamp when the user joined */
    joinedAt: Date;
  }>;
}

// =============================================================================
// API Request Types
// =============================================================================

/**
 * Request body for creating a new session.
 */
export interface CreateSessionRequest {
  /** Optional thematic prompt for the story */
  theme?: string;
  /** Opening segment content (50-100 words) */
  openingSegment: string;
  /** Maximum contributors (7-10, default 7) */
  maxContributors?: number;
}

/**
 * Request body for joining an existing session.
 */
export interface JoinSessionRequest {
  /** Unique contributor or observer link token */
  linkToken: string;
}

/**
 * Request body for submitting a new segment.
 */
export interface SubmitSegmentRequest {
  /** Segment content (50-100 words) */
  content: string;
}

/**
 * Request body for moderation actions.
 */
export interface ModerateSessionRequest {
  /** Moderation decision */
  action: "approve" | "reject";
  /** Optional notes about the moderation decision */
  notes?: string;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Response after creating a new session.
 */
export interface CreateSessionResponse {
  /** The newly created session */
  session: Session;
  /** Shareable link for contributors */
  contributorLink: string;
  /** Shareable link for observers */
  observerLink: string;
}

/**
 * Response after joining a session.
 */
export interface JoinSessionResponse {
  /** Position in the waiting queue (0 = next to contribute) */
  queuePosition: number;
  /** Estimated wait time in minutes */
  estimatedWaitMinutes: number;
  /** Current full state of the session */
  sessionState: SessionState;
}

/**
 * Response after submitting a segment.
 */
export interface SubmitSegmentResponse {
  /** Whether the submission was successful */
  success: boolean;
  /** Updated session state after submission */
  sessionState: SessionState;
  /** Human-readable message about the result */
  message: string;
}

// =============================================================================
// Type Guard Utilities
// =============================================================================

/**
 * Type guard to check if a value is a valid SessionStatus.
 */
export function isSessionStatus(value: unknown): value is SessionStatus {
  return (
    typeof value === "string" &&
    [
      "waiting",
      "active",
      "voting",
      "completed",
      "moderation",
      "published",
      "rejected",
    ].includes(value)
  );
}

/**
 * Type guard to check if a value is a valid ContributorStatus.
 */
export function isContributorStatus(
  value: unknown,
): value is ContributorStatus {
  return (
    typeof value === "string" &&
    ["pending", "active", "completed", "passed"].includes(value)
  );
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Represents a participant identifier, either a known user ID or anonymous token.
 */
export type ParticipantId = string;

/**
 * Represents a display name that may be anonymized.
 */
export type DisplayName = string;

/**
 * Word count range for segment validation.
 */
export type WordCountRange = {
  readonly min: number;
  readonly max: number;
};

/**
 * Default word count constraints for segments.
 */
export const DEFAULT_WORD_COUNT_RANGE: WordCountRange = {
  min: 50,
  max: 100,
} as const;

/**
 * Default maximum number of contributors.
 */
export const DEFAULT_MAX_CONTRIBUTORS = 7;

/**
 * Minimum contributors required before voting can begin.
 */
export const MIN_CONTRIBUTORS_FOR_VOTE = 5;

/**
 * Threshold percentage (60%) of eligible voters required to end session.
 */
export const VOTE_THRESHOLD_PERCENTAGE = 0.6 as const;

/**
 * Valid range for max contributors configuration.
 */
export const VALID_MAX_CONTRIBUTORS_RANGE: WordCountRange = {
  min: 7,
  max: 10,
} as const;
