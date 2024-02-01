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
  { store = voidStore() }: ClientOpts = { store: voidStore() }
) => {
  const returned = async <Z extends z.ZodType<any, any>>(
    schema: Z,
    query: () => Promise<unknown>,
    key?: string
  ) => {
    const cached = key ? store.get<z.infer<Z>>(key) : undefined;

    return cached ? cached : schema.safeParse(await query());
  };

  const mutated = async <Z extends z.ZodType<any, any>>(
    schema: Z,
    mutation: () => Promise<unknown>,
    invalidates: string[] = []
  ) => {
    const result = schema.safeParse(await mutation());

    if (result.success) invalidates.forEach(store.del);

    return result;
  };

  return { mutated, returned, store };
};
