/**
 * Test fixtures and data factories index
 * Central export point for all test data utilities
 */

// Core mock data
export * from "./session-state";

// Factories for generating test data
export * from "./factories";

// Re-export commonly used types for convenience
export type {
  Session,
  Contributor,
  Segment,
  SessionState,
  VoteStatus,
  AnonymousIdentity,
  CreateSessionRequest,
  JoinSessionRequest,
  SubmitSegmentRequest,
} from "@/lib/types";
