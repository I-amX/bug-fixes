# Bug Fixes — Real-World Debugging Case Studies

> **Diagnose the problem. Explain the cause. Apply the fix. Prevent it from happening again.**

A practical collection of programming bugs, debugging investigations, and production-oriented fixes across **React, TypeScript, Flutter, and Dart**.

This repository demonstrates how I approach software problems—not just how I write code.

---

## What This Repository Demonstrates

I use these case studies to demonstrate my ability to:

* investigate unexpected application behavior
* identify the root cause of bugs
* reproduce problems consistently
* understand framework behavior
* write focused fixes
* avoid introducing unnecessary complexity
* explain technical problems clearly
* improve code quality and maintainability
* recognize patterns that can prevent similar bugs

Every case study follows the same process:

```text
Bug
 ↓
Reproduction
 ↓
Root Cause
 ↓
Before
 ↓
Fix
 ↓
After
 ↓
Why It Works
 ↓
Prevention
```

---

# Technologies

| Technology | Areas Covered                             |
| ---------- | ----------------------------------------- |
| React      | State, effects, rendering, async behavior |
| TypeScript | Types, async code, state management       |
| Flutter    | Layout, constraints, widget lifecycle     |
| Dart       | Async operations, lifecycle, null safety  |

---

# Case Studies

## React

### 01 — Stale State During Multiple Updates

**Difficulty:** Beginner → Intermediate
**Technology:** React
**Category:** State Management

### Problem

A counter was expected to increase by three when a button was clicked.

Instead, it increased by only one.

### Before

```tsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <p>{count}</p>

      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
}
```

### Observed Behavior

```text
Initial state: 0

Click button

Expected:
0 → 1 → 2 → 3

Actual:
0 → 1
```

### Root Cause

The three updates all use the `count` value captured by the current render.

If the current value is `0`, React effectively receives:

```tsx
setCount(1);
setCount(1);
setCount(1);
```

The updates are therefore not calculating the next value from the previous update.

### Fix

```tsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
  };

  return (
    <div>
      <p>{count}</p>

      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
}
```

### Why It Works

The functional updater receives the most recent state value.

The updates can therefore be processed as:

```text
0 → 1 → 2 → 3
```

### General Rule

When new state depends on previous state, use:

```tsx
setState(previous => nextValue);
```

instead of relying on a value captured by the current render.

### What I Learned

This bug is a good example of why understanding React's state update model is more important than simply knowing the `useState` API.

---

# React

## 02 — `useEffect` Infinite Request Loop

**Difficulty:** Intermediate
**Technology:** React
**Category:** Effects / Dependencies / Performance

### Problem

A component repeatedly requested the same data after rendering.

### Before

```tsx
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
```

### Root Cause

The `options` object is created again whenever the component renders.

Object comparison is based on reference identity.

Therefore:

```tsx
options !== previousOptions
```

even when both objects contain:

```tsx
{
  role: "admin"
}
```

The sequence becomes:

```text
Render
   ↓
Create options object
   ↓
useEffect runs
   ↓
fetchUsers()
   ↓
setUsers()
   ↓
Render
   ↓
Create NEW options object
   ↓
useEffect runs again
   ↓
...
```

### Fix

```tsx
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
```

### Why It Works

`useMemo` preserves the object reference until its dependencies change.

The effect therefore does not receive a new dependency on every render.

### Important Note

Memoization should not automatically be added to every object in a component.

The better question is:

> "Does this value need stable identity?"

If the value is only used during rendering, memoization may add unnecessary complexity.

### General Rule

Be especially careful when putting these into dependency arrays:

```tsx
{}
[]
() => {}
```

because each render can create a new reference.

---

# Flutter

## 03 — `RenderFlex` Overflow With a Scrollable Widget

**Difficulty:** Intermediate
**Technology:** Flutter / Dart
**Category:** Layout / Constraints

### Problem

A screen containing a header and a `ListView` produced a rendering/layout error.

### Before

```dart
Column(
  children: [
    Container(
      height: 200,
      child: const Text("Header"),
    ),

    ListView(
      children: const [
        ListTile(title: Text("Item 1")),
        ListTile(title: Text("Item 2")),
        ListTile(title: Text("Item 3")),
      ],
    ),
  ],
)
```

### Root Cause

Flutter uses a constraint-based layout system.

The `Column` does not automatically provide the `ListView` with the finite height it needs.

The scrollable widget needs appropriate constraints in order to determine its viewport.

### Fix

```dart
Column(
  children: [
    Container(
      height: 200,
      child: const Text("Header"),
    ),

    Expanded(
      child: ListView(
        children: const [
          ListTile(title: Text("Item 1")),
          ListTile(title: Text("Item 2")),
          ListTile(title: Text("Item 3")),
        ],
      ),
    ),
  ],
)
```

### Why It Works

`Expanded` tells the `Column` to give the `ListView` the remaining available space.

The resulting layout is:

```text
Column
├── Header
│   └── 200px
│
└── Expanded
    └── ListView
        └── Remaining available space
```

The `ListView` now receives bounded constraints and can scroll correctly.

### General Rule

When placing a scrollable widget inside a `Column`, determine whether it needs:

```dart
Expanded(...)
```

or:

```dart
SizedBox(...)
```

depending on the intended layout.

---

# Why These Examples Matter

Knowing syntax is not enough to fix software.

A useful developer should be able to answer:

1. What is actually going wrong?
2. Can I reproduce the problem?
3. What assumption in the original code is incorrect?
4. What framework behavior causes the problem?
5. What is the smallest safe fix?
6. Could the fix introduce another problem?
7. How can the same bug be prevented?

That is the approach demonstrated throughout this repository.

---

# Freelance Development Services

I am interested in freelance work involving:

### React / Next.js

* React bug fixing
* state management problems
* `useEffect` issues
* component rendering problems
* API integration bugs
* TypeScript errors
* frontend debugging
* responsive UI fixes

### Flutter

* layout problems
* `RenderFlex` errors
* widget lifecycle issues
* state management bugs
* asynchronous operation problems
* UI rendering issues
* Dart errors

### General Debugging

* reproduce difficult bugs
* identify root causes
* fix existing implementations
* clean up problematic code
* investigate unexpected behavior
* improve application reliability

---

# How I Approach a Bug

I generally work through a problem using this process:

```text
1. Understand
   ↓
2. Reproduce
   ↓
3. Isolate
   ↓
4. Identify root cause
   ↓
5. Implement minimal fix
   ↓
6. Test
   ↓
7. Explain
   ↓
8. Prevent regression
```

The objective is not simply:

> "Make the error disappear."

The objective is:

> **Understand why it happened and make the code safer afterward.**

---

# Repository Roadmap

More debugging case studies will be added over time.

### React

* [x] Stale state updates
* [x] `useEffect` dependency loop
* [ ] Async race condition
* [ ] State update after unmount
* [ ] Unnecessary re-render
* [ ] Controlled/uncontrolled input bug
* [ ] React key rendering bug
* [ ] Context performance issue
* [ ] Failed API request state
* [ ] Form validation state bug

### Flutter

* [x] `RenderFlex` overflow
* [ ] `setState()` after `dispose()`
* [ ] Async lifecycle bug
* [ ] `ListView` inside `Column`
* [ ] Incorrect `FutureBuilder` state
* [ ] Widget rebuild performance issue
* [ ] Keyboard overflow
* [ ] Image loading/layout issue
* [ ] Navigation lifecycle bug

---

# Quality Standard

Every new case study should answer:

* **What broke?**
* **How was it reproduced?**
* **What caused it?**
* **What was wrong with the original implementation?**
* **What changed?**
* **Why does the fix work?**
* **What are the trade-offs?**
* **How can the bug be prevented?**

---

# Contact

If you need help debugging a React, Next.js, TypeScript, Flutter, or Dart application, feel free to reach out.

**Available for freelance debugging and development work.**

---

## About This Repository

This repository is continuously updated with new debugging case studies as I encounter, investigate, and solve different software problems.

The purpose is to demonstrate practical engineering ability through **problem → investigation → solution**, rather than simply displaying finished code.

---

**If you find a useful case study here, feel free to ⭐ the repository.**
