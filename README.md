# returned

Simple caching & async query validation using zod, inspired by [Tanstack Query](https://tanstack.com/query/latest)

```typescript
import r from "returned";
import z from "zod";

const { returned } = r();

const myQuery = async () => await fetch("www.foobar.com").json();

const result = await returned(z.string(), myQuery);

if (result.success) {
  // Do something...
}
```
