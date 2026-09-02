# React Bug Fix - Stale State During Multiple Updates

**Difficulty:** Beginner -> Intermediate  
**Technology:** React / TypeScript  
**Category:** State Management

## Problem

A counter was expected to increase by three when a button was clicked.

Instead, it increased by only one.

## Expected Behavior

Clicking the button once should produce:

text
0 -> 1 -> 2 -> 3
Actual Behavior

The counter only increased once:

0 -> 1
Before
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
Root Cause

The three state updates all use the count value captured by the current render.

If the current value is 0, the updates effectively become:

setCount(1);
setCount(1);
setCount(1);

The updates are therefore all based on the same state value.

The problem is not that React ignores the three calls.

The problem is that each call is calculating the next state from the same captured value.

Fix

Use the functional state updater:

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
Why the Fix Works

The functional updater receives the previous state value when React processes the update.

The three updates can therefore be calculated sequentially:

0 -> 1
1 -> 2
2 -> 3

The final result is:

3
General Rule

When the next state depends on the previous state, use:

setState(previous => nextValue);

For example:

setCount(previous => previous + 1);

instead of:

setCount(count + 1);

when multiple updates or asynchronous logic can make the captured value stale.

Why This Matters in Real Applications

This problem can appear in more than simple counters.

The same pattern can cause bugs when updating:

shopping cart quantities
notification counts
pagination state
selected items
scores
counters
arrays of objects
form state
asynchronous state
Prevention

When writing a state update, ask:

Does the new value depend on the previous value?

If yes, prefer a functional updater.

Good
setCount(previous => previous + 1);
Potentially Problematic for Sequential Updates
setCount(count + 1);
Debugging Lesson

The important lesson is not simply to memorize the functional updater syntax.

The important lesson is to understand where the state value came from and when it was captured.

A reliable fix starts by identifying the state value being used by each update.

Summary
Area	Result
Bug	Multiple updates used stale state
Root Cause	Updates referenced the same render's state value
Fix	Functional state updater
Result	All three increments are applied
Prevention	Use functional updates when next state depends on previous state

Key takeaway:

When state depends on previous state, let React provide the previous value to the updater.