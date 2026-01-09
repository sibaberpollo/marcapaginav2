/**
 * Test data factories for generating consistent mock data
 * Provides factory functions for creating test data with variations
 */

import type {
  Session,
  Contributor,
  Segment,
  SessionState,
  CreateSessionRequest,
  JoinSessionRequest,
  SubmitSegmentRequest,
  AnonymousIdentity,
} from "@/lib/types";
import {
  mockSession,
  mockVoteStatus,
  mockAnonymousIdentity,
} from "./session-state";

/**
 * Factory for creating session objects with customizable properties
 */
export class SessionFactory {
  static create(overrides: Partial<Session> = {}): Session {
    return {
      ...mockSession,
      id: `session-${Date.now()}`,
      ...overrides,
    };
  }

  static createWaiting(): Session {
    return this.create({
      status: "waiting",
      currentTurnIndex: 0,
    });
  }

  static createActive(): Session {
    return this.create({
      status: "active",
      currentTurnIndex: 1,
    });
  }

  static createCompleted(): Session {
    return this.create({
      status: "completed",
      completedAt: new Date(),
    });
  }

  static createVoting(): Session {
    return this.create({
      status: "voting",
      currentTurnIndex: 2,
    });
  }
}

/**
 * Factory for creating contributor objects
 */
export class ContributorFactory {
  static create(overrides: Partial<Contributor> = {}): Contributor {
    const id = overrides.id || `contrib-${Date.now()}`;
    return {
      id,
      sessionId: overrides.sessionId || "session-123",
      userId: overrides.userId || `user-${Date.now()}`,
      linkToken:
        overrides.linkToken ||
        `token${id}12345678901234567890`.substring(0, 20),
      linkType: "contributor",
      status: "pending",
      hasPassed: false,
      joinedAt: new Date(),
      turnIndex: 0,
      ...overrides,
    };
  }

  static createActive(sessionId: string = "session-123"): Contributor {
    return this.create({
      sessionId,
      status: "active",
      linkType: "contributor",
    });
  }

  static createObserver(sessionId: string = "session-123"): Contributor {
    return this.create({
      sessionId,
      status: "active",
      linkType: "observer",
    });
  }

  static createCompleted(sessionId: string = "session-123"): Contributor {
    return this.create({
      sessionId,
      status: "completed",
      linkType: "contributor",
    });
  }
}

/**
 * Factory for creating segment objects
 */
export class SegmentFactory {
  static create(overrides: Partial<Segment> = {}): Segment {
    const id = overrides.id || `segment-${Date.now()}`;
    return {
      id,
      sessionId: overrides.sessionId || "session-123",
      authorId: overrides.authorId || "contrib-1",
      authorName: overrides.authorName || "Test Author",
      isAnonymous: false,
      content:
        overrides.content ||
        "This is a test segment with enough words to meet the minimum requirement for validation purposes.",
      position: overrides.position || 1,
      submittedAt: new Date(),
      ...overrides,
    };
  }

  static createAnonymous(): Segment {
    return this.create({
      isAnonymous: true,
      authorName: "Anonymous",
    });
  }

  static createLong(): Segment {
    return this.create({
      content:
        "This is a much longer segment that contains significantly more content than the minimum requirement. It includes additional details and descriptions to make it more comprehensive. The story continues with more elaborate descriptions and plot development. Multiple paragraphs could be included here to test how the system handles longer content submissions with various formatting and structure.".repeat(
          2,
        ),
    });
  }
}

/**
 * Factory for creating session state objects
 */
export class SessionStateFactory {
  static create(overrides: Partial<SessionState> = {}): SessionState {
    return {
      session: overrides.session || mockSession,
      segments: overrides.segments || [],
      contributors: overrides.contributors || [],
      currentContributorId: overrides.currentContributorId || null,
      myPosition: overrides.myPosition || 0,
      isMyTurn: overrides.isMyTurn ?? false,
      voteStatus: overrides.voteStatus || null,
    };
  }

  static createWaitingState(): SessionState {
    return this.create({
      session: SessionFactory.createWaiting(),
      segments: [],
      contributors: [ContributorFactory.create()],
      currentContributorId: null,
      myPosition: 0,
      isMyTurn: false,
    });
  }

  static createActiveState(): SessionState {
    const contributors = [
      ContributorFactory.createCompleted(),
      ContributorFactory.createActive(),
    ];
    const segments = [SegmentFactory.create()];

    return this.create({
      session: SessionFactory.createActive(),
      segments,
      contributors,
      currentContributorId: contributors[1].id,
      myPosition: 1,
      isMyTurn: true,
    });
  }

  static createVotingState(): SessionState {
    return this.create({
      session: SessionFactory.createVoting(),
      segments: [SegmentFactory.create(), SegmentFactory.create()],
      contributors: [
        ContributorFactory.createCompleted(),
        ContributorFactory.createCompleted(),
        ContributorFactory.createActive(),
      ],
      currentContributorId: null,
      myPosition: 1,
      isMyTurn: false,
      voteStatus: mockVoteStatus,
    });
  }
}

/**
 * Factory for creating API request objects
 */
export class RequestFactory {
  static createSessionRequest(
    overrides: Partial<CreateSessionRequest> = {},
  ): CreateSessionRequest {
    return {
      openingSegment:
        overrides.openingSegment ||
        "This is a valid opening segment with enough words to meet the minimum requirement for session creation validation.",
      theme: overrides.theme,
      maxContributors: overrides.maxContributors || 7,
    };
  }

  static createJoinRequest(
    overrides: Partial<JoinSessionRequest> = {},
  ): JoinSessionRequest {
    return {
      linkToken: overrides.linkToken || "token12345678901234567890",
    };
  }

  static createSubmitRequest(
    overrides: Partial<SubmitSegmentRequest> = {},
  ): SubmitSegmentRequest {
    return {
      content:
        overrides.content ||
        "This is a valid segment submission with enough words to meet the minimum requirement for validation.",
    };
  }

  static createShortSegment(): SubmitSegmentRequest {
    return {
      content: "Too short",
    };
  }

  static createLongSegment(): SubmitSegmentRequest {
    return {
      content:
        "This is an extremely long segment that exceeds the maximum word count limit. ".repeat(
          50,
        ),
    };
  }
}

/**
 * Factory for creating identity objects
 */
export class IdentityFactory {
  static createAnonymous(
    overrides: Partial<AnonymousIdentity> = {},
  ): AnonymousIdentity {
    return {
      ...mockAnonymousIdentity,
      id: overrides.id || `user-${Date.now()}`,
      ...overrides,
    };
  }

  static createWithSessions(sessionCount: number = 1): AnonymousIdentity {
    const sessions = Array.from({ length: sessionCount }, (_, i) => ({
      sessionId: `session-${i + 1}`,
      role: (i % 2 === 0 ? "contributor" : "observer") as
        | "contributor"
        | "observer",
      joinedAt: new Date(Date.now() - i * 86400000), // Days ago
    }));

    return this.createAnonymous({
      sessions,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    });
  }
}

/**
 * Utility functions for generating test variations
 */
export class TestDataUtils {
  /**
   * Generate an array of sessions with different statuses
   */
  static generateSessions(count: number): Session[] {
    const statuses: Session["status"][] = [
      "waiting",
      "active",
      "voting",
      "completed",
    ];
    return Array.from({ length: count }, (_, i) =>
      SessionFactory.create({
        id: `session-${i + 1}`,
        status: statuses[i % statuses.length],
        theme: `Theme ${i + 1}`,
      }),
    );
  }

  /**
   * Generate contributors for a session
   */
  static generateContributors(sessionId: string, count: number): Contributor[] {
    return Array.from({ length: count }, (_, i) =>
      ContributorFactory.create({
        sessionId,
        id: `contrib-${i + 1}`,
        userId: `user-${i + 1}`,
        turnIndex: i,
        status: i === 0 ? "active" : "pending",
      }),
    );
  }

  /**
   * Generate a complete story chain
   */
  static generateStoryChain(
    sessionId: string,
    segmentCount: number,
  ): Segment[] {
    return Array.from({ length: segmentCount }, (_, i) =>
      SegmentFactory.create({
        sessionId,
        id: `segment-${i + 1}`,
        position: i + 1,
        authorId: `contrib-${(i % 3) + 1}`,
        authorName: `Author ${(i % 3) + 1}`,
        submittedAt: new Date(Date.now() - (segmentCount - i) * 60000), // Minutes ago
      }),
    );
  }
}
