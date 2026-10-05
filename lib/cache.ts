/**
 * Cache leve em memória para dados de leitura frequente (Dashboard, etc.)
 * Evita sobrecarga de consultas SQL repetitivas e é invalidado automaticamente em mutações.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const dashboardCache = new Map<number, CacheEntry<unknown>>();

export function getCachedDashboardStats<T>(userId: number): T | null {
  const entry = dashboardCache.get(userId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    dashboardCache.delete(userId);
    return null;
  }
  return entry.data as T;
}

export function setCachedDashboardStats<T>(userId: number, data: T, ttlMs = 45_000) {
  dashboardCache.set(userId, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

export function invalidateDashboardCache(userId: number) {
  dashboardCache.delete(userId);
}

