# expirable-item

Expirable items allow you to do stuff with items and set a timeout to do something after the timeout expires.

## Simple usage ideas

### Basic usage

```typescript
import { Expirable } from "expirable-item";

console.log("Making expirable...");
let e = new Expirable<number>(13, 5000);
e.expire.then((n) => {
    console.log("The number " + n + " has expired!");
});
```

Output:
```
Making expirable...
The number 13 has expired!
```

### Changing expire time

```typescript
let e = new Expirable<string>("Stringy strings", 50000); //Expire time is 50 seconds
console.log("e expire time: " + e.expire_time);

e.expire.then((s) => {// Don't have to "re-then" to the promise if you change expire time
    console.log("e has expired: " + s);
});

setTimeout(() => {
    console.log("Expire time changing for e");
    e.expire_time = new Date(Date.now() + 2000); //Change expire time to 2 seconds from the moment this line runs, instead of 50 initially
    console.log("e expire new time: " + e.expire_time);
}, 1000);
```

Output:
```
e expire time: Sat Jul 18 2020 16:19:02 GMT-0400 (Eastern Daylight Time)
Expire time changing for e
e expire new time: Sat Jul 18 2020 16:18:15 GMT-0400 (Eastern Daylight Time)
e has expired: Stringy strings
```

## Inspiration

This package was really created to just help focus on a functionality idea I had instead of making it a non-removable part of a larger project. This idea seemed generic enough to be usable elsewhere.
