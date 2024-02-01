import { describe, it, expect } from "bun:test";
import client from ".";
import { z } from "zod";

describe("client", () => {
  const { returned, mutated } = client();
  const query = async () => 1;
  const mutation = async () => 2;

  it("queries values", async () => {
    const result = await returned(z.number(), query);

    expect(result.success).toBe(true);
    result.success && expect(result.data).toBe(1);
  });

  it("mutates values", async () => {
    const result = await mutated(z.number(), mutation);

    expect(result.success).toBe(true);
    result.success && expect(result.data).toBe(2);
  });
});
