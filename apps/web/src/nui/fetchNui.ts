import { getResourceName, isEnvBrowser } from '../env'

/**
 * Sends data from the NUI (React) to the Lua client script and awaits its
 * response. In plain-browser mode (no FiveM present) this resolves with
 * `mockData` instead of making a real network call, so the app stays fully
 * usable during `pnpm dev` / standalone hosting without a Lua backend.
 */
export async function fetchNui<T = unknown>(
  eventName: string,
  data: unknown = {},
  mockData?: T,
): Promise<T> {
  if (isEnvBrowser()) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return mockData as T
  }

  const resp = await fetch(`https://${getResourceName()}/${eventName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data),
  })

  return (await resp.json()) as T
}
