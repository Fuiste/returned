# returned

Simple caching & async query validation using zod, inspired by [Tanstack Query](https://tanstack.com/query/latest)

```typescript
import r from "returned";
import z from "zod";

const { returned, mutated } = r();

const result = await returned(
  // The return schema you expect
  z.string(),
  // Any async unit function
  await fetch("www.foobar.com").json(),
  // A key by which to identify the query
  "myQuery"
);

if (result.success) {
  const { data } = result; // data: number
  // Do something with 'result'
}
```

## Custom Stores

Returned provides a `store` interface to facilitate caching:

```typescript
type ReturnedStore = {
  get: <T>(key: string) => z.SafeParseSuccess<T> | undefined;
  set: <T>(key: string, value: z.SafeParseSuccess<T>) => void;
  del: (key: string) => void;
  clear: () => void;
};
```

Out of the box, 2 `ReturnedStore` implementations are provided:

### `STORE.VOID`

A no-op, if you wish to disable caching.

```typescript
import r, { STORE } from "returned";

const { returned, mutated } = r({ store: STORE.VOID() });
```

### `STORE.MEMORY`

An in-memory LRU cache, with customizable max size.

This is the default behavior, with size 100.

```typescript
import r, { STORE } from "returned";

const { returned, mutated } = r({ store: STORE.MEMORY(100) });
```
