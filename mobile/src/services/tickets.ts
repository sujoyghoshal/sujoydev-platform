/**
 * Client-side ticket numbers mirror the backend format so users have a
 * reference immediately, even when the submission is queued offline.
 * The backend re-issues the authoritative ticket on sync.
 */
export function generateTicket(prefix: 'PRQ' | 'BUG'): string {
  const now = new Date();
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `${prefix}-${yyyymm}-${rand}`;
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
