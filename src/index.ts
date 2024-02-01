import { z } from "zod";
import { voidStore, type ReturnedStore, memoryStore } from "./store";

type ClientOpts = {
  store?: ReturnedStore;
};

export const STORE = {
  VOID: voidStore,
  MEMORY: memoryStore,
};

export default (
  { store = memoryStore() }: ClientOpts = { store: memoryStore() }
) => ({
  mutated: async <Z extends z.ZodType<any, any>>(
    { safeParse }: Z,
    mutation: () => Promise<unknown>,
    invalidates: string[] = []
  ): Promise<z.SafeParseReturnType<z.infer<Z>, z.infer<Z>>> => {
    const result = safeParse(await mutation());
    if (result.success) invalidates.forEach(store.del);

    return result;
  },
  returned: async <Z extends z.ZodType<any, any, any>>(
    { safeParse }: Z,
    query: () => Promise<unknown>,
    key?: string
  ): Promise<z.SafeParseReturnType<z.infer<Z>, z.infer<Z>>> => {
    if (key) {
      const cached = store.get<z.infer<Z>>(key);
      if (cached) return cached;
    }
    const res = safeParse(await query());
    if (res.success && key) store.set(key, res);

    return res;
  },
  store,
});
