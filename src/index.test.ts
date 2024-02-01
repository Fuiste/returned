import { describe, it, expect } from "bun:test";
import client, { STORE } from ".";
import { z } from "zod";

describe("returned", () => {
  const { returned, store } = client({ store: STORE.MEMORY(1) });
  const query = async () => 1;

  it("queries values", async () => {
    const result = await returned(z.number(), query);

    expect(result.success).toBe(true);
    result.success && expect(result.data).toBe(1);
  });

  it("caches values when a key is provided", async () => {
    const result = await returned(z.number(), query, "key");

    expect(result.success).toBe(true);
    result.success && expect(result.data).toBe(1);
    result.success && expect(store.get("key")).toBe(result);
  });
});

describe("mutated", () => {
  const { returned, mutated, store } = client({ store: STORE.MEMORY(1) });
  const mutation = async () => 1;

  it("mutates values", async () => {
    const result = await mutated(z.number(), mutation);

    expect(result.success).toBe(true);
    result.success && expect(result.data).toBe(1);
  });

  it("invalidates queries when required", async () => {
    const result = await returned(z.number(), mutation, "key");
    expect(result.success).toBe(true);
    result.success && expect(store.get("key")).toStrictEqual(result);

    await mutated(z.number(), mutation, ["key"]);
    expect(store.get("key")).toBeUndefined();
  });
});
