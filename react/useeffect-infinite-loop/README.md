# React Bug Fix - useEffect Infinite Request Loop

**Difficulty:** Intermediate  
**Technology:** React / TypeScript  
**Category:** Side Effects / Performance

## Problem

A React component was making the same API request repeatedly after rendering.

The request was expected to run once when the component loaded, but it continued to run because an object used in the `useEffect` dependency array was recreated on every render.

## Buggy Code

tsx
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  const options = {
    role: "admin",
  };

  useEffect(() => {
    fetchUsers(options).then(setUsers);
  }, [options]);

  return <UserList users={users} />;
}
Why It Was Broken

The problem was the options object:

const options = {
  role: "admin",
};

This object is created again every time the component renders.

React compares objects in dependency arrays by reference, not by their contents.

So React sees:

Render 1
options → object A

Render 2
options → object B

Render 3
options → object C

Even though the objects contain the same data, they are different object references.

That causes the useEffect dependency to change.

The sequence becomes:

Component renders
       ↓
options gets a new object
       ↓
useEffect runs
       ↓
API request completes
       ↓
setUsers() updates state
       ↓
Component renders again
       ↓
options gets a new object
       ↓
useEffect runs again
       ↓
...

This can result in repeated API requests and unnecessary network traffic.

Fixed Code

One way to fix the problem is to keep the options reference stable with useMemo.

import { useEffect, useMemo, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  const options = useMemo(
    () => ({
      role: "admin",
    }),
    []
  );

  useEffect(() => {
    fetchUsers(options).then(setUsers);
  }, [options]);

  return <UserList users={users} />;
}
Why the Fix Works

useMemo keeps the same options object between renders.

The object is created once:

const options = useMemo(
  () => ({
    role: "admin",
  }),
  []
);

Now the dependency remains stable:

Render 1 → options object A
Render 2 → options object A
Render 3 → options object A

Because the dependency reference does not change, the effect does not repeatedly execute just because the component rendered.

Alternative Fix

For simple values, another option is to depend on the primitive value instead of the object.

const role = "admin";

useEffect(() => {
  fetchUsers({ role }).then(setUsers);
}, [role]);

This can be simpler when the object is only needed inside the effect.

Root Cause

The root cause was an object being recreated during every render and then being used as a useEffect dependency.

The issue was not useEffect itself.

The issue was the unstable object reference used by the dependency array.

Lesson

When using useEffect, pay attention to the values inside the dependency array.

Primitive values such as strings and numbers are compared by value, while objects, arrays, and functions are compared by reference.

An unstable dependency can cause effects to execute more often than expected.

Key takeaway:

A dependency that is recreated on every render can cause useEffect to run repeatedly.