/**
 * Activity Logger Utility
 *
 * Provides a unified function to log user activities to the backend.
 * Import this in any component where a tracked action occurs.
 */

export interface ActivityLogPayload {
  userId?: string | null;
  username?: string;
  type: string;
  description?: string;
}

/**
 * Log a user activity to the backend.
 * This is a fire-and-forget function — it won't throw if the request fails.
 */
export async function logActivity(payload: ActivityLogPayload): Promise<void> {
  try {
    await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail — activity logging should never break the user experience
    console.warn("Failed to log activity:", payload.type);
  }
}

/**
 * Log a search activity.
 */
export function logSearch(userId: string | null | undefined, username: string | undefined, query: string) {
  return logActivity({
    userId: userId || null,
    username: username || "Anonymous",
    type: "search",
    description: `Searched for "${query}"`,
  });
}

/**
 * Log a fragrance view activity.
 */
export function logViewFragrance(userId: string | null | undefined, username: string | undefined, fragranceName: string) {
  return logActivity({
    userId: userId || null,
    username: username || "Anonymous",
    type: "view_fragrance",
    description: `Viewed "${fragranceName}"`,
  });
}

