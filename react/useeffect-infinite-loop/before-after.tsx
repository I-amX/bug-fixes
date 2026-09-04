import { useEffect, useMemo, useState } from "react";

/**
 * BEFORE
 *
 * Bug:
 * The `options` object is recreated on every render.
 * React sees a new dependency each time, so the effect
 * keeps running after every state update.
 */
export function BuggyUsers() {
  const [users, setUsers] = useState([]);

  const options = {
    role: "admin",
  };

  useEffect(() => {
    fetchUsers(options).then(setUsers);
  }, [options]);

  return (
    <div>
      <h2>Before — Infinite Request Loop</h2>

      <p>Total Users: {users.length}</p>
    </div>
  );
}

/**
 * AFTER
 *
 * Fix:
 * Memoize the object so its reference stays stable.
 */
export function FixedUsers() {
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

  return (
    <div>
      <h2>After — Stable useEffect Dependency</h2>

      <p>Total Users: {users.length}</p>
    </div>
  );
}

/**
 * Mock API function used for demonstration.
 */
async function fetchUsers(options: { role: string }) {
  console.log("Fetching users with:", options);

  return [
    { id: 1, name: "Alice" },
    { id: 2, name: "David" },
  ];
}