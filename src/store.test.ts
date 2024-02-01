import { describe, it, expect } from "bun:test";
import { STORE } from ".";
import { z } from "zod";

const value = z.number().safeParse(1) as z.SafeParseSuccess<number>;

describe("void store", () => {
  const store = STORE.VOID();

  it("returns undefined for get", () => {
    expect(store.get("key")).toBeUndefined();
  });

  it("returns undefined for set", () => {
    store.set("key", value);
    expect(store.get("key")).toBeUndefined();
  });
});

describe("in-memory store", () => {
  it("returns undefined for misses", () => {
    const store = STORE.MEMORY(1);
    const key = "key";

    store.set(key, value);

    expect(store.get("foobar")).toBeUndefined();
  });

  it("returns the value for hits", () => {
    const store = STORE.MEMORY(1);
    const key = "key";

    store.set(key, value);

    expect(store.get(key)).toBe(value);
  });

  it("evicts the oldest value when full", () => {
    const store = STORE.MEMORY(1);
    const key1 = "key1";
    const key2 = "key2";

    store.set(key1, value);
    store.set(key2, value);

    expect(store.get(key1)).toBeUndefined();
    expect(store.get(key2)).toBe(value);
  });
});
