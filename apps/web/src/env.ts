/**
 * Detects whether the app is running inside the FiveM NUI (CEF) browser or in
 * a plain desktop browser (standalone site / local dev).
 */
export function isEnvBrowser(): boolean {
  return !(window as unknown as { invokeNative?: unknown }).invokeNative
}

/** The FiveM resource name, used to build the fetchNui callback URL. */
export function getResourceName(): string {
  const win = window as unknown as { GetParentResourceName?: () => string }
  return win.GetParentResourceName?.() ?? 'salets-mdt'
}
