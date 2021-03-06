# expirable-item

Expirable items allow you to do stuff with items and set a timeout to do something after the timeout expires.
This is written in TypeScript and uses native Promises.

## Install

`npm i expirable-item`

## Examples

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

e.expire.then((s) => {// Don't have to "re-then" to the promise if you change expire time before it expires
    console.log("e has expired: " + s);
});

setTimeout(() => {
    console.log("Expire time changing for e");
    e.expire_time = new Date(Date.now() + 2000); //Change expire time to 2 seconds from the moment this line runs, instead of 50 initially
    //e.set_expire_time(2000); //This will do the same thing as above, but this function recognizes Date and number types.
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

### Restarting expired item

```typescript
async function example(){
    let e = new Expirable<string>("Stringy strings", 1000); //Expire time is 1 second

    let s = await e.expire;
    console.log("e has expired: " + s);
    e.set_expire_time(1000); //Reset expire time to 1 second

    s = await e.expire; //You must "re-await" or "re-then" the expire promise, as a new one is created after the Expirable has initially expired.
                        //Promises by design can only return one value. If you're looking for a way around this, check out `expirable-item-rxjs`.
    console.log("e has expired again: " + s);
}

example();
```

Output:
```
e has expired: Stringy strings
e has expired again: Stringy strings
```

## Usage ideas

- Refreshing items after a certain amount of time
- Removing items after a certain amount of time
- Dynamically changing a timeout for an item

## Inspiration

This package was really created to just help focus on a functionality idea I had instead of making it a non-removable part of a larger project. This idea seemed generic enough to be usable elsewhere.

It's important to note that this library doesn't offer a bunch of over complicated features. You could probably make the exact same thing in little time, or even argue that this library isn't necessary. I wouldn't disagree, but I would argue that it is convenient to have. I didn't have anything that specifically fit my needs, so I made this and decided to make it a small package.
