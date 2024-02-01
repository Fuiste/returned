import type { z } from "zod";

export type ReturnedStore = {
  get: <T>(key: string) => z.SafeParseSuccess<T> | undefined;
  set: <T>(key: string, value: z.SafeParseSuccess<T>) => void;
  del: (key: string) => void;
  clear: () => void;
};

export const voidStore = (): ReturnedStore => ({
  get: () => undefined,
  set: () => undefined,
  del: () => undefined,
  clear: () => undefined,
});

export const memoryStore = (size = 100): ReturnedStore => {
  let curSz = 0;
  let store: Partial<Record<string, unknown>> = {};
  let keys: string[] = [];

  return {
    get: <T>(key: string) => store[key] as z.SafeParseSuccess<T> | undefined,
    set: (key, value) => {
      if (curSz >= size) {
        delete store[keys.shift()!];
        curSz--;
      }

      store[key] = value;
      keys.push(key);
      curSz++;
    },
    del: (key) => {
      delete store[key];
      keys.splice(keys.indexOf(key), 1);
      curSz--;
    },
    clear: () => {
      store = {};
      keys = [];
      curSz = 0;
    },
  };
};
