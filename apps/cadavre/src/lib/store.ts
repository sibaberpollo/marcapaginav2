/**
 * Cadavre Collaborative Writing - Session Store
 *
 * In-memory storage system for sessions, segments, and contributors.
 * Structured for easy migration to a database (Redis, PostgreSQL, etc.) in production.
 */

import {
  type Session,
  type Segment,
  type Contributor,
  type SessionLink,
  type ContributorStatus,
  type SessionState,
  type VoteStatus,
  MIN_CONTRIBUTORS_FOR_VOTE,
  VOTE_THRESHOLD_PERCENTAGE,
} from "@/lib/types";

// =============================================================================
// Constants
// =============================================================================

const SESSION_ID_LENGTH = 8;
const LINK_TOKEN_LENGTH = 16;

// =============================================================================
// Helper Types
// =============================================================================

/**
 * Input data for creating a session.
 */
interface CreateSessionData {
  theme: string | null;
  openingSegment: string;
  maxContributors: number;
  createdBy: string;
  creatorName: string;
  creatorIsAnonymous: boolean;
}

/**
 * Extended segment with author information for state building.
 */
interface SegmentWithAuthor extends Segment {
  authorName: string;
  isAnonymous: boolean;
}

// =============================================================================
// SessionStore Class
// =============================================================================

/**
 * In-memory storage for collaborative writing sessions.
 *
 * Uses Map-based storage for O(1) lookups and efficient iteration.
 * Designed to be thread-safe for future scaling (e.g., database migration).
 */
export class SessionStore {
  // Primary storage: sessionId -> Session
  private sessions: Map<string, Session> = new Map();

  // sessionId -> Segment[] (sorted by position)
  private segments: Map<string, Segment[]> = new Map();

  // sessionId -> Contributor[]
  private contributors: Map<string, Contributor[]> = new Map();

  // token -> SessionLink
  private links: Map<string, SessionLink> = new Map();

  // sessionId -> Set<contributorId> (who voted to end)
  private voteTracking: Map<string, Set<string>> = new Map();

  // =============================================================================
  // Session CRUD Operations
  // =============================================================================

  /**
   * Create a new collaborative writing session.
   *
   * @param data - Session creation data including theme, opening segment, and creator info
   * @returns The created session with links
   */
  createSession(data: CreateSessionData): {
    session: Session;
    contributorLink: string;
    observerLink: string;
    creatorContributor: Contributor;
  } {
    const sessionId = this.generateSessionId();
    const slug = this.generateSlug();
    const now = new Date();

    // Create the session
    const session: Session = {
      id: sessionId,
      slug,
      theme: data.theme,
      openingSegment: data.openingSegment,
      maxContributors: data.maxContributors,
      status: "waiting",
      currentTurnIndex: -1,
      createdAt: now,
      completedAt: null,
      createdBy: data.createdBy,
    };

    this.sessions.set(sessionId, session);

    // Create contributor and observer links
    const contributorLinkToken = this.generateLinkToken();
    const observerLinkToken = this.generateLinkToken();

    const contributorLink: SessionLink = {
      id: this.generateSessionId(), // Reuse ID generator for link IDs
      sessionId,
      linkType: "contributor",
      token: contributorLinkToken,
      isActive: true,
      expiresAt: null,
      createdAt: now,
      revokedAt: null,
      clickCount: 0,
    };

    const observerLink: SessionLink = {
      id: this.generateSessionId(),
      sessionId,
      linkType: "observer",
      token: observerLinkToken,
      isActive: true,
      expiresAt: null,
      createdAt: now,
      revokedAt: null,
      clickCount: 0,
    };

    this.links.set(contributorLinkToken, contributorLink);
    this.links.set(observerLinkToken, observerLink);

    // Create the opening segment (position 0)
    const openingSegment: Segment = {
      id: this.generateSessionId(),
      sessionId,
      authorId: data.createdBy,
      authorName: data.creatorIsAnonymous ? "Anon" : data.creatorName,
      isAnonymous: data.creatorIsAnonymous,
      content: data.openingSegment,
      position: 0,
      submittedAt: now,
    };

    this.segments.set(sessionId, [openingSegment]);

    // Add creator as the first contributor (position 0 in turn order)
    const creatorContributor: Contributor = {
      id: this.generateSessionId(),
      sessionId,
      userId: data.createdBy,
      linkToken: contributorLinkToken,
      linkType: "contributor",
      status: "pending",
      hasPassed: false,
      joinedAt: now,
      turnIndex: 0,
    };

    this.contributors.set(sessionId, [creatorContributor]);

    return {
      session,
      contributorLink: this.buildLinkUrl(contributorLinkToken),
      observerLink: this.buildLinkUrl(observerLinkToken),
      creatorContributor,
    };
  }

  /**
   * Get a session by ID.
   *
   * @param sessionId - The session ID to look up
   * @returns The session or null if not found
   */
  getSession(sessionId: string): Session | null {
    return this.sessions.get(sessionId) ?? null;
  }

  /**
   * Get a session by slug.
   *
   * @param slug - The URL-friendly slug to look up
   * @returns The session or null if not found
   */
  getSessionBySlug(slug: string): Session | null {
    for (const session of this.sessions.values()) {
      if (session.slug === slug) {
        return session;
      }
    }
    return null;
  }

  /**
   * Update a session's fields.
   *
   * @param sessionId - The session ID to update
   * @param updates - Partial session data to update
   * @returns The updated session or null if not found
   */
  updateSession(sessionId: string, updates: Partial<Session>): Session | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    const updatedSession: Session = {
      ...session,
      ...updates,
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Delete a session and all related data.
   *
   * @param sessionId - The session ID to delete
   * @returns True if the session was deleted, false if not found
   */
  deleteSession(sessionId: string): boolean {
    if (!this.sessions.has(sessionId)) {
      return false;
    }

    // Remove all related data
    this.sessions.delete(sessionId);
    this.segments.delete(sessionId);
    this.contributors.delete(sessionId);
    this.voteTracking.delete(sessionId);

    // Remove links (by finding them first)
    for (const [token, link] of this.links.entries()) {
      if (link.sessionId === sessionId) {
        this.links.delete(token);
      }
    }

    return true;
  }

  // =============================================================================
  // Segment Operations
  // =============================================================================

  /**
   * Add a new segment to a session.
   *
   * @param sessionId - The session ID
   * @param segment - The segment data (without ID and position)
   * @returns The created segment
   */
  addSegment(
    sessionId: string,
    segment: Omit<Segment, "id" | "sessionId" | "position" | "submittedAt">,
  ): Segment | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    const existingSegments = this.segments.get(sessionId) ?? [];
    const newPosition = existingSegments.length;

    const newSegment: Segment = {
      ...segment,
      id: this.generateSessionId(),
      sessionId,
      position: newPosition,
      submittedAt: new Date(),
    };

    existingSegments.push(newSegment);
    this.segments.set(sessionId, existingSegments);

    return newSegment;
  }

  /**
   * Get all segments for a session, sorted by position.
   *
   * @param sessionId - The session ID
   * @returns Array of segments sorted by position
   */
  getSegments(sessionId: string): Segment[] {
    const segments = this.segments.get(sessionId) ?? [];
    return [...segments].sort((a, b) => a.position - b.position);
  }

  /**
   * Get the last (most recent) segment for a session.
   *
   * @param sessionId - The session ID
   * @returns The last segment or null if no segments exist
   */
  getLastSegment(sessionId: string): Segment | null {
    const segments = this.segments.get(sessionId) ?? [];
    if (segments.length === 0) {
      return null;
    }
    return segments[segments.length - 1] ?? null;
  }

  // =============================================================================
  // Contributor Operations
  // =============================================================================

  /**
   * Add a contributor to a session.
   *
   * @param sessionId - The session ID
   * @param contributor - The contributor data
   * @returns The created contributor or null if session not found
   */
  addContributor(
    sessionId: string,
    contributor: Omit<
      Contributor,
      "id" | "sessionId" | "joinedAt" | "turnIndex"
    >,
  ): Contributor | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    const existingContributors = this.contributors.get(sessionId) ?? [];
    const turnIndex = existingContributors.length;

    const newContributor: Contributor = {
      ...contributor,
      id: this.generateSessionId(),
      sessionId,
      joinedAt: new Date(),
      turnIndex,
    };

    existingContributors.push(newContributor);
    this.contributors.set(sessionId, existingContributors);

    return newContributor;
  }

  /**
   * Get all contributors for a session.
   *
   * @param sessionId - The session ID
   * @returns Array of contributors
   */
  getContributors(sessionId: string): Contributor[] {
    const contributors = this.contributors.get(sessionId) ?? [];
    return [...contributors].sort((a, b) => a.turnIndex - b.turnIndex);
  }

  /**
   * Get a specific contributor by session and user ID.
   *
   * @param sessionId - The session ID
   * @param userId - The user ID to look up
   * @returns The contributor or null if not found
   */
  getContributor(sessionId: string, userId: string): Contributor | null {
    const contributors = this.contributors.get(sessionId) ?? [];
    return contributors.find((c) => c.userId === userId) ?? null;
  }

  /**
   * Get a contributor by their link token.
   *
   * @param sessionId - The session ID
   * @param token - The link token
   * @returns The contributor or null if not found
   */
  getContributorByToken(sessionId: string, token: string): Contributor | null {
    const contributors = this.contributors.get(sessionId) ?? [];
    return contributors.find((c) => c.linkToken === token) ?? null;
  }

  /**
   * Get a contributor by their ID.
   *
   * @param sessionId - The session ID
   * @param contributorId - The contributor ID
   * @returns The contributor or null if not found
   */
  getContributorById(
    sessionId: string,
    contributorId: string,
  ): Contributor | null {
    const contributors = this.contributors.get(sessionId) ?? [];
    return contributors.find((c) => c.id === contributorId) ?? null;
  }

  // =============================================================================
  // Link Operations
  // =============================================================================

  /**
   * Store a new session link.
   *
   * @param sessionId - The session ID
   * @param link - The link data (without ID)
   * @returns The created link
   */
  addLink(
    sessionId: string,
    link: Omit<SessionLink, "id" | "sessionId" | "createdAt" | "clickCount">,
  ): SessionLink {
    const newLink: SessionLink = {
      ...link,
      id: this.generateSessionId(),
      sessionId,
      createdAt: new Date(),
      clickCount: 0,
    };

    this.links.set(link.token, newLink);
    return newLink;
  }

  /**
   * Get a link by its token.
   *
   * @param token - The link token
   * @returns The link or null if not found
   */
  getLinkByToken(token: string): SessionLink | null {
    const link = this.links.get(token);
    // Return null if link doesn't exist or is revoked
    if (!link || (link.revokedAt !== null && link.revokedAt !== undefined)) {
      return null;
    }
    // Return null if link has expired
    if (link.expiresAt && link.expiresAt < new Date()) {
      return null;
    }
    return link;
  }

  /**
   * Increment the click count for a link.
   *
   * @param token - The link token
   * @returns True if the link was found and updated
   */
  recordLinkClick(token: string): boolean {
    const link = this.links.get(token);
    if (!link) {
      return false;
    }

    const updatedLink: SessionLink = {
      ...link,
      clickCount: link.clickCount + 1,
    };

    this.links.set(token, updatedLink);
    return true;
  }

  /**
   * Revoke a link by token.
   *
   * @param token - The link token to revoke
   * @returns True if the link was revoked, false if not found
   */
  revokeLink(token: string): boolean {
    const link = this.links.get(token);
    if (!link) {
      return false;
    }

    const updatedLink: SessionLink = {
      ...link,
      isActive: false,
      revokedAt: new Date(),
    };

    this.links.set(token, updatedLink);
    return true;
  }

  // =============================================================================
  // Turn Management
  // =============================================================================

  /**
   * Get the next eligible contributor to write.
   *
   * @param sessionId - The session ID
   * @returns The next contributor or null if no eligible contributor
   */
  getNextContributor(sessionId: string): Contributor | null {
    const contributors = this.contributors.get(sessionId) ?? [];
    const session = this.sessions.get(sessionId);

    if (!session || session.currentTurnIndex === -1) {
      return null;
    }

    const currentTurn = session.currentTurnIndex;

    // Find contributors after current turn who are eligible
    for (let i = 1; i < contributors.length; i++) {
      const candidateIndex = (currentTurn + i) % contributors.length;
      const candidate = contributors[candidateIndex];

      if (
        candidate.status === "pending" &&
        !candidate.hasPassed &&
        candidate.turnIndex >= currentTurn
      ) {
        return candidate;
      }
    }

    // Check if all contributors after current have passed or completed
    return null;
  }

  /**
   * Advance the turn to the next contributor.
   *
   * @param sessionId - The session ID
   * @returns True if the turn was advanced, false if no more contributors
   */
  advanceTurn(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    const contributors = this.contributors.get(sessionId) ?? [];

    if (!session || contributors.length === 0) {
      return false;
    }

    const currentIndex = session.currentTurnIndex;

    // Mark current contributor as completed
    if (currentIndex !== -1) {
      const currentContributor = contributors[currentIndex];
      if (currentContributor) {
        const updatedCurrent: Contributor = {
          ...currentContributor,
          status: "completed",
        };
        contributors[currentIndex] = updatedCurrent;
      }
    }

    // Find next eligible contributor
    let nextIndex = -1;
    for (let i = 1; i < contributors.length; i++) {
      const candidateIndex = (currentIndex + i) % contributors.length;
      const candidate = contributors[candidateIndex];

      if (candidate.status === "pending" && !candidate.hasPassed) {
        nextIndex = candidateIndex;
        break;
      }
    }

    if (nextIndex === -1) {
      // No more contributors - check completion
      this.checkCompletion(sessionId);
      return false;
    }

    // Update session with new turn
    const updatedSession: Session = {
      ...session,
      currentTurnIndex: nextIndex,
    };

    // Mark next contributor as active
    const nextContributor = contributors[nextIndex];
    if (nextContributor) {
      const updatedNext: Contributor = {
        ...nextContributor,
        status: "active",
      };
      contributors[nextIndex] = updatedNext;
    }

    this.sessions.set(sessionId, updatedSession);
    this.contributors.set(sessionId, contributors);

    return true;
  }

  /**
   * Start the session - set the first contributor as active.
   *
   * @param sessionId - The session ID
   * @returns True if the session was started
   */
  startSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    const contributors = this.contributors.get(sessionId) ?? [];

    if (!session || session.status !== "waiting" || contributors.length === 0) {
      return false;
    }

    // Update session status
    const updatedSession: Session = {
      ...session,
      status: "active",
      currentTurnIndex: 0,
    };

    // Mark first contributor as active
    const updatedContributors: Contributor[] = contributors.map((c, index) => ({
      ...c,
      status: (index === 0 ? "active" : "pending") as ContributorStatus,
    }));

    this.sessions.set(sessionId, updatedSession);
    this.contributors.set(sessionId, updatedContributors);

    return true;
  }

  /**
   * Pass the current turn.
   *
   * @param sessionId - The session ID
   * @param contributorId - The contributor ID passing their turn
   * @returns True if the pass was successful
   */
  passTurn(sessionId: string, contributorId: string): boolean {
    const contributors = this.contributors.get(sessionId) ?? [];
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    // Find and mark the contributor as passed
    const contributorIndex = contributors.findIndex(
      (c) => c.id === contributorId,
    );
    if (contributorIndex === -1) {
      return false;
    }

    const updatedContributor: Contributor = {
      ...contributors[contributorIndex],
      hasPassed: true,
      status: "completed",
    };
    contributors[contributorIndex] = updatedContributor;

    // If passing the current turn, advance to next
    if (contributorIndex === session.currentTurnIndex) {
      return this.advanceTurn(sessionId);
    }

    this.contributors.set(sessionId, contributors);
    return true;
  }

  // =============================================================================
  // Voting Operations
  // =============================================================================

  /**
   * Record a vote to end the session.
   *
   * @param sessionId - The session ID
   * @param contributorId - The contributor ID voting
   * @returns True if the session should end due to vote threshold
   */
  voteToEnd(sessionId: string, contributorId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== "active") {
      return false;
    }

    // Ensure vote tracking exists
    if (!this.voteTracking.has(sessionId)) {
      this.voteTracking.set(sessionId, new Set());
    }

    const votes = this.voteTracking.get(sessionId)!;

    // Don't allow duplicate votes
    if (votes.has(contributorId)) {
      return false;
    }

    // Add vote
    votes.add(contributorId);

    // Check if threshold is reached
    const eligibleVoters = this.getEligibleVoters(sessionId);
    const threshold = Math.ceil(
      eligibleVoters.length * VOTE_THRESHOLD_PERCENTAGE,
    );

    if (votes.size >= threshold) {
      // Update session status to voting then completed
      this.updateSession(sessionId, { status: "voting" });
      this.updateSession(sessionId, { status: "completed" });
      return true;
    }

    return false;
  }

  /**
   * Get the current vote status for a session.
   *
   * @param sessionId - The session ID
   * @param userId - Optional user ID to check if they've voted
   * @returns The vote status
   */
  getVoteStatus(sessionId: string, userId?: string): VoteStatus {
    const session = this.sessions.get(sessionId);
    const votes = this.voteTracking.get(sessionId) ?? new Set();

    const eligibleVoters = this.getEligibleVoters(sessionId);

    let contributorId: string | null = null;
    if (userId) {
      const contributor = this.getContributor(sessionId, userId);
      contributorId = contributor?.id ?? null;
    }

    return {
      inProgress: session?.status === "voting",
      votesForEnd: votes.size,
      totalVotes: eligibleVoters.length,
      hasVoted: contributorId !== null && votes.has(contributorId),
      canProposeEnd: this.canProposeEnd(sessionId),
    };
  }

  /**
   * Check if a session can propose to end (minimum contributions reached).
   *
   * @param sessionId - The session ID
   * @returns True if the session can propose to end
   */
  canProposeEnd(sessionId: string): boolean {
    const segments = this.segments.get(sessionId) ?? [];
    return segments.length >= MIN_CONTRIBUTORS_FOR_VOTE;
  }

  // =============================================================================
  // State & Completion
  // =============================================================================

  /**
   * Get the complete state of a session for the UI.
   *
   * @param sessionId - The session ID
   * @param userId - Optional user ID to calculate personal state
   * @returns The complete session state
   */
  getSessionState(sessionId: string, userId?: string): SessionState | null {
    const session = this.sessions.get(sessionId);
    const contributors = this.contributors.get(sessionId) ?? [];
    const segments = this.segments.get(sessionId) ?? [];

    if (!session) {
      return null;
    }

    // Get author names for segments (from segment properties)
    const segmentsWithAuthor: SegmentWithAuthor[] = segments.map((segment) => {
      return {
        ...segment,
        authorName: segment.authorName,
        isAnonymous: segment.isAnonymous,
      };
    });

    // Determine current contributor
    let currentContributorId: string | null = null;
    if (
      session.currentTurnIndex !== -1 &&
      contributors[session.currentTurnIndex]
    ) {
      currentContributorId = contributors[session.currentTurnIndex].id;
    }

    // Calculate user's position and turn status
    let myPosition = -1;
    let isMyTurn = false;

    if (userId) {
      const myContributor = contributors.find((c) => c.userId === userId);
      if (myContributor) {
        myPosition = myContributor.turnIndex;
        isMyTurn = myContributor.id === currentContributorId;
      }
    }

    // Mask segments based on turn status
    const visibleSegments = this.getVisibleSegments(
      sessionId,
      userId,
      segmentsWithAuthor,
    );

    // Get vote status
    const voteStatus =
      session.status === "voting"
        ? this.getVoteStatus(sessionId, userId)
        : null;

    return {
      session,
      segments: visibleSegments,
      contributors,
      currentContributorId,
      myPosition,
      isMyTurn,
      voteStatus,
    };
  }

  /**
   * Get visible segments based on turn and visibility rules.
   */
  private getVisibleSegments(
    sessionId: string,
    userId: string | undefined,
    segments: SegmentWithAuthor[],
  ): SegmentWithAuthor[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    // If session is completed, show all segments
    if (session.status === "completed" || session.status === "published") {
      return segments;
    }

    // If not logged in, only show opening segment
    if (!userId) {
      return segments.filter((s) => s.position === 0);
    }

    // Get user's contributor record
    const contributor = this.getContributor(sessionId, userId);
    if (!contributor) {
      // User is an observer - show opening segment only
      return segments.filter((s) => s.position === 0);
    }

    // If it's user's turn, show all segments
    if (session.currentTurnIndex === contributor.turnIndex) {
      return segments;
    }

    // Otherwise, show all segments (contributors can see history)
    return segments;
  }

  /**
   * Check if a session is complete and update status if so.
   *
   * @param sessionId - The session ID
   * @returns True if the session is complete
   */
  checkCompletion(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    const contributors = this.contributors.get(sessionId) ?? [];

    if (!session || session.status !== "active") {
      return false;
    }

    const activeContributors = this.getActiveContributors(sessionId);
    const maxReached = contributors.length >= session.maxContributors;
    const allDone = activeContributors.length === 0;

    if (maxReached || allDone) {
      this.updateSession(sessionId, {
        status: "completed",
        completedAt: new Date(),
      });
      return true;
    }

    return false;
  }

  /**
   * Move session to moderation queue.
   *
   * @param sessionId - The session ID
   * @returns True if the session was moved to moderation
   */
  addToModerationQueue(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== "completed") {
      return false;
    }

    this.updateSession(sessionId, { status: "moderation" });
    return true;
  }

  /**
   * Moderate a session (approve or reject).
   *
   * @param sessionId - The session ID
   * @param approved - True to approve, false to reject
   * @returns True if the moderation was applied
   */
  moderateSession(sessionId: string, approved: boolean): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== "moderation") {
      return false;
    }

    this.updateSession(sessionId, {
      status: approved ? "published" : "rejected",
    });
    return true;
  }

  // =============================================================================
  // Helper Methods
  // =============================================================================

  /**
   * Generate a unique 8-character alphanumeric session ID.
   */
  generateSessionId(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint8Array(SESSION_ID_LENGTH);

    // Use crypto for secure random values
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      // Fallback for older environments
      for (let i = 0; i < SESSION_ID_LENGTH; i++) {
        randomValues[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < SESSION_ID_LENGTH; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    // Ensure uniqueness
    if (this.sessions.has(result)) {
      return this.generateSessionId();
    }

    return result;
  }

  /**
   * Generate a URL-friendly slug.
   */
  generateSlug(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint8Array(6);

    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      for (let i = 0; i < 6; i++) {
        randomValues[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < 6; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    // Ensure uniqueness
    if (this.getSessionBySlug(result)) {
      return this.generateSlug();
    }

    return result;
  }

  /**
   * Generate a cryptographically secure link token.
   */
  generateLinkToken(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint8Array(LINK_TOKEN_LENGTH);

    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      for (let i = 0; i < LINK_TOKEN_LENGTH; i++) {
        randomValues[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < LINK_TOKEN_LENGTH; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    // Ensure uniqueness
    if (this.links.has(result)) {
      return this.generateLinkToken();
    }

    return result;
  }

  /**
   * Build a full URL for a link token.
   */
  private buildLinkUrl(token: string): string {
    // In a real application, this would use the actual base URL
    return `/join/${token}`;
  }

  /**
   * Get contributors who haven't completed or passed.
   *
   * @param sessionId - The session ID
   * @returns Array of active contributors
   */
  getActiveContributors(sessionId: string): Contributor[] {
    const contributors = this.contributors.get(sessionId) ?? [];
    return contributors.filter(
      (c) => c.status === "pending" || c.status === "active",
    );
  }

  /**
   * Get contributors who can vote (have contributed or are pending).
   *
   * @param sessionId - The session ID
   * @returns Array of eligible voters
   */
  getEligibleVoters(sessionId: string): Contributor[] {
    const contributors = this.contributors.get(sessionId) ?? [];
    const segments = this.segments.get(sessionId) ?? [];

    // Get user IDs who have contributed
    const contributingUserIds = new Set(segments.map((s) => s.authorId));

    // Voters are contributors who have contributed OR are pending
    return contributors.filter(
      (c) =>
        contributingUserIds.has(c.userId) ||
        c.status === "pending" ||
        c.status === "active",
    );
  }

  /**
   * Get the count of contributors for a session.
   */
  getContributorCount(sessionId: string): number {
    const contributors = this.contributors.get(sessionId) ?? [];
    return contributors.length;
  }

  /**
   * Check if a session has an available contributor slot.
   */
  hasAvailableSlot(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    const contributorCount = this.getContributorCount(sessionId);
    return contributorCount < session.maxContributors;
  }

  /**
   * Clear all data (for testing purposes).
   */
  clear(): void {
    this.sessions.clear();
    this.segments.clear();
    this.contributors.clear();
    this.links.clear();
    this.voteTracking.clear();
  }

  /**
   * Get store statistics (for debugging/monitoring).
   */
  getStats(): {
    sessionCount: number;
    totalSegments: number;
    totalContributors: number;
    totalLinks: number;
  } {
    let totalSegments = 0;
    for (const segments of this.segments.values()) {
      totalSegments += segments.length;
    }

    let totalContributors = 0;
    for (const contributors of this.contributors.values()) {
      totalContributors += contributors.length;
    }

    return {
      sessionCount: this.sessions.size,
      totalSegments,
      totalContributors,
      totalLinks: this.links.size,
    };
  }
}

// =============================================================================
// Singleton Instance
// =============================================================================

/**
 * Singleton instance of the session store for use throughout the application.
 */
export const sessionStore = new SessionStore();
