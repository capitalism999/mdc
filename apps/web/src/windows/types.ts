export interface WindowInstance {
  id: string
  appId: string
  /** Dedupe/focus key: `appId` for regular singleton module windows, or
   * `${entityType}:${entityId}` for entity-detail cards opened via
   * cross-module navigation (see `useEntityNavigation`) — this lets several
   * entity cards of the same module (e.g. two different vehicles) stay open
   * as separate windows while still deduping re-opens of the same entity. */
  instanceKey: string
  title: string
  icon: string
  breadcrumb: string[]
  /** Parameters the module should use to initialize its internal view
   * (e.g. `{ entityType: 'vehicle', entityId: 'v1' }`) — set once when the
   * window is first opened via `openWindow(app, { initialParams })`. */
  initialParams?: Record<string, unknown>
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  restoreBounds: { x: number; y: number; width: number; height: number } | null
  /** Bumped by `reloadWindow` («ОБНОВИТЬ»): used as the content's React key,
   * so the module re-mounts and loads its data again. */
  reloadKey?: number
  /** Set by the module to make the window chrome's back arrow navigate one
   * step up its internal view stack (e.g. results → search); `undefined`
   * when there's nowhere to go back to (hides/disables the arrow). */
  onBack?: () => void
  /** Set by the module to make the window chrome's forward arrow redo a step
   * just undone via `onBack` (e.g. search → results); `undefined` when
   * there's nowhere to go forward to (hides/disables the arrow). */
  onForward?: () => void
}
