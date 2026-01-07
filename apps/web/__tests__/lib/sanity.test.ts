// Simplified sanity tests - focus on testing the logic without module caching issues
// These tests verify the structure and behavior without complex mocking

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("fetchSanity module structure", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchSanity module can be imported", async () => {
    const sanityModule = await import("../../src/lib/sanity");
    expect(sanityModule.fetchSanity).toBeDefined();
    expect(typeof sanityModule.fetchSanity).toBe("function");
  });

  it("module exports are correct", async () => {
    const sanityModule = await import("../../src/lib/sanity");
    expect(sanityModule.fetchSanity).toBeDefined();
  });
});

describe("fetchSanity behavior verification", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns empty object when NEXT_PUBLIC_SANITY_PROJECT_ID is not set", async () => {
    const original = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

    const { fetchSanity } = await import("../../src/lib/sanity");
    const result = await fetchSanity("test query");
    expect(result).toEqual({});

    if (original !== undefined) {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = original;
    }
  });

  it("returns empty object when NEXT_PUBLIC_SANITY_DATASET is not set", async () => {
    const original = process.env.NEXT_PUBLIC_SANITY_DATASET;
    delete process.env.NEXT_PUBLIC_SANITY_DATASET;
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test";

    const { fetchSanity } = await import("../../src/lib/sanity");
    const result = await fetchSanity("test query");
    expect(result).toEqual({});

    if (original !== undefined) {
      process.env.NEXT_PUBLIC_SANITY_DATASET = original;
    }
  });
});
