import type {
  SessionState,
  Session,
  Contributor,
  Segment,
  VoteStatus,
  AnonymousIdentity,
} from "@/lib/types";

/**
 * Core test fixtures for Cadavre app testing
 * Provides consistent mock data across all test layers
 */

// =============================================================================
// Base Session Data
// =============================================================================

export const mockSession: Session = {
  id: "session-123",
  slug: "test-session",
  title: "The Lost Map",
  theme: "A Mysterious Journey",
  openingSegment:
    "Once upon a time in a forgotten village, there lived a curious child who discovered an ancient map hidden beneath the floorboards of an abandoned house.",
  maxContributors: 7,
  status: "active",
  currentTurnIndex: 1,
  createdAt: new Date("2024-01-15T10:00:00Z"),
  completedAt: null,
  createdBy: "user-456",
};

export const mockCompletedSession: Session = {
  ...mockSession,
  id: "session-completed",
  status: "completed",
  completedAt: new Date("2024-01-15T12:00:00Z"),
  createdBy: "user-456",
};

export const mockWaitingSession: Session = {
  ...mockSession,
  id: "session-waiting",
  status: "waiting",
  currentTurnIndex: 0,
};

export const mockVotingSession: Session = {
  ...mockSession,
  id: "session-voting",
  status: "voting",
  currentTurnIndex: 2,
};

// =============================================================================
// Contributors
// =============================================================================

export const mockContributors: Contributor[] = [
  {
    id: "contrib-1",
    sessionId: "session-123",
    userId: "user-456",
    linkToken: "token12345678901234567890",
    linkType: "contributor",
    status: "completed",
    hasPassed: false,
    joinedAt: new Date("2024-01-15T10:00:00Z"),
    turnIndex: 0,
  },
  {
    id: "contrib-2",
    sessionId: "session-123",
    userId: "user-789",
    linkToken: "tokenabcdefghij1234567890",
    linkType: "contributor",
    status: "active",
    hasPassed: false,
    joinedAt: new Date("2024-01-15T10:30:00Z"),
    turnIndex: 1,
  },
  {
    id: "contrib-3",
    sessionId: "session-123",
    userId: "user-observer",
    linkToken: "tokenobserver123456789012",
    linkType: "observer",
    status: "active",
    hasPassed: false,
    joinedAt: new Date("2024-01-15T11:00:00Z"),
    turnIndex: 2,
  },
];

// =============================================================================
// Segments
// =============================================================================

export const mockSegments: Segment[] = [
  {
    id: "segment-1",
    sessionId: "session-123",
    authorId: "contrib-1",
    authorName: "Alice",
    isAnonymous: false,
    content:
      "The child followed the map through dense forests and across rushing rivers, encountering strange creatures that whispered secrets in forgotten languages.",
    position: 1,
    submittedAt: new Date("2024-01-15T10:15:00Z"),
  },
  {
    id: "segment-2",
    sessionId: "session-123",
    authorId: "contrib-2",
    authorName: "Bob",
    isAnonymous: false,
    content:
      "As night fell, the map began to glow with an otherworldly light, revealing hidden paths that led to a crystal cave filled with ancient artifacts.",
    position: 2,
    submittedAt: new Date("2024-01-15T11:00:00Z"),
  },
];

// =============================================================================
// Vote Status
// =============================================================================

export const mockVoteStatus: VoteStatus = {
  inProgress: true,
  votesForEnd: 2,
  totalVotes: 3,
  hasVoted: false,
  canProposeEnd: true,
};

// =============================================================================
// Complete Session States
// =============================================================================

export const mockSessionState: SessionState = {
  session: mockSession,
  segments: mockSegments,
  contributors: mockContributors,
  currentContributorId: "contrib-2",
  myPosition: 1,
  isMyTurn: true,
  voteStatus: null,
};

export const mockWaitingSessionState: SessionState = {
  session: mockWaitingSession,
  segments: [mockSegments[0]], // Only opening segment
  contributors: [mockContributors[0]], // Only creator
  currentContributorId: null,
  myPosition: 0,
  isMyTurn: false,
  voteStatus: null,
};

export const mockVotingSessionState: SessionState = {
  session: mockVotingSession,
  segments: mockSegments,
  contributors: mockContributors,
  currentContributorId: null,
  myPosition: 1,
  isMyTurn: false,
  voteStatus: mockVoteStatus,
};

export const mockObserverSessionState: SessionState = {
  session: mockSession,
  segments: mockSegments,
  contributors: mockContributors,
  currentContributorId: "contrib-2",
  myPosition: -1, // Observer position
  isMyTurn: false,
  voteStatus: mockVoteStatus,
};

// =============================================================================
// API Response Mocks
// =============================================================================

export const mockCreateSessionResponse = {
  success: true,
  session: mockSession,
  contributorLink:
    "http://localhost:3001/session/session-123/contributor/token12345678901234567890",
  observerLink:
    "http://localhost:3001/session/session-123/observer/tokenobserver123456789012",
};

export const mockJoinSessionResponse = {
  success: true,
  queuePosition: 1,
  estimatedWaitMinutes: 3,
  sessionState: mockSessionState,
};

export const mockSubmitSegmentResponse = {
  success: true,
  sessionState: {
    ...mockSessionState,
    currentContributorId: "contrib-3",
  },
};

export const mockValidationErrorResponse = {
  success: false,
  error: "Validation failed",
  details: {
    openingSegment: "Must be 50-100 words (currently 25)",
  },
};

export const mockSessionNotFoundResponse = {
  success: false,
  error: "Session not found",
};

// =============================================================================
// Form Data
// =============================================================================

export const mockValidOpeningSegment =
  "Once upon a time in a forgotten village, there lived a curious child who discovered an ancient map hidden beneath the floorboards of an abandoned house. The map showed mysterious paths leading through enchanted forests and across crystal-clear rivers to destinations unknown.".repeat(
    2,
  ); // ~90 words

export const mockShortSegment = "This is too short.";

export const mockLongSegment = mockValidOpeningSegment.repeat(3); // > 200 words

export const mockValidSegment =
  "The child followed the winding path through the dense forest, where trees whispered ancient secrets and strange creatures watched from the shadows with glowing eyes that pierced the gathering darkness.";

export const mockThemeOptions = [
  { value: "", label: "Sin tema" },
  {
    value: "Un misterio en la biblioteca",
    label: "Un misterio en la biblioteca",
  },
  { value: "El viaje de un objeto", label: "El viaje de un objeto" },
];

// =============================================================================
// User and Identity Mocks
// =============================================================================

export const mockAnonymousIdentity: AnonymousIdentity = {
  id: "user-456",
  createdAt: new Date("2024-01-15T10:00:00Z"),
  lastSeenAt: new Date("2024-01-15T12:00:00Z"),
  sessions: [
    {
      sessionId: "session-123",
      role: "contributor",
      joinedAt: new Date("2024-01-15T10:00:00Z"),
    },
  ],
};

export const mockNamedIdentity = {
  id: "user-789",
  name: "Alice Writer",
  isAnonymous: false,
  joinedAt: new Date("2024-01-15T10:30:00Z"),
};

// =============================================================================
// Timer and UI State
// =============================================================================

export const mockTimerState = {
  timeRemaining: 300, // 5 minutes
  isActive: true,
  isWarning: false,
  isExpired: false,
};

export const mockTimerWarningState = {
  timeRemaining: 30, // 30 seconds
  isActive: true,
  isWarning: true,
  isExpired: false,
};
