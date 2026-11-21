import { isValidElement, type CSSProperties, type ReactNode } from 'react'

/** Render values produced by the reference component's `renderVals()` (see
 * `boloLogic.ts`) — a large, dynamically shaped object, so it stays untyped. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BoloVals = any

/** `<sc-for>` semantics: anything that isn't an array renders nothing. */
export function __a(x: unknown): unknown[] {
  return Array.isArray(x) ? x : []
}

/** `{{hole}}` text semantics: null/undefined/booleans render nothing. */
export function __h(x: unknown): ReactNode {
  if (x == null || typeof x === 'boolean') return null
  if (isValidElement(x) || Array.isArray(x)) return x as ReactNode
  return String(x)
}

/** A `style="{{hole}}"` whose value is a whole CSS declaration string. */
export function __css(x: unknown): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of String(x ?? '').split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[key] = decl.slice(i + 1).replace(/!\s*important\s*$/i, '').trim()
  }
  return out as CSSProperties
}

/** A hole inside a mixed attribute/style string. */
export function __s(x: unknown): string {
  return x == null ? '' : String(x)
}
