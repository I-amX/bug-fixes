import { useState } from "react";

/**
 * BEFORE
 *
 * Bug:
 * Each update uses the `count` value captured by
 * the current render.
 */
export function BuggyCounter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Before — Buggy Counter</h2>

      <p>Count: {count}</p>

      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
}

/**
 * AFTER
 *
 * Fix:
 * Each update receives the previous state value.
 */
export function FixedCounter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
  };

  return (
    <div>
      <h2>After — Fixed Counter</h2>

      <p>Count: {count}</p>

      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
}