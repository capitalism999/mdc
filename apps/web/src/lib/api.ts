/**
 * Single entry point for all data access. Components should only ever import
 * from here (or from `lib/endpoints/*`), never from `lib/mockData` directly —
 * that keeps swapping mocks for a real backend a one-line change.
 *
 * Base URL resolution:
 * - Standalone site / local dev: `VITE_API_BASE_URL` from the Vite env files.
 * - In-game NUI: there is no meaningful "same origin" to call, so the Lua
 *   client is expected to push the real URL down via a `setConfig` NUI
 *   message once on startup (see `useNuiEvent('setConfig', ...)` in `App.tsx`),
 *   letting server owners change it without rebuilding the UI.
 *
 * Until a backend exists, `apiBaseUrl` stays unset and `request()` always
 * falls back to the provided mock data, so every page works out of the box.
 */

let apiBaseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL as
  | string
  | undefined

export function configureApiBaseUrl(url: string) {
  apiBaseUrl = url
}

export async function request<T>(path: string, mockData: T): Promise<T> {
  if (!apiBaseUrl) {
    return mockData
  }

  const resp = await fetch(`${apiBaseUrl}${path}`)
  if (!resp.ok) {
    throw new Error(`API request to ${path} failed: ${resp.status}`)
  }
  return (await resp.json()) as T
}
