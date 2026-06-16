// Shared state: tracks which userId the admin is currently viewing.
// Used by chat.js to disable auto-reply when admin is live.
export const activeAdminSessions = new Set();
