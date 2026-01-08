/**
 * Cadavre Collaborative Writing - Session Store Unit Tests
 *
 * Tests for the core session store logic including session creation,
 * segment submission, turn management, and voting.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SessionStore } from "@/lib/store";

// Helper to create anonymous IDs for testing
function createTestAnonymousId(): string {
  return `anon_${Math.random().toString(36).substring(2, 15)}`;
}

describe("SessionStore", () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore();
  });

  describe("Session Creation", () => {
    it("should create a new session with valid data", () => {
      const result = store.createSession({
        theme: "Un misterio en la biblioteca",
        openingSegment:
          "Era una vez en una biblioteca antigua donde los libros susurraban secretos.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creador Test",
        creatorIsAnonymous: false,
      });

      expect(result.session).toBeDefined();
      expect(result.session.id).toHaveLength(8);
      expect(result.session.theme).toBe("Un misterio en la biblioteca");
      expect(result.session.status).toBe("waiting");
      expect(result.session.maxContributors).toBe(7);
      expect(result.session.currentTurnIndex).toBe(-1);
    });

    it("should generate unique contributor and observer links", () => {
      const result = store.createSession({
        theme: null,
        openingSegment:
          "Test segment content with enough words for validation.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Test",
        creatorIsAnonymous: true,
      });

      expect(result.contributorLink).toBeTruthy();
      expect(result.observerLink).toBeTruthy();
      expect(result.contributorLink).not.toBe(result.observerLink);
    });

    it("should add creator as first contributor", () => {
      const userId = createTestAnonymousId();
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for testing purposes here.",
        maxContributors: 7,
        createdBy: userId,
        creatorName: "Test Creator",
        creatorIsAnonymous: false,
      });

      expect(result.creatorContributor).toBeDefined();
      expect(result.creatorContributor.userId).toBe(userId);
      expect(result.creatorContributor.status).toBe("pending");
      expect(result.creatorContributor.hasPassed).toBe(false);
    });

    it("should create opening segment with position 0", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "This is the first segment of the story.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: true,
      });

      const segments = store.getSegments(result.session.id);
      expect(segments).toHaveLength(1);
      expect(segments[0].position).toBe(0);
      expect(segments[0].content).toBe(
        "This is the first segment of the story.",
      );
    });
  });

  describe("Segment Management", () => {
    it("should add segments to a session", () => {
      const userId = createTestAnonymousId();
      const result = store.createSession({
        theme: null,
        openingSegment: "First segment content for testing.",
        maxContributors: 7,
        createdBy: userId,
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const newSegment = store.addSegment(result.session.id, {
        authorId: userId,
        authorName: "Test Author",
        isAnonymous: false,
        content: "Second segment continuing the story forward.",
      });

      expect(newSegment).toBeDefined();
      expect(newSegment?.position).toBe(1);

      const segments = store.getSegments(result.session.id);
      expect(segments).toHaveLength(2);
    });

    it("should return null when adding segment to non-existent session", () => {
      const result = store.addSegment("nonexistent", {
        authorId: "user123",
        authorName: "Test",
        isAnonymous: false,
        content: "Some content here for testing.",
      });

      expect(result).toBeNull();
    });

    it("should get the last segment", () => {
      const userId = createTestAnonymousId();
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment one.",
        maxContributors: 7,
        createdBy: userId,
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.addSegment(result.session.id, {
        authorId: "anotheruser",
        authorName: "Another",
        isAnonymous: false,
        content: "Second segment content goes here.",
      });

      const lastSegment = store.getLastSegment(result.session.id);
      expect(lastSegment).toBeDefined();
      expect(lastSegment?.position).toBe(1);
    });
  });

  describe("Contributor Management", () => {
    it("should add a contributor to a session", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for contributor test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const newContributor = store.addContributor(result.session.id, {
        userId: "newuser123",
        linkToken: "testtoken123456",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });

      expect(newContributor).toBeDefined();
      expect(newContributor?.userId).toBe("newuser123");

      const contributors = store.getContributors(result.session.id);
      expect(contributors).toHaveLength(2);
    });

    it("should get contributor by token", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for contributor test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const contributor = store.getContributorByToken(
        result.session.id,
        result.creatorContributor.linkToken,
      );

      expect(contributor).toBeDefined();
      expect(contributor?.id).toBe(result.creatorContributor.id);
    });

    it("should return null for invalid token", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for contributor test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const contributor = store.getContributorByToken(
        result.session.id,
        "invalidtoken12345",
      );

      expect(contributor).toBeNull();
    });
  });

  describe("Turn Management", () => {
    it("should start a session", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for turn test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const started = store.startSession(result.session.id);

      expect(started).toBe(true);

      const session = store.getSession(result.session.id);
      expect(session?.status).toBe("active");
      expect(session?.currentTurnIndex).toBe(0);
    });

    it("should not start an already started session", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for turn test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);
      const startedAgain = store.startSession(result.session.id);

      expect(startedAgain).toBe(false);
    });

    it("should advance turn after submission", () => {
      const userId = createTestAnonymousId();
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for turn advance test.",
        maxContributors: 7,
        createdBy: userId,
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);

      // Add another contributor
      store.addContributor(result.session.id, {
        userId: "user2",
        linkToken: "token2",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });

      // Advance turn to contributor 2
      store.advanceTurn(result.session.id);

      const session = store.getSession(result.session.id);
      expect(session?.currentTurnIndex).toBe(1);
    });

    it("should pass turn", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for pass test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);

      const passed = store.passTurn(
        result.session.id,
        result.creatorContributor.id,
      );

      expect(passed).toBe(true);

      const contributor = store.getContributor(
        result.session.id,
        result.creatorContributor.userId,
      );
      expect(contributor?.hasPassed).toBe(true);
      expect(contributor?.status).toBe("completed");
    });
  });

  describe("Session Completion", () => {
    it("should check completion when max contributors reached", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for completion test.",
        maxContributors: 2,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);

      // Add second contributor
      store.addContributor(result.session.id, {
        userId: "user2",
        linkToken: "token2",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });

      const completed = store.checkCompletion(result.session.id);

      expect(completed).toBe(true);

      const session = store.getSession(result.session.id);
      expect(session?.status).toBe("completed");
    });

    it("should add session to moderation queue", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for moderation test.",
        maxContributors: 2,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);
      store.addContributor(result.session.id, {
        userId: "user2",
        linkToken: "token2",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });
      store.checkCompletion(result.session.id);

      const added = store.addToModerationQueue(result.session.id);

      expect(added).toBe(true);

      const session = store.getSession(result.session.id);
      expect(session?.status).toBe("moderation");
    });

    it("should moderate session as approved", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for approve test.",
        maxContributors: 2,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);
      store.addContributor(result.session.id, {
        userId: "user2",
        linkToken: "token2",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });
      store.checkCompletion(result.session.id);
      store.addToModerationQueue(result.session.id);

      const moderated = store.moderateSession(result.session.id, true);

      expect(moderated).toBe(true);

      const session = store.getSession(result.session.id);
      expect(session?.status).toBe("published");
    });

    it("should moderate session as rejected", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for reject test.",
        maxContributors: 2,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.startSession(result.session.id);
      store.addContributor(result.session.id, {
        userId: "user2",
        linkToken: "token2",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });
      store.checkCompletion(result.session.id);
      store.addToModerationQueue(result.session.id);

      const moderated = store.moderateSession(result.session.id, false);

      expect(moderated).toBe(true);

      const session = store.getSession(result.session.id);
      expect(session?.status).toBe("rejected");
    });
  });

  describe("Voting", () => {
    it("should return vote status with correct data", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment for voting test.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const voteStatus = store.getVoteStatus(result.session.id);

      expect(voteStatus.inProgress).toBe(false);
      expect(voteStatus.votesForEnd).toBe(0);
      expect(voteStatus.totalVotes).toBe(1); // Only the creator is eligible
      expect(voteStatus.hasVoted).toBe(false);
    });

    it("should not allow vote when minimum contributions not reached", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const canPropose = store.canProposeEnd(result.session.id);

      expect(canPropose).toBe(false);
    });

    it("should allow vote after minimum contributions", () => {
      const userId = createTestAnonymousId();
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: userId,
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      // Add 5 segments (4 more after opening)
      for (let i = 0; i < 4; i++) {
        store.addSegment(result.session.id, {
          authorId: `author${i}`,
          authorName: `Author ${i}`,
          isAnonymous: false,
          content: `Segment number ${i + 1} with enough words for validation.`,
        });
      }

      const canPropose = store.canProposeEnd(result.session.id);

      expect(canPropose).toBe(true);
    });

    it("should record vote and check threshold", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      // Start the session first
      store.startSession(result.session.id);

      // Add 5 segments to allow voting (4 more after opening)
      for (let i = 0; i < 4; i++) {
        store.addSegment(result.session.id, {
          authorId: `author${i}`,
          authorName: `Author ${i}`,
          isAnonymous: false,
          content: `Segment content for voting test number ${i + 1}.`,
        });
      }

      const votePassed = store.voteToEnd(
        result.session.id,
        result.creatorContributor.id,
      );

      // With 1 eligible voter (the creator), 1 vote reaches 60% threshold
      expect(votePassed).toBe(true);

      // Check vote status with userId to verify hasVoted
      const voteStatus = store.getVoteStatus(
        result.session.id,
        result.creatorContributor.userId,
      );
      expect(voteStatus.votesForEnd).toBe(1);
      expect(voteStatus.hasVoted).toBe(true);
    });
  });

  describe("Link Management", () => {
    it("should record link click", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const token = result.contributorLink.split("/").pop() || "";

      const recorded = store.recordLinkClick(token);

      expect(recorded).toBe(true);
    });

    it("should return false for invalid link click", () => {
      const recorded = store.recordLinkClick("invalidtoken12345");

      expect(recorded).toBe(false);
    });

    it("should get link by token", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const token = result.contributorLink.split("/").pop() || "";
      const link = store.getLinkByToken(token);

      expect(link).toBeDefined();
      expect(link?.linkType).toBe("contributor");
    });

    it("should return null for revoked link", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const token = result.contributorLink.split("/").pop() || "";
      store.revokeLink(token);

      const link = store.getLinkByToken(token);

      expect(link).toBeNull();
    });
  });

  describe("Session State", () => {
    it("should get session state with correct data", () => {
      const userId = createTestAnonymousId();
      const result = store.createSession({
        theme: "Test Theme",
        openingSegment: "Opening segment for state test.",
        maxContributors: 7,
        createdBy: userId,
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      const state = store.getSessionState(result.session.id, userId);

      expect(state).toBeDefined();
      expect(state?.session.theme).toBe("Test Theme");
      expect(state?.segments).toHaveLength(1);
      expect(state?.contributors).toHaveLength(1);
    });

    it("should return null for non-existent session state", () => {
      const state = store.getSessionState("nonexistent", "user123");

      expect(state).toBeNull();
    });

    it("should report correct contributor count", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      // Add 3 more contributors
      for (let i = 0; i < 3; i++) {
        store.addContributor(result.session.id, {
          userId: `user${i}`,
          linkToken: `token${i}`,
          linkType: "contributor",
          status: "pending",
          hasPassed: false,
        });
      }

      const count = store.getContributorCount(result.session.id);

      expect(count).toBe(4); // 1 creator + 3 added
    });

    it("should report correct available slot status", () => {
      const result = store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 3, // Small number for testing
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      // Add 2 more contributors (total 3, which is max)
      store.addContributor(result.session.id, {
        userId: "user1",
        linkToken: "token1",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });

      store.addContributor(result.session.id, {
        userId: "user2",
        linkToken: "token2",
        linkType: "contributor",
        status: "pending",
        hasPassed: false,
      });

      const hasSlot = store.hasAvailableSlot(result.session.id);

      expect(hasSlot).toBe(false); // Should be full now
    });
  });

  describe("Store Statistics", () => {
    it("should return correct stats", () => {
      store.getStats(); // Initial stats check (not used but demonstrates API)

      // Create 2 sessions
      for (let i = 0; i < 2; i++) {
        store.createSession({
          theme: null,
          openingSegment: `Opening segment ${i}.`,
          maxContributors: 7,
          createdBy: createTestAnonymousId(),
          creatorName: "Creator",
          creatorIsAnonymous: false,
        });
      }

      const stats = store.getStats();

      expect(stats.sessionCount).toBe(2);
      expect(stats.totalSegments).toBe(2);
      expect(stats.totalContributors).toBe(2);
      expect(stats.totalLinks).toBe(4); // 2 contributor + 2 observer links
    });

    it("should clear all data", () => {
      store.createSession({
        theme: null,
        openingSegment: "Opening segment.",
        maxContributors: 7,
        createdBy: createTestAnonymousId(),
        creatorName: "Creator",
        creatorIsAnonymous: false,
      });

      store.clear();

      const stats = store.getStats();
      expect(stats.sessionCount).toBe(0);
      expect(stats.totalSegments).toBe(0);
    });
  });
});
