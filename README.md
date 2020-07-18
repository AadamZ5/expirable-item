# expirable-item

Expirable items allow you to do stuff with items and set a timeout to do something after the timeout expires.

## Simple usage ideas

```typescript
import { Expirable } from "../dist";

console.log("Making expirable...");
let e = new Expirable<number>(13, 5000);
e.expire.then((n) => {
    console.log("The number " + n + " has expired!");
});
```

## Inspiration

This package was really created to just help focus on a functionality idea I had instead of making it a non-removable part of a larger project. This idea seemed generic enough to be usable elsewhere.
